package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.UserStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByStatus(UserStatus status);
}
