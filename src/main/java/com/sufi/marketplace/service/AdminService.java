package com.sufi.marketplace.service;

import com.sufi.marketplace.dto.CategoryRequest;
import com.sufi.marketplace.entity.Category;
import com.sufi.marketplace.entity.OrderItem;
import com.sufi.marketplace.entity.SellerProfile;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.RoleName;
import com.sufi.marketplace.entity.enums.UserStatus;
import com.sufi.marketplace.entity.enums.VerifiedStatus;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.CategoryRepository;
import com.sufi.marketplace.repository.OrderItemRepository;
import com.sufi.marketplace.repository.SellerProfileRepository;
import com.sufi.marketplace.repository.UserRepository;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminService(
        SellerProfileRepository sellerProfileRepository,
        UserRepository userRepository,
        CategoryRepository categoryRepository,
        OrderItemRepository orderItemRepository
    ) {
        this.sellerProfileRepository = sellerProfileRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<SellerProfile> listPendingSellers() {
        return sellerProfileRepository.findAll()
            .stream()
            .filter(s -> s.getVerifiedStatus() == VerifiedStatus.PENDING)
            .toList();
    }

    public List<SellerProfile> listRejectedSellers() {
        return sellerProfileRepository.findAll()
            .stream()
            .filter(s -> s.getVerifiedStatus() == VerifiedStatus.REJECTED)
            .toList();
    }

    public List<User> listPendingModerators() {
        return userRepository.findByStatus(UserStatus.PENDING)
            .stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == RoleName.MODERATOR))
            .toList();
    }

    public void approveSeller(Long userId) {
        SellerProfile profile = sellerProfileRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Seller not found"));
        profile.setVerifiedStatus(VerifiedStatus.APPROVED);
        sellerProfileRepository.save(profile);
    }

    public void approveModerator(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Moderator not found"));
        boolean isModerator = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.MODERATOR);
        if (!isModerator) {
            throw new NotFoundException("Moderator not found");
        }
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    public void suspendModerator(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Moderator not found"));
        boolean isModerator = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.MODERATOR);
        if (!isModerator) {
            throw new NotFoundException("Moderator not found");
        }
        user.setStatus(UserStatus.SUSPENDED);
        userRepository.save(user);
    }

    public void suspendSeller(Long userId) {
        SellerProfile profile = sellerProfileRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("Seller not found"));
        profile.setVerifiedStatus(VerifiedStatus.SUSPENDED);
        sellerProfileRepository.save(profile);
    }

    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));
        user.setStatus(UserStatus.BANNED);
        userRepository.save(user);
    }

    public Category createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                .orElseThrow(() -> new NotFoundException("Parent category not found"));
            category.setParent(parent);
        }
        return categoryRepository.save(category);
    }

    public Map<String, Object> reportSummary() {
        List<OrderItem> items = orderItemRepository.findAll();
        BigDecimal totalSales = items.stream()
            .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQty())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCommission = items.stream()
            .map(OrderItem::getCommissionAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> summary = new HashMap<>();
        summary.put("orders", items.size());
        summary.put("totalSales", totalSales);
        summary.put("totalCommission", totalCommission);
        return summary;
    }
}
