package com.pgkart.service;

import com.pgkart.payload.CartDTO;

public interface CartService {

    CartDTO addProductToCart(Long productId, Integer quantity);

    CartDTO getCartForUser(String email);

    CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity);

    String deleteProductFromCart(Long cartId, Long productId);
}
