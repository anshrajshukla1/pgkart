package com.pgkart.service;

import com.pgkart.exceptions.ApiException;
import com.pgkart.exceptions.ResourceNotFoundException;
import com.pgkart.model.Cart;
import com.pgkart.model.CartItem;
import com.pgkart.model.Product;
import com.pgkart.payload.CartDTO;
import com.pgkart.payload.ProductDTO;
import com.pgkart.repositories.CartItemRepository;
import com.pgkart.repositories.CartRepository;
import com.pgkart.repositories.ProductRepository;
import com.pgkart.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final AuthUtil authUtil;

    @Override
    @Transactional
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        String email = authUtil.loggedInEmail();

        Cart cart = cartRepository.findCartByEmail(email);
        if (cart == null) {
            cart = new Cart();
            cart.setUser(authUtil.loggedInUser());
            cart.setTotalPrice(BigDecimal.ZERO);
            cart = cartRepository.save(cart);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId.toString()));

        int available = (product.getStockQuantity() != null) ? product.getStockQuantity() : 0;
        if (available < quantity) {
            throw new ApiException("Insufficient stock for product: " + product.getProductName());
        }

        CartItem existingItem = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setDiscount(product.getDiscount() != null ? product.getDiscount() : BigDecimal.ZERO);
            // Use specialPrice if > 0, else fall back to price
            BigDecimal specialPrice = product.getSpecialPrice();
            BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
            item.setProductPrice(
                    (specialPrice != null && specialPrice.compareTo(BigDecimal.ZERO) > 0) ? specialPrice : price
            );
            cartItemRepository.save(item);
            cart.getCartItems().add(item);
        }

        recalculateTotal(cart);
        return buildCartDTO(cartRepository.save(cart));
    }

    @Override
    @Transactional(readOnly = true)
    public CartDTO getCartForUser(String email) {
        Cart cart = cartRepository.findCartByEmail(email);
        if (cart == null) {
            return new CartDTO();
        }
        return buildCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "id", cartId.toString()));

        CartItem item = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);
        if (item == null) {
            throw new ApiException("Product not found in cart");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            cart.getCartItems().removeIf(ci -> ci.getProduct().getProductId().equals(productId));
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        recalculateTotal(cart);
        return buildCartDTO(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "id", cartId.toString()));

        CartItem item = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);
        if (item != null) {
            cartItemRepository.delete(item);
            cart.getCartItems().removeIf(ci -> ci.getProduct().getProductId().equals(productId));
        }

        recalculateTotal(cart);
        cartRepository.save(cart);
        return "Product removed from cart";
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cart.getCartItems().stream()
                .map(i -> {
                    BigDecimal price = i.getProductPrice() != null ? i.getProductPrice() : BigDecimal.ZERO;
                    return price.multiply(BigDecimal.valueOf(i.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
    }

    private CartDTO buildCartDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());
        dto.setTotalPrice(cart.getTotalPrice());

        List<ProductDTO> products = cart.getCartItems().stream()
                .map(item -> {
                    ProductDTO pDto = modelMapper.map(item.getProduct(), ProductDTO.class);
                    pDto.setQuantity(item.getQuantity());
                    return pDto;
                })
                .collect(Collectors.toList());
        dto.setProducts(products);
        return dto;
    }
}
