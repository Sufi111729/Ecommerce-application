package com.sufi.marketplace.service;

import com.sufi.marketplace.dto.ProductCreateRequest;
import com.sufi.marketplace.dto.ProductResponse;
import com.sufi.marketplace.dto.ProductUpdateRequest;
import com.sufi.marketplace.dto.ProductVariantRequest;
import com.sufi.marketplace.dto.SellerInventorySummary;
import com.sufi.marketplace.entity.Category;
import com.sufi.marketplace.entity.Inventory;
import com.sufi.marketplace.entity.Product;
import com.sufi.marketplace.entity.ProductImage;
import com.sufi.marketplace.entity.ProductVariant;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.ProductStatus;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.CategoryRepository;
import com.sufi.marketplace.repository.InventoryRepository;
import com.sufi.marketplace.repository.ProductImageRepository;
import com.sufi.marketplace.repository.ProductRepository;
import com.sufi.marketplace.repository.ProductVariantRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final InventoryRepository inventoryRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(
        ProductRepository productRepository,
        ProductImageRepository productImageRepository,
        ProductVariantRepository productVariantRepository,
        InventoryRepository inventoryRepository,
        CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductResponse createProduct(User seller, ProductCreateRequest request) {
        Category category = categoryRepository
            .findById(request.getCategoryId())
            .orElseThrow(() -> new NotFoundException("Category not found"));
        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category);
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setStatus(ProductStatus.DRAFT);
        productRepository.save(product);

        if (request.getImages() != null) {
            for (String url : request.getImages()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setUrl(url);
                productImageRepository.save(img);
            }
        }

        for (ProductVariantRequest variantRequest : request.getVariants()) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setSku(variantRequest.getSku());
            variant.setAttributesJson(variantRequest.getAttributesJson());
            variant.setPrice(variantRequest.getPrice());
            variant.setMrp(variantRequest.getMrp());
            productVariantRepository.save(variant);

            Inventory inventory = new Inventory();
            inventory.setVariant(variant);
            inventory.setStockQty(variantRequest.getStockQty());
            inventoryRepository.save(inventory);
        }
        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(User seller, Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found"));
        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new NotFoundException("Product not found");
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));
            product.setCategory(category);
        }
        if (request.getTitle() != null) {
            product.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        productRepository.save(product);
        if (request.getImages() != null) {
            List<ProductImage> existing = productImageRepository.findAll()
                .stream()
                .filter(img -> img.getProduct().getId().equals(product.getId()))
                .toList();
            productImageRepository.deleteAll(existing);
            for (String url : request.getImages()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setUrl(url);
                productImageRepository.save(img);
            }
        }
        if (request.getVariants() != null) {
            List<ProductVariant> existingVariants = productVariantRepository.findAll()
                .stream()
                .filter(v -> v.getProduct().getId().equals(product.getId()))
                .toList();
            for (ProductVariant variant : existingVariants) {
                inventoryRepository.deleteById(variant.getId());
            }
            productVariantRepository.deleteAll(existingVariants);
            for (ProductVariantRequest variantRequest : request.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                variant.setSku(variantRequest.getSku());
                variant.setAttributesJson(variantRequest.getAttributesJson());
                variant.setPrice(variantRequest.getPrice());
                variant.setMrp(variantRequest.getMrp());
                productVariantRepository.save(variant);
                Inventory inventory = new Inventory();
                inventory.setVariant(variant);
                inventory.setStockQty(variantRequest.getStockQty());
                inventoryRepository.save(inventory);
            }
        }
        return toResponse(product);
    }

    public void submitForApproval(User seller, Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found"));
        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new NotFoundException("Product not found");
        }
        product.setStatus(ProductStatus.PENDING);
        productRepository.save(product);
    }

    public List<ProductResponse> listApprovedProducts() {
        return productRepository.findByStatus(ProductStatus.APPROVED)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<ProductResponse> listSellerProducts(User seller) {
        return productRepository.findBySeller(seller)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public SellerInventorySummary getSellerInventorySummary(User seller) {
        List<Product> products = productRepository.findBySeller(seller);
        List<ProductVariant> variants = productVariantRepository.findByProductSeller(seller);
        List<Long> variantIds = variants.stream().map(ProductVariant::getId).toList();
        Map<Long, Integer> stockByVariant = new HashMap<>();
        inventoryRepository.findAllById(variantIds)
            .forEach(inv -> stockByVariant.put(inv.getVariantId(), inv.getStockQty() == null ? 0 : inv.getStockQty()));

        int totalStock = 0;
        int lowStock = 0;
        for (ProductVariant variant : variants) {
            int stock = stockByVariant.getOrDefault(variant.getId(), 0);
            totalStock += stock;
            if (stock > 0 && stock < 5) {
                lowStock++;
            }
        }

        return new SellerInventorySummary(
            products.size(),
            variants.size(),
            lowStock,
            totalStock
        );
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found"));
        return toResponse(product);
    }

    public List<Product> listPendingProducts() {
        return productRepository.findByStatus(ProductStatus.PENDING);
    }

    public void approveProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setStatus(ProductStatus.APPROVED);
        productRepository.save(product);
    }

    public void rejectProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setStatus(ProductStatus.REJECTED);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        List<String> images = productImageRepository.findAll()
            .stream()
            .filter(img -> img.getProduct().getId().equals(product.getId()))
            .map(ProductImage::getUrl)
            .toList();
        List<ProductVariant> variants = productVariantRepository.findAll()
            .stream()
            .filter(v -> v.getProduct() != null && v.getProduct().getId().equals(product.getId()))
            .toList();
        java.math.BigDecimal minPrice = variants.stream()
            .map(ProductVariant::getPrice)
            .min(java.math.BigDecimal::compareTo)
            .orElse(null);
        Long defaultVariantId = variants.isEmpty() ? null : variants.get(0).getId();
        return ProductResponse.builder()
            .id(product.getId())
            .title(product.getTitle())
            .description(product.getDescription())
            .status(product.getStatus())
            .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
            .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
            .images(images)
            .priceMin(minPrice)
            .defaultVariantId(defaultVariantId)
            .build();
    }
}
