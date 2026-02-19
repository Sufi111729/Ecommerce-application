package com.sufi.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrackingUpdateRequest {
    @NotBlank
    private String trackingId;
}
