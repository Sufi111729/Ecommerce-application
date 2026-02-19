package com.sufi.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnRequestCreateRequest {
    @NotNull
    private Long orderItemId;

    @NotBlank
    private String reason;
}
