package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Cart;
import com.sufi.marketplace.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByBuyer(User buyer);
}
