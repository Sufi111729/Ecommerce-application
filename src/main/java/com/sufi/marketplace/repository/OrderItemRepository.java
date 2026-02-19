package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.OrderItem;
import com.sufi.marketplace.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findBySeller(User seller);
    List<OrderItem> findByOrderId(Long orderId);
}
