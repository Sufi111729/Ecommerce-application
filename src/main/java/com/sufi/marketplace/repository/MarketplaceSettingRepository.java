package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.MarketplaceSetting;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketplaceSettingRepository extends JpaRepository<MarketplaceSetting, Long> {
    Optional<MarketplaceSetting> findBySettingKey(String settingKey);
}
