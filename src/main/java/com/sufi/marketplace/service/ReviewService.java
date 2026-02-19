package com.sufi.marketplace.service;

import com.sufi.marketplace.dto.ReviewCreateRequest;
import com.sufi.marketplace.entity.Product;
import com.sufi.marketplace.entity.Review;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.ReviewStatus;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.ProductRepository;
import com.sufi.marketplace.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public Review createReview(User buyer, ReviewCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new NotFoundException("Product not found"));
        Review review = new Review();
        review.setProduct(product);
        review.setBuyer(buyer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setStatus(ReviewStatus.PENDING);
        return reviewRepository.save(review);
    }
}
