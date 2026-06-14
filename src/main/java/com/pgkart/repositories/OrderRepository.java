package com.pgkart.repositories;

import com.pgkart.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByEmail(String email);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.email = :email")
    List<Order> findByEmailWithItems(@org.springframework.data.repository.query.Param("email") String email);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.orderId = :orderId")
    java.util.Optional<Order> findByIdWithItems(@org.springframework.data.repository.query.Param("orderId") Long orderId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderDate >= ?1")
    BigDecimal sumRevenueFromDate(LocalDate fromDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate = ?1")
    Long countOrdersByDate(LocalDate date);

    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> countByOrderStatus();

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN ?1 AND ?2")
    List<Order> findOrdersBetweenDates(LocalDate from, LocalDate to);
}
