package com.sufi.marketplace.service;

import com.sufi.marketplace.dto.AuthLoginRequest;
import com.sufi.marketplace.dto.AuthRegisterRequest;
import com.sufi.marketplace.dto.AuthResponse;
import com.sufi.marketplace.dto.AdminLoginRequest;
import com.sufi.marketplace.dto.ModeratorRegisterRequest;
import com.sufi.marketplace.dto.SellerApplyRequest;
import com.sufi.marketplace.dto.SellerRegisterRequest;
import com.sufi.marketplace.entity.Role;
import com.sufi.marketplace.entity.SellerProfile;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.RoleName;
import com.sufi.marketplace.entity.enums.UserStatus;
import com.sufi.marketplace.entity.enums.VerifiedStatus;
import com.sufi.marketplace.exception.ApiException;
import com.sufi.marketplace.repository.RoleRepository;
import com.sufi.marketplace.repository.SellerProfileRepository;
import com.sufi.marketplace.repository.UserRepository;
import com.sufi.marketplace.security.JwtService;
import java.util.Map;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        SellerProfileRepository sellerProfileRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.sellerProfileRepository = sellerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerBuyer(AuthRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(getOrCreateRole(RoleName.BUYER));
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse registerSeller(SellerRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(getOrCreateRole(RoleName.SELLER));
        userRepository.save(user);

        SellerProfile profile = new SellerProfile();
        profile.setUser(user);
        profile.setShopName(request.getShopName());
        profile.setGst(request.getGst());
        profile.setVerifiedStatus(VerifiedStatus.PENDING);
        sellerProfileRepository.save(profile);

        return new AuthResponse(user.getId(), user.getName(), RoleName.SELLER.name(), null);
    }

    public AuthResponse registerModerator(ModeratorRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.PENDING);
        user.getRoles().add(getOrCreateRole(RoleName.MODERATOR));
        userRepository.save(user);
        return new AuthResponse(user.getId(), user.getName(), RoleName.MODERATOR.name(), null);
    }

    public AuthResponse loginBuyer(AuthLoginRequest request) {
        return loginWithRole(request, RoleName.BUYER, "Buyer account required");
    }

    public AuthResponse loginSeller(AuthLoginRequest request) {
        return loginSellerWithApproval(request);
    }

    public AuthResponse loginModerator(AuthLoginRequest request) {
        return loginModeratorWithApproval(request);
    }

    public AuthResponse loginAdmin(AdminLoginRequest request) {
        return loginAdminWithRole(request, RoleName.ADMIN, "Admin account required");
    }

    public void applyForSeller(User user, SellerApplyRequest request) {
        if (user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.SELLER)) {
            throw new ApiException("Seller application already exists");
        }
        user.getRoles().add(getOrCreateRole(RoleName.SELLER));
        SellerProfile profile = new SellerProfile();
        profile.setUser(user);
        profile.setShopName(request.getShopName());
        profile.setGst(request.getGst());
        profile.setVerifiedStatus(VerifiedStatus.PENDING);
        sellerProfileRepository.save(profile);
        userRepository.save(user);
    }

    private Role getOrCreateRole(RoleName name) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            return roleRepository.save(role);
        });
    }

    private AuthResponse loginSellerWithApproval(AuthLoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        if (!auth.isAuthenticated()) {
            throw new ApiException("Invalid credentials");
        }
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException("User not found"));
        boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.SELLER);
        if (!hasRole) {
            throw new ApiException("Seller account required");
        }
        SellerProfile profile = sellerProfileRepository.findById(user.getId())
            .orElseThrow(() -> new ApiException("Seller profile not found"));
        if (profile.getVerifiedStatus() != VerifiedStatus.APPROVED) {
            throw new ApiException("Seller approval pending");
        }
        return buildAuthResponse(user);
    }

    private AuthResponse loginModeratorWithApproval(AuthLoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        if (!auth.isAuthenticated()) {
            throw new ApiException("Invalid credentials");
        }
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException("User not found"));
        boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.MODERATOR);
        if (!hasRole) {
            throw new ApiException("Moderator account required");
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ApiException("Moderator approval pending");
        }
        return buildAuthResponse(user);
    }

    private AuthResponse loginWithRole(AuthLoginRequest request, RoleName requiredRole, String errorMessage) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        if (!auth.isAuthenticated()) {
            throw new ApiException("Invalid credentials");
        }
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ApiException("User not found"));
        boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getName() == requiredRole);
        if (!hasRole) {
            throw new ApiException(errorMessage);
        }
        return buildAuthResponse(user);
    }

    private AuthResponse loginAdminWithRole(AdminLoginRequest request, RoleName requiredRole, String errorMessage) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        if (!auth.isAuthenticated()) {
            throw new ApiException("Invalid credentials");
        }
        User user = userRepository.findByEmail(request.getUsername())
            .orElseThrow(() -> new ApiException("User not found"));
        boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getName() == requiredRole);
        if (!hasRole) {
            throw new ApiException(errorMessage);
        }
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        List<String> roles = user.getRoles().stream().map(r -> r.getName().name()).toList();
        String token = jwtService.generateToken(
            user.getEmail(),
            Map.of("roles", roles)
        );
        String primaryRole = roles.isEmpty() ? "BUYER" : roles.get(0);
        return new AuthResponse(user.getId(), user.getName(), primaryRole, token);
    }
}
