package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Cart;
import com.sufi.marketplace.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart(Cart cart);
    Optional<CartItem> findByCartIdAndVariantId(Long cartId, Long variantId);
    void deleteByCartIdAndVariantId(Long cartId, Long variantId);
}
