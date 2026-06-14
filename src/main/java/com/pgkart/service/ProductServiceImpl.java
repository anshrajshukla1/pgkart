package com.pgkart.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pgkart.exceptions.ApiException;
import com.pgkart.exceptions.ResourceNotFoundException;
import com.pgkart.model.Category;
import com.pgkart.model.Product;
import com.pgkart.payload.ProductDTO;
import com.pgkart.payload.ProductResponse;
import com.pgkart.repositories.CategoryRepository;
import com.pgkart.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final Cloudinary cloudinary;

    @Override
    @Transactional
    public ProductDTO addProduct(ProductDTO productDTO, Long categoryId, MultipartFile image) throws IOException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId.toString()));

        Product product = modelMapper.map(productDTO, Product.class);
        product.setCategory(category);

        product.setSpecialPrice(calculateSpecialPrice(product.getPrice(), product.getDiscount()));

        if (product.getStockQuantity() == null) {
            product.setStockQuantity(product.getQuantity() != null ? product.getQuantity() : 0);
        }

        if (image != null && !image.isEmpty()) {
            product.setImage(uploadToCloudinary(image));
        }

        Product saved = productRepository.save(product);
        ProductDTO result = modelMapper.map(saved, ProductDTO.class);
        result.setCategoryName(category.getCategoryName());
        return result;
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Product> page = productRepository.findAll(pageable);
        return buildResponse(page);
    }

    @Override
    public ProductResponse getProductsByCategory(Long categoryId, Integer pageNumber, Integer pageSize,
                                                  String sortBy, String sortOrder) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId.toString()));
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Product> page = productRepository.findByCategoryCategoryId(categoryId, pageable);
        return buildResponse(page);
    }

    @Override
    public ProductResponse searchProducts(String keyword, Integer pageNumber, Integer pageSize,
                                          String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Product> page = productRepository.findByProductNameContainingIgnoreCase(keyword, pageable);
        return buildResponse(page);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) throws IOException {
        Product existing = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId.toString()));

        if (productDTO.getProductName() != null) {
            existing.setProductName(productDTO.getProductName());
        }
        if (productDTO.getProductDescription() != null) {
            existing.setProductDescription(productDTO.getProductDescription());
        }
        if (productDTO.getPrice() != null && productDTO.getPrice().compareTo(BigDecimal.ZERO) != 0) {
            existing.setPrice(productDTO.getPrice());
            existing.setDiscount(productDTO.getDiscount() != null ? productDTO.getDiscount() : BigDecimal.ZERO);
            existing.setSpecialPrice(calculateSpecialPrice(productDTO.getPrice(), productDTO.getDiscount()));
        }
        if (productDTO.getQuantity() != null) {
            existing.setQuantity(productDTO.getQuantity());
            existing.setStockQuantity(productDTO.getQuantity());
        }
        if (productDTO.getStockQuantity() != null) {
            existing.setStockQuantity(productDTO.getStockQuantity());
        }
        if (productDTO.getLowStockThreshold() != null) {
            existing.setLowStockThreshold(productDTO.getLowStockThreshold());
        }


        Product saved = productRepository.save(existing);
        ProductDTO result = modelMapper.map(saved, ProductDTO.class);
        if (saved.getCategory() != null) {
            result.setCategoryName(saved.getCategory().getCategoryName());
        }
        return result;
    }

    @Override
    @Transactional
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId.toString()));
        product.setImage(uploadToCloudinary(image));
        return modelMapper.map(productRepository.save(product), ProductDTO.class);
    }

    @Override
    @Transactional
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId.toString()));
        productRepository.delete(product);
        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId.toString()));
        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getCategoryName());
        }
        return dto;
    }

    @Override
    public List<ProductDTO> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());
    }



    // ─── Private helpers ──────────────────────────────────────────────────────

    /**
     * Calculates special price: price - (discount% / 100) * price
     * Uses BigDecimal arithmetic to avoid floating-point errors.
     */
    private BigDecimal calculateSpecialPrice(BigDecimal price, BigDecimal discount) {
        if (price == null) return BigDecimal.ZERO;
        if (discount == null || discount.compareTo(BigDecimal.ZERO) == 0) return price;
        BigDecimal discountAmount = discount
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                .multiply(price);
        return price.subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);
    }

    private String uploadToCloudinary(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "pgkart/products", "resource_type", "image"));
        return result.get("secure_url").toString();
    }

    private ProductResponse buildResponse(Page<Product> page) {
        List<ProductDTO> dtos = page.getContent().stream().map(p -> {
            ProductDTO dto = modelMapper.map(p, ProductDTO.class);
            if (p.getCategory() != null) {
                dto.setCategoryName(p.getCategory().getCategoryName());
            }
            return dto;
        }).collect(Collectors.toList());

        ProductResponse response = new ProductResponse();
        response.setContent(dtos);
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLastPage(page.isLast());
        return response;
    }
}
