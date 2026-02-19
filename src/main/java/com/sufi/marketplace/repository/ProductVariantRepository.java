package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.ProductVariant;
import com.sufi.marketplace.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    List<ProductVariant> findByProductSeller(User seller);
}
