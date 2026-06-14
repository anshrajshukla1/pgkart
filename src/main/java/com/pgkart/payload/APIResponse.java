package com.pgkart.payload;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class APIResponse {
    private String message;
    private Boolean status;
}
