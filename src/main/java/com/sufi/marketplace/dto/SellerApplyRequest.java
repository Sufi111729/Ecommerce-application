package com.sufi.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerApplyRequest {
    @NotBlank
    private String shopName;
    private String gst;
}
