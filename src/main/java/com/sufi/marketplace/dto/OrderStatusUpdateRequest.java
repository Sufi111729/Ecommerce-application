package com.sufi.marketplace.dto;

import com.sufi.marketplace.entity.enums.OrderItemStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusUpdateRequest {
    @NotNull
    private OrderItemStatus status;
}
