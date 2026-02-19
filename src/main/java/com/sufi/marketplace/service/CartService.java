package com.sufi.marketplace.service;

import com.sufi.marketplace.dto.CartAddRequest;
import com.sufi.marketplace.dto.CartItemResponse;
import com.sufi.marketplace.dto.CartResponse;
import com.sufi.marketplace.dto.CartUpdateRequest;
import com.sufi.marketplace.entity.Cart;
import com.sufi.marketplace.entity.CartItem;
import com.sufi.marketplace.entity.ProductVariant;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.CartItemRepository;
import com.sufi.marketplace.repository.CartRepository;
import com.sufi.marketplace.repository.ProductVariantRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    public CartService(
        CartRepository cartRepository,
        CartItemRepository cartItemRepository,
        ProductVariantRepository productVariantRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
    }

    @Transactional
    public void addToCart(User buyer, CartAddRequest request) {
        Cart cart = cartRepository.findByBuyer(buyer).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setBuyer(buyer);
            return cartRepository.save(newCart);
        });
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
            .orElseThrow(() -> new NotFoundException("Variant not found"));
        CartItem item = cartItemRepository.findByCartIdAndVariantId(cart.getId(), variant.getId())
            .orElseGet(() -> {
                CartItem ci = new CartItem();
                ci.setCart(cart);
                ci.setVariant(variant);
                ci.setQty(0);
                return ci;
            });
        item.setQty(item.getQty() + request.getQty());
        cartItemRepository.save(item);
    }

    @Transactional
    public void updateCart(User buyer, CartUpdateRequest request) {
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new NotFoundException("Cart not found"));
        CartItem item = cartItemRepository.findByCartIdAndVariantId(cart.getId(), request.getVariantId())
            .orElseThrow(() -> new NotFoundException("Cart item not found"));
        item.setQty(request.getQty());
        cartItemRepository.save(item);
    }

    @Transactional
    public void removeItem(User buyer, Long variantId) {
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new NotFoundException("Cart not found"));
        cartItemRepository.deleteByCartIdAndVariantId(cart.getId(), variantId);
    }

    public CartResponse getCart(User buyer) {
        Cart cart = cartRepository.findByBuyer(buyer)
            .orElseThrow(() -> new NotFoundException("Cart not found"));
        List<CartItem> items = cartItemRepository.findByCart(cart);
        List<CartItemResponse> responseItems = items.stream().map(item -> {
            ProductVariant variant = item.getVariant();
            return CartItemResponse.builder()
                .variantId(variant.getId())
                .productId(variant.getProduct().getId())
                .sellerId(variant.getProduct().getSeller().getId())
                .title(variant.getProduct().getTitle())
                .qty(item.getQty())
                .price(variant.getPrice())
                .build();
        }).toList();
        BigDecimal subtotal = responseItems.stream()
            .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQty())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartResponse.builder()
            .cartId(cart.getId())
            .items(responseItems)
            .subtotal(subtotal)
            .build();
    }
}
