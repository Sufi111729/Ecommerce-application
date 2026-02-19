package com.sufi.marketplace.controller;

import com.sufi.marketplace.dto.DisputeResolveRequest;
import com.sufi.marketplace.dto.ModerationDecisionRequest;
import com.sufi.marketplace.entity.Dispute;
import com.sufi.marketplace.entity.Product;
import com.sufi.marketplace.entity.Review;
import com.sufi.marketplace.entity.SellerProfile;
import com.sufi.marketplace.service.ModeratorService;
import com.sufi.marketplace.service.ProductService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mod")
public class ModeratorController {

    private final ProductService productService;
    private final ModeratorService moderatorService;

    public ModeratorController(ProductService productService, ModeratorService moderatorService) {
        this.productService = productService;
        this.moderatorService = moderatorService;
    }

    @GetMapping("/products/pending")
    public ResponseEntity<List<Product>> pendingProducts() {
        return ResponseEntity.ok(productService.listPendingProducts());
    }

    @GetMapping("/sellers/pending")
    public ResponseEntity<List<SellerProfile>> pendingSellers() {
        return ResponseEntity.ok(moderatorService.pendingSellers());
    }

    @PostMapping("/sellers/{id}/approve")
    public ResponseEntity<Void> approveSeller(@PathVariable Long id) {
        moderatorService.approveSeller(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sellers/{id}/reject")
    public ResponseEntity<Void> rejectSeller(@PathVariable Long id) {
        moderatorService.rejectSeller(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/products/{id}/approve")
    public ResponseEntity<Void> approveProduct(@PathVariable Long id, @RequestBody(required = false) ModerationDecisionRequest request) {
        productService.approveProduct(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/products/{id}/reject")
    public ResponseEntity<Void> rejectProduct(@PathVariable Long id, @RequestBody(required = false) ModerationDecisionRequest request) {
        productService.rejectProduct(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reviews/pending")
    public ResponseEntity<List<Review>> pendingReviews() {
        return ResponseEntity.ok(moderatorService.pendingReviews());
    }

    @PostMapping("/reviews/{id}/approve")
    public ResponseEntity<Void> approveReview(@PathVariable Long id) {
        moderatorService.approveReview(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reviews/{id}/reject")
    public ResponseEntity<Void> rejectReview(@PathVariable Long id) {
        moderatorService.rejectReview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Dispute>> disputes() {
        return ResponseEntity.ok(moderatorService.listDisputes());
    }

    @PostMapping("/disputes/{id}/resolve")
    public ResponseEntity<Void> resolveDispute(@PathVariable Long id, @Valid @RequestBody DisputeResolveRequest request) {
        moderatorService.resolveDispute(id, request.getStatus(), request.getMessage());
        return ResponseEntity.ok().build();
    }
}
