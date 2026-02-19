package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.ReturnRequest;
import com.sufi.marketplace.entity.enums.ReturnStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findByStatus(ReturnStatus status);
}
