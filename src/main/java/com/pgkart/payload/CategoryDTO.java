package com.pgkart.payload;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    private Long categoryId;

    @NotBlank
    @Size(min = 3)
    private String categoryName;
}
