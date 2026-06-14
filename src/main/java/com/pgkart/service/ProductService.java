package com.pgkart.service;

import com.pgkart.payload.ProductDTO;
import com.pgkart.payload.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    ProductDTO addProduct(ProductDTO productDTO, Long categoryId, MultipartFile image) throws IOException;

    ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse getProductsByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProducts(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProduct(Long productId, ProductDTO productDTO) throws IOException;

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

    ProductDTO deleteProduct(Long productId);

    ProductDTO getProductById(Long productId);

    List<ProductDTO> getLowStockProducts();

}
