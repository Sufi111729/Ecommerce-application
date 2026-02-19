package com.sufi.marketplace.controller;

import com.sufi.marketplace.dto.AuthLoginRequest;
import com.sufi.marketplace.dto.AdminLoginRequest;
import com.sufi.marketplace.dto.AuthRegisterRequest;
import com.sufi.marketplace.dto.AuthResponse;
import com.sufi.marketplace.dto.ModeratorRegisterRequest;
import com.sufi.marketplace.dto.SellerApplyRequest;
import com.sufi.marketplace.dto.SellerRegisterRequest;
import com.sufi.marketplace.service.AuthService;
import com.sufi.marketplace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRegisterRequest request) {
        return ResponseEntity.ok(authService.registerBuyer(request));
    }

    @PostMapping("/buyer/register")
    public ResponseEntity<AuthResponse> registerBuyer(@Valid @RequestBody AuthRegisterRequest request) {
        return ResponseEntity.ok(authService.registerBuyer(request));
    }

    @PostMapping("/seller/register")
    public ResponseEntity<AuthResponse> registerSeller(@Valid @RequestBody SellerRegisterRequest request) {
        return ResponseEntity.ok(authService.registerSeller(request));
    }

    @PostMapping("/moderator/register")
    public ResponseEntity<AuthResponse> registerModerator(@Valid @RequestBody ModeratorRegisterRequest request) {
        return ResponseEntity.ok(authService.registerModerator(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.loginBuyer(request));
    }

    @PostMapping("/buyer/login")
    public ResponseEntity<AuthResponse> loginBuyer(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.loginBuyer(request));
    }

    @PostMapping("/seller/login")
    public ResponseEntity<AuthResponse> loginSeller(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.loginSeller(request));
    }

    @PostMapping("/moderator/login")
    public ResponseEntity<AuthResponse> loginModerator(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.loginModerator(request));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> loginAdmin(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    @PostMapping("/seller/apply")
    public ResponseEntity<Void> applySeller(@Valid @RequestBody SellerApplyRequest request) {
        authService.applyForSeller(userService.getCurrentUser(), request);
        return ResponseEntity.ok().build();
    }
}
