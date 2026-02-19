package com.sufi.marketplace.dto;

import com.sufi.marketplace.entity.enums.ProductStatus;
import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private ProductStatus status;
    private Long categoryId;
    private Long sellerId;
    private List<String> images;
    private BigDecimal priceMin;
    private Long defaultVariantId;
}
