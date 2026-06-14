package com.pgkart.service;

import com.pgkart.model.Order;
import com.pgkart.payload.AnalyticsResponse;
import com.pgkart.repositories.OrderItemRepository;
import com.pgkart.repositories.OrderRepository;
import com.pgkart.repositories.ProductRepository;
import com.pgkart.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Computes dashboard analytics for the PGKart admin panel.
 *
 * <p>All data is read directly from repositories via custom JPQL queries,
 * keeping the service layer thin and the SQL close to the data access layer.</p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final OrderRepository     orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository   productRepository;
    private final UserRepository      userRepository;

    // Earliest date used for "total revenue since inception" queries
    private static final LocalDate EPOCH_DATE = LocalDate.of(2020, 1, 1);

    // ------------------------------------------------------------------ //
    //  Public API                                                          //
    // ------------------------------------------------------------------ //

    /**
     * Assembles a full {@link AnalyticsResponse} with:
     * <ul>
     *   <li>Aggregate counts (orders, users, products, low-stock items)</li>
     *   <li>Revenue totals (all-time and current month)</li>
     *   <li>Day-by-day revenue + order counts for the last 30 days</li>
     *   <li>Top 10 products by revenue</li>
     *   <li>Order counts grouped by status</li>
     * </ul>
     */
    @Override
    public AnalyticsResponse getDashboardAnalytics() {
        log.info("Building dashboard analytics snapshot");

        AnalyticsResponse response = new AnalyticsResponse();

        // ---- Aggregate counts ----------------------------------------- //
        response.setTotalOrders(orderRepository.count());
        response.setTodayOrders(orderRepository.countOrdersByDate(LocalDate.now()));
        response.setTotalUsers(userRepository.count());
        response.setTotalProducts(productRepository.count());
        response.setLowStockProducts((long) productRepository.findLowStockProducts().size());

        // ---- Revenue --------------------------------------------------- //
        BigDecimal totalRevenue = orderRepository.sumRevenueFromDate(EPOCH_DATE);
        response.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        BigDecimal monthRevenue = orderRepository.sumRevenueFromDate(LocalDate.now().withDayOfMonth(1));
        response.setMonthRevenue(monthRevenue != null ? monthRevenue : BigDecimal.ZERO);

        // ---- Sales by day (last 30 days) ------------------------------- //
        response.setSalesByDay(buildSalesByDay(LocalDate.now(), 30));

        // ---- Top 10 products by revenue -------------------------------- //
        response.setTopProducts(buildTopProducts(10));

        // ---- Orders by status ----------------------------------------- //
        response.setOrdersByStatus(buildOrdersByStatus());

        log.info("Dashboard analytics snapshot built successfully");
        return response;
    }

    // ------------------------------------------------------------------ //
    //  Private helpers                                                     //
    // ------------------------------------------------------------------ //

    /**
     * Builds a day-by-day breakdown of revenue and order count.
     *
     * @param endDate reference end date (inclusive)
     * @param days    number of days to look back from {@code endDate}
     * @return list of maps, each containing {@code date}, {@code revenue}, and {@code orders}
     */
    private List<Map<String, Object>> buildSalesByDay(LocalDate endDate, int days) {
        List<Map<String, Object>> salesByDay = new ArrayList<>(days);

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = endDate.minusDays(i);

            List<Order> dayOrders = orderRepository.findOrdersBetweenDates(date, date);
            BigDecimal dayRevenue = dayOrders.stream()
                    .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> entry = new HashMap<>(3);
            entry.put("date",    date.toString());
            entry.put("revenue", dayRevenue);
            entry.put("orders",  dayOrders.size());
            salesByDay.add(entry);
        }
        return salesByDay;
    }

    /**
     * Fetches the top-N products ranked by total revenue generated.
     *
     * @param limit maximum number of products to return
     * @return list of maps containing {@code productId}, {@code productName}, and {@code revenue}
     */
    private List<Map<String, Object>> buildTopProducts(int limit) {
        List<Object[]> raw = orderItemRepository.findTopProductsByRevenue();
        List<Map<String, Object>> topProducts = new ArrayList<>(Math.min(raw.size(), limit));

        for (int i = 0; i < Math.min(raw.size(), limit); i++) {
            Object[] row = raw.get(i);
            Map<String, Object> entry = new HashMap<>(3);
            entry.put("productId",   row[0]);
            entry.put("productName", row[1]);
            entry.put("revenue",     row[2]);
            topProducts.add(entry);
        }
        return topProducts;
    }

    /**
     * Returns the number of orders for each distinct order status.
     *
     * @return list of maps containing {@code status} and {@code count}
     */
    private List<Map<String, Object>> buildOrdersByStatus() {
        List<Object[]> raw = orderRepository.countByOrderStatus();
        List<Map<String, Object>> byStatus = new ArrayList<>(raw.size());

        for (Object[] row : raw) {
            Map<String, Object> entry = new HashMap<>(2);
            entry.put("status", row[0]);
            entry.put("count",  row[1]);
            byStatus.add(entry);
        }
        return byStatus;
    }
}
