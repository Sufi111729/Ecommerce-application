package com.sufi.marketplace.config;

import com.sufi.marketplace.entity.Role;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.RoleName;
import com.sufi.marketplace.entity.enums.UserStatus;
import com.sufi.marketplace.repository.RoleRepository;
import com.sufi.marketplace.repository.UserRepository;
import java.util.Optional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;

    public AdminSeeder(
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.admin.username:admin}") String adminUsername,
        @Value("${app.admin.password:admin123}") String adminPassword
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseGet(() -> {
            Role role = new Role();
            role.setName(RoleName.ADMIN);
            return roleRepository.save(role);
        });

        Optional<User> existing = userRepository.findByEmail(adminUsername);
        if (existing.isEmpty()) {
            User user = new User();
            user.setName("Admin");
            user.setEmail(adminUsername);
            user.setPasswordHash(passwordEncoder.encode(adminPassword));
            user.setStatus(UserStatus.ACTIVE);
            user.getRoles().add(adminRole);
            userRepository.save(user);
            return;
        }

        User user = existing.get();
        user.setPasswordHash(passwordEncoder.encode(adminPassword));
        user.setStatus(UserStatus.ACTIVE);
        if (user.getRoles().stream().noneMatch(r -> r.getName() == RoleName.ADMIN)) {
            user.getRoles().add(adminRole);
        }
        userRepository.save(user);
    }
}
