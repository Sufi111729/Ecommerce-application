package com.sufi.marketplace.service;

import com.sufi.marketplace.entity.Dispute;
import com.sufi.marketplace.entity.Review;
import com.sufi.marketplace.entity.SellerProfile;
import com.sufi.marketplace.entity.enums.DisputeStatus;
import com.sufi.marketplace.entity.enums.ReviewStatus;
import com.sufi.marketplace.entity.enums.VerifiedStatus;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.DisputeRepository;
import com.sufi.marketplace.repository.ReviewRepository;
import com.sufi.marketplace.repository.SellerProfileRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ModeratorService {

    private final ReviewRepository reviewRepository;
    private final DisputeRepository disputeRepository;
    private final SellerProfileRepository sellerProfileRepository;

    public ModeratorService(
        ReviewRepository reviewRepository,
        DisputeRepository disputeRepository,
        SellerProfileRepository sellerProfileRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.disputeRepository = disputeRepository;
        this.sellerProfileRepository = sellerProfileRepository;
    }

    public List<SellerProfile> pendingSellers() {
        return sellerProfileRepository.findAll()
            .stream()
            .filter(s -> s.getVerifiedStatus() == VerifiedStatus.PENDING)
            .toList();
    }

    public void approveSeller(Long userId) {
        SellerProfile profile = sellerProfileRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Seller not found"));
        profile.setVerifiedStatus(VerifiedStatus.APPROVED);
        sellerProfileRepository.save(profile);
    }

    public void rejectSeller(Long userId) {
        SellerProfile profile = sellerProfileRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Seller not found"));
        profile.setVerifiedStatus(VerifiedStatus.REJECTED);
        sellerProfileRepository.save(profile);
    }

    public List<Review> pendingReviews() {
        return reviewRepository.findByStatus(ReviewStatus.PENDING);
    }

    public void approveReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Review not found"));
        review.setStatus(ReviewStatus.APPROVED);
        reviewRepository.save(review);
    }

    public void rejectReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Review not found"));
        review.setStatus(ReviewStatus.REJECTED);
        reviewRepository.save(review);
    }

    public List<Dispute> listDisputes() {
        return disputeRepository.findByStatus(DisputeStatus.OPEN);
    }

    public void resolveDispute(Long id, DisputeStatus status, String message) {
        Dispute dispute = disputeRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Dispute not found"));
        dispute.setStatus(status);
        if (message != null && !message.isBlank()) {
            dispute.setMessage(message);
        }
        disputeRepository.save(dispute);
    }
}
