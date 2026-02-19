package com.sufi.marketplace.repository;

import com.sufi.marketplace.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
