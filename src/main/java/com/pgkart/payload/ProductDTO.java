package com.pgkart.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long productId;
    private String productName;
    private String image;

    @JsonProperty("description")
    private String productDescription;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal specialPrice;
    private Integer stockQuantity;
    private Integer lowStockThreshold;

    private String categoryName;
}
