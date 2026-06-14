package com.pgkart.repositories;

import com.pgkart.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.product.productId, oi.product.productName, SUM(oi.orderedProductPrice * oi.quantity) as revenue " +
           "FROM OrderItem oi " +
           "GROUP BY oi.product.productId, oi.product.productName " +
           "ORDER BY revenue DESC")
    List<Object[]> findTopProductsByRevenue();
}
