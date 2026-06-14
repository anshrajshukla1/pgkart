package com.pgkart.controller;

import com.pgkart.payload.CartDTO;
import com.pgkart.service.CartService;
import com.pgkart.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthUtil authUtil;

    @GetMapping("/users/cart")
    public ResponseEntity<CartDTO> getUserCart() {
        String email = authUtil.loggedInEmail();
        return ResponseEntity.ok(cartService.getCartForUser(email));
    }

    @PostMapping("/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> addToCart(
            @PathVariable Long productId,
            @PathVariable Integer quantity) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cartService.addProductToCart(productId, quantity));
    }

    @PutMapping("/{cartId}/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> updateQuantity(
            @PathVariable Long cartId,
            @PathVariable Long productId,
            @PathVariable Integer quantity) {
        return ResponseEntity.ok(cartService.updateProductQuantityInCart(cartId, productId, quantity));
    }

    @DeleteMapping("/{cartId}/product/{productId}")
    public ResponseEntity<String> removeFromCart(
            @PathVariable Long cartId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.deleteProductFromCart(cartId, productId));
    }
}
