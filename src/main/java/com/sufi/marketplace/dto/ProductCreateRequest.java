package com.sufi.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCreateRequest {
    @NotNull
    private Long categoryId;

    @NotBlank
    private String title;

    private String description;

    private List<String> images;

    @NotNull
    private List<ProductVariantRequest> variants;
}
