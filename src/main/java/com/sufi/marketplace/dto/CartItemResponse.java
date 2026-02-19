package com.sufi.marketplace.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {
    private Long variantId;
    private Long productId;
    private Long sellerId;
    private String title;
    private Integer qty;
    private BigDecimal price;
}
