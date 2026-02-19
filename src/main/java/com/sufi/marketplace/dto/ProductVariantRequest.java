package com.sufi.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductVariantRequest {
    @NotBlank
    private String sku;

    private String attributesJson;

    @NotNull
    private BigDecimal price;

    private BigDecimal mrp;

    @NotNull
    private Integer stockQty;
}
