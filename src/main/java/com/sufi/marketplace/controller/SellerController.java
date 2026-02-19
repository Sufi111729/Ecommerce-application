package com.sufi.marketplace.controller;

import com.sufi.marketplace.dto.OrderItemResponse;
import com.sufi.marketplace.dto.OrderStatusUpdateRequest;
import com.sufi.marketplace.dto.ProductCreateRequest;
import com.sufi.marketplace.dto.ProductResponse;
import com.sufi.marketplace.dto.ProductUpdateRequest;
import com.sufi.marketplace.dto.SellerInventorySummary;
import com.sufi.marketplace.dto.TrackingUpdateRequest;
import com.sufi.marketplace.entity.ReturnRequest;
import com.sufi.marketplace.service.OrderService;
import com.sufi.marketplace.service.ProductService;
import com.sufi.marketplace.service.ReturnService;
import com.sufi.marketplace.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final ProductService productService;
    private final OrderService orderService;
    private final ReturnService returnService;
    private final UserService userService;

    public SellerController(
        ProductService productService,
        OrderService orderService,
        ReturnService returnService,
        UserService userService
    ) {
        this.productService = productService;
        this.orderService = orderService;
        this.returnService = returnService;
        this.userService = userService;
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(productService.createProduct(userService.getCurrentUser(), request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductUpdateRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(userService.getCurrentUser(), id, request));
    }

    @PostMapping("/products/{id}/submit")
    public ResponseEntity<Void> submitProduct(@PathVariable Long id) {
        productService.submitForApproval(userService.getCurrentUser(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> sellerProducts() {
        return ResponseEntity.ok(productService.listSellerProducts(userService.getCurrentUser()));
    }

    @GetMapping("/products/list")
    public ResponseEntity<List<ProductResponse>> sellerProductsList() {
        return ResponseEntity.ok(productService.listSellerProducts(userService.getCurrentUser()));
    }

    @GetMapping("/inventory/summary")
    public ResponseEntity<SellerInventorySummary> inventorySummary() {
        return ResponseEntity.ok(productService.getSellerInventorySummary(userService.getCurrentUser()));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderItemResponse>> sellerOrders() {
        return ResponseEntity.ok(orderService.listSellerOrderItems(userService.getCurrentUser()));
    }

    @PutMapping("/order-items/{id}/status")
    public ResponseEntity<Void> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        orderService.updateOrderItemStatus(userService.getCurrentUser(), id, request.getStatus());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order-items/{id}/tracking")
    public ResponseEntity<Void> updateTracking(
        @PathVariable Long id,
        @Valid @RequestBody TrackingUpdateRequest request
    ) {
        orderService.updateTracking(userService.getCurrentUser(), id, request.getTrackingId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/returns")
    public ResponseEntity<List<ReturnRequest>> returns() {
        return ResponseEntity.ok(returnService.listReturnsForSeller(userService.getCurrentUser()));
    }

    @PostMapping("/returns/{id}/approve")
    public ResponseEntity<Void> approveReturn(@PathVariable Long id) {
        returnService.approveReturn(userService.getCurrentUser(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/returns/{id}/reject")
    public ResponseEntity<Void> rejectReturn(@PathVariable Long id) {
        returnService.rejectReturn(userService.getCurrentUser(), id);
        return ResponseEntity.ok().build();
    }
}
