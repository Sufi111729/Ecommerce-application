package com.sufi.marketplace.dto;

import com.sufi.marketplace.entity.enums.DisputeStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisputeResolveRequest {
    @NotNull
    private DisputeStatus status;
    private String message;
}
