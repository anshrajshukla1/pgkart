package com.pgkart.controller;

import com.pgkart.config.AppConstants;
import com.pgkart.payload.APIResponse;
import com.pgkart.payload.ProductDTO;
import com.pgkart.payload.ProductResponse;
import com.pgkart.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(defaultValue = AppConstants.SORT_PRODUCTS_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortOrder) {
        return ResponseEntity.ok(productService.getAllProducts(pageNumber, pageSize, sortBy, sortOrder));
    }

    @GetMapping("/public/products/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(defaultValue = AppConstants.SORT_PRODUCTS_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortOrder) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId, pageNumber, pageSize, sortBy, sortOrder));
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponse> searchProducts(
            @PathVariable String keyword,
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(defaultValue = AppConstants.SORT_PRODUCTS_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.SORT_DIR) String sortOrder) {
        return ResponseEntity.ok(productService.searchProducts(keyword, pageNumber, pageSize, sortBy, sortOrder));
    }


    // ─── ADMIN ENDPOINTS ──────────────────────────────────────────────────────

    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProduct(
            @PathVariable Long categoryId,
            @Valid @RequestBody ProductDTO productDTO) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.addProduct(productDTO, categoryId, null));
    }

    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductDTO productDTO) throws IOException {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO));
    }

    @PutMapping({"/admin/products/{productId}/image", "/admin/products/{productId}/image/"})
    public ResponseEntity<ProductDTO> updateProductImage(
            @PathVariable Long productId,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(productService.updateProductImage(productId, image));
    }

    @DeleteMapping({"/admin/products/{productId}", "/admin/product/{productId}"})
    public ResponseEntity<APIResponse> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(new APIResponse("Product deleted", true));
    }

    @GetMapping("/admin/products/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    @PutMapping("/admin/products/{productId}/stock")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long productId,
            @RequestBody ProductDTO productDTO) throws IOException {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO));
    }
}
