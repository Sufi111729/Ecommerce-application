package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Review;
import com.sufi.marketplace.entity.enums.ReviewStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByStatus(ReviewStatus status);
}
