package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Product;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.ProductStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
    List<Product> findBySeller(User seller);
}
