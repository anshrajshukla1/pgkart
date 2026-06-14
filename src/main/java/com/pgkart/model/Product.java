package com.pgkart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @NotBlank
    @Size(min = 3)
    private String productName;

    private String image;

    @NotBlank
    @Size(min = 6)
    private String productDescription;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal discount;

    private BigDecimal specialPrice;

    // Inventory management
    private Integer stockQuantity = 0;

    private Integer lowStockThreshold = 5;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<CartItem> cartItems = new ArrayList<>();
}
