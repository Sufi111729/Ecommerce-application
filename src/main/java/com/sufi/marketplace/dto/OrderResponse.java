package com.sufi.marketplace.dto;

import com.sufi.marketplace.entity.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderResponse {
    private Long id;
    private Long buyerId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private Instant createdAt;
    private List<OrderItemResponse> items;
}
