package com.pgkart.payload;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String userName;
    private String email;
    private List<String> roles;
    private List<AddressDTO> addresses;
}
