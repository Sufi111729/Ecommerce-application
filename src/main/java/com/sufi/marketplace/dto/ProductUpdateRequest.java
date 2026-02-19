package com.sufi.marketplace.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductUpdateRequest {
    private Long categoryId;
    private String title;
    private String description;
    private List<String> images;
    private List<ProductVariantRequest> variants;
}
