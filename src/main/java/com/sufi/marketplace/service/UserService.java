package com.sufi.marketplace.service;

import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new NotFoundException("User not found");
        }
        return userRepository
            .findByEmail(auth.getName())
            .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
