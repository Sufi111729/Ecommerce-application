package com.sufi.marketplace.service;

import com.sufi.marketplace.entity.MarketplaceSetting;
import com.sufi.marketplace.repository.MarketplaceSettingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CommissionService {

    private static final String KEY = "commission_percent";

    private final MarketplaceSettingRepository settingRepository;
    private final int defaultPercent;

    public CommissionService(
        MarketplaceSettingRepository settingRepository,
        @Value("${app.commission.default-percent}") int defaultPercent
    ) {
        this.settingRepository = settingRepository;
        this.defaultPercent = defaultPercent;
    }

    public int getCommissionPercent() {
        return settingRepository.findBySettingKey(KEY)
            .map(MarketplaceSetting::getSettingValue)
            .map(Integer::parseInt)
            .orElse(defaultPercent);
    }

    public void updateCommissionPercent(int percent) {
        MarketplaceSetting setting = settingRepository.findBySettingKey(KEY)
            .orElseGet(MarketplaceSetting::new);
        setting.setSettingKey(KEY);
        setting.setSettingValue(String.valueOf(percent));
        settingRepository.save(setting);
    }
}
