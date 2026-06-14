package com.pgkart.payload;

import lombok.*;

import java.math.BigDecimal;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsResponse {
    private Long totalOrders;
    private Long todayOrders;
    private BigDecimal totalRevenue;
    private BigDecimal monthRevenue;
    private Long totalUsers;
    private Long totalProducts;
    private Long lowStockProducts;
    private List<Map<String, Object>> salesByDay;
    private List<Map<String, Object>> topProducts;
    private List<Map<String, Object>> ordersByStatus;
}
