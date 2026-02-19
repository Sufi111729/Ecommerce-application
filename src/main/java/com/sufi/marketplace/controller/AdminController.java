package com.sufi.marketplace.controller;

import com.sufi.marketplace.dto.CategoryRequest;
import com.sufi.marketplace.dto.CommissionUpdateRequest;
import com.sufi.marketplace.entity.Category;
import com.sufi.marketplace.entity.SellerProfile;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.service.AdminService;
import com.sufi.marketplace.service.CommissionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final CommissionService commissionService;

    public AdminController(AdminService adminService, CommissionService commissionService) {
        this.adminService = adminService;
        this.commissionService = commissionService;
    }

    @GetMapping("/sellers/pending")
    public ResponseEntity<List<SellerProfile>> pendingSellers() {
        return ResponseEntity.ok(adminService.listPendingSellers());
    }

    @GetMapping("/sellers/rejected")
    public ResponseEntity<List<SellerProfile>> rejectedSellers() {
        return ResponseEntity.ok(adminService.listRejectedSellers());
    }

    @PostMapping("/sellers/{id}/approve")
    public ResponseEntity<Void> approveSeller(@PathVariable Long id) {
        adminService.approveSeller(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sellers/{id}/suspend")
    public ResponseEntity<Void> suspendSeller(@PathVariable Long id) {
        adminService.suspendSeller(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/moderators/pending")
    public ResponseEntity<List<User>> pendingModerators() {
        return ResponseEntity.ok(adminService.listPendingModerators());
    }

    @PostMapping("/moderators/{id}/approve")
    public ResponseEntity<Void> approveModerator(@PathVariable Long id) {
        adminService.approveModerator(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/moderators/{id}/suspend")
    public ResponseEntity<Void> suspendModerator(@PathVariable Long id) {
        adminService.suspendModerator(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(adminService.createCategory(request));
    }

    @PostMapping("/commission")
    public ResponseEntity<Void> updateCommission(@Valid @RequestBody CommissionUpdateRequest request) {
        commissionService.updateCommissionPercent(request.getPercent());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<Void> banUser(@PathVariable Long id) {
        adminService.banUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reports/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(adminService.reportSummary());
    }
}
