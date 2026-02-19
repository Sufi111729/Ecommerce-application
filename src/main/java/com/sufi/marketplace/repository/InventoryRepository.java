package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}
