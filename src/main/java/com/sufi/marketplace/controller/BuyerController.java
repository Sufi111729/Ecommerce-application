package com.sufi.marketplace.controller;

import com.sufi.marketplace.dto.CartAddRequest;
import com.sufi.marketplace.dto.CartResponse;
import com.sufi.marketplace.dto.CartUpdateRequest;
import com.sufi.marketplace.dto.OrderResponse;
import com.sufi.marketplace.dto.ReturnRequestCreateRequest;
import com.sufi.marketplace.dto.ReviewCreateRequest;
import com.sufi.marketplace.entity.ReturnRequest;
import com.sufi.marketplace.entity.Review;
import com.sufi.marketplace.service.CartService;
import com.sufi.marketplace.service.OrderService;
import com.sufi.marketplace.service.ReturnService;
import com.sufi.marketplace.service.ReviewService;
import com.sufi.marketplace.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BuyerController {

    private final CartService cartService;
    private final OrderService orderService;
    private final ReturnService returnService;
    private final ReviewService reviewService;
    private final UserService userService;

    public BuyerController(
        CartService cartService,
        OrderService orderService,
        ReturnService returnService,
        ReviewService reviewService,
        UserService userService
    ) {
        this.cartService = cartService;
        this.orderService = orderService;
        this.returnService = returnService;
        this.reviewService = reviewService;
        this.userService = userService;
    }

    @PostMapping("/cart/add")
    public ResponseEntity<Void> addToCart(@Valid @RequestBody CartAddRequest request) {
        cartService.addToCart(userService.getCurrentUser(), request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/cart/update")
    public ResponseEntity<Void> updateCart(@Valid @RequestBody CartUpdateRequest request) {
        cartService.updateCart(userService.getCurrentUser(), request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cart/remove/{variantId}")
    public ResponseEntity<Void> removeCart(@PathVariable Long variantId) {
        cartService.removeItem(userService.getCurrentUser(), variantId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cart")
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart(userService.getCurrentUser()));
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout() {
        return ResponseEntity.ok(orderService.checkout(userService.getCurrentUser()));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> orders() {
        return ResponseEntity.ok(orderService.listBuyerOrders(userService.getCurrentUser()));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> order(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getBuyerOrder(userService.getCurrentUser(), id));
    }

    @PostMapping("/orders/{orderItemId}/cancel-request")
    public ResponseEntity<Void> cancelRequest(@PathVariable Long orderItemId) {
        orderService.requestCancel(userService.getCurrentUser(), orderItemId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/orders/{orderItemId}/return-request")
    public ResponseEntity<ReturnRequest> returnRequest(
        @PathVariable Long orderItemId,
        @Valid @RequestBody ReturnRequestCreateRequest request
    ) {
        ReturnRequest returnRequest = returnService.createReturnRequest(orderItemId, request.getReason());
        return ResponseEntity.ok(returnRequest);
    }

    @PostMapping("/reviews")
    public ResponseEntity<Review> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        return ResponseEntity.ok(reviewService.createReview(userService.getCurrentUser(), request));
    }
}
