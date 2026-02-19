package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
