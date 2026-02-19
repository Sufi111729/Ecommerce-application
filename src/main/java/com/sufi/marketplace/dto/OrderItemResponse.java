package com.sufi.marketplace.dto;

import com.sufi.marketplace.entity.enums.OrderItemStatus;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemResponse {
    private Long id;
    private Long sellerId;
    private Long variantId;
    private Long productId;
    private Integer qty;
    private BigDecimal price;
    private BigDecimal commissionAmount;
    private BigDecimal sellerEarning;
    private OrderItemStatus status;
    private String trackingId;
}
