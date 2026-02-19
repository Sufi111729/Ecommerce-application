package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Role;
import com.sufi.marketplace.entity.enums.RoleName;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
