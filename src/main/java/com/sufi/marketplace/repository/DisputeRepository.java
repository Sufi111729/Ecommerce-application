package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Dispute;
import com.sufi.marketplace.entity.enums.DisputeStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByStatus(DisputeStatus status);
}
