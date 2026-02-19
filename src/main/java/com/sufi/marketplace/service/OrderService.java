package com.sufi.marketplace.service;

import com.sufi.marketplace.dto.OrderItemResponse;
import com.sufi.marketplace.dto.OrderResponse;
import com.sufi.marketplace.entity.Cart;
import com.sufi.marketplace.entity.CartItem;
import com.sufi.marketplace.entity.Order;
import com.sufi.marketplace.entity.OrderItem;
import com.sufi.marketplace.entity.Payment;
import com.sufi.marketplace.entity.ProductVariant;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.OrderItemStatus;
import com.sufi.marketplace.entity.enums.OrderStatus;
import com.sufi.marketplace.entity.enums.PaymentStatus;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.CartItemRepository;
import com.sufi.marketplace.repository.CartRepository;
import com.sufi.marketplace.repository.OrderItemRepository;
import com.sufi.marketplace.repository.OrderRepository;
import com.sufi.marketplace.repository.PaymentRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CommissionService commissionService;

    public OrderService(
        CartRepository cartRepository,
        CartItemRepository cartItemRepository,
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        PaymentRepository paymentRepository,
        CommissionService commissionService
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.commissionService = commissionService;
    }

    @Transactional
    public OrderResponse checkout(User buyer) {
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new NotFoundException("Cart not found"));
        List<CartItem> items = cartItemRepository.findByCart(cart);
        if (items.isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        Order order = new Order();
        order.setBuyer(buyer);
        order.setStatus(OrderStatus.PLACED);
        orderRepository.save(order);

        int percent = commissionService.getCommissionPercent();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : items) {
            ProductVariant variant = item.getVariant();
            BigDecimal lineTotal = variant.getPrice()
                .multiply(BigDecimal.valueOf(item.getQty()));
            BigDecimal commission = lineTotal
                .multiply(BigDecimal.valueOf(percent))
                .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
            BigDecimal sellerEarning = lineTotal.subtract(commission);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setSeller(variant.getProduct().getSeller());
            orderItem.setVariant(variant);
            orderItem.setQty(item.getQty());
            orderItem.setPrice(variant.getPrice());
            orderItem.setCommissionAmount(commission);
            orderItem.setSellerEarning(sellerEarning);
            orderItem.setStatus(OrderItemStatus.PLACED);
            orderItemRepository.save(orderItem);

            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);
        orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod("COD");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTxnRef("COD-" + order.getId());
        paymentRepository.save(payment);

        cartItemRepository.deleteAll(items);
        return toResponse(order);
    }

    public List<OrderResponse> listBuyerOrders(User buyer) {
        return orderRepository.findByBuyer(buyer)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public OrderResponse getBuyerOrder(User buyer, Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found"));
        if (!order.getBuyer().getId().equals(buyer.getId())) {
            throw new NotFoundException("Order not found");
        }
        return toResponse(order);
    }

    public List<OrderItemResponse> listSellerOrderItems(User seller) {
        return orderItemRepository.findBySeller(seller)
            .stream()
            .map(this::toItemResponse)
            .toList();
    }

    public void updateOrderItemStatus(User seller, Long orderItemId, OrderItemStatus status) {
        OrderItem item = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new NotFoundException("Order item not found"));
        if (!item.getSeller().getId().equals(seller.getId())) {
            throw new NotFoundException("Order item not found");
        }
        item.setStatus(status);
        orderItemRepository.save(item);
    }

    public void updateTracking(User seller, Long orderItemId, String trackingId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new NotFoundException("Order item not found"));
        if (!item.getSeller().getId().equals(seller.getId())) {
            throw new NotFoundException("Order item not found");
        }
        item.setTrackingId(trackingId);
        orderItemRepository.save(item);
    }

    public void requestCancel(User buyer, Long orderItemId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new NotFoundException("Order item not found"));
        if (!item.getOrder().getBuyer().getId().equals(buyer.getId())) {
            throw new NotFoundException("Order item not found");
        }
        item.setStatus(OrderItemStatus.CANCEL_REQUESTED);
        orderItemRepository.save(item);
    }

    public void requestReturn(User buyer, Long orderItemId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new NotFoundException("Order item not found"));
        if (!item.getOrder().getBuyer().getId().equals(buyer.getId())) {
            throw new NotFoundException("Order item not found");
        }
        item.setStatus(OrderItemStatus.RETURN_REQUESTED);
        orderItemRepository.save(item);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = orderItemRepository.findByOrderId(order.getId())
            .stream()
            .map(this::toItemResponse)
            .toList();
        return OrderResponse.builder()
            .id(order.getId())
            .buyerId(order.getBuyer().getId())
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus())
            .createdAt(order.getCreatedAt())
            .items(items)
            .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
            .id(item.getId())
            .sellerId(item.getSeller().getId())
            .variantId(item.getVariant().getId())
            .productId(item.getVariant().getProduct().getId())
            .qty(item.getQty())
            .price(item.getPrice())
            .commissionAmount(item.getCommissionAmount())
            .sellerEarning(item.getSellerEarning())
            .status(item.getStatus())
            .trackingId(item.getTrackingId())
            .build();
    }
}
