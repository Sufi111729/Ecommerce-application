package com.sufi.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SellerInventorySummary {
    private int totalProducts;
    private int totalVariants;
    private int lowStockVariants;
    private int totalStock;
}
