package com.sufi.marketplace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartUpdateRequest {
    @NotNull
    private Long variantId;
    @NotNull
    private Integer qty;
}
