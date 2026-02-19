package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Order;
import com.sufi.marketplace.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer(User buyer);
}
