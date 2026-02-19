package com.sufi.marketplace.service;

import com.sufi.marketplace.entity.OrderItem;
import com.sufi.marketplace.entity.ReturnRequest;
import com.sufi.marketplace.entity.User;
import com.sufi.marketplace.entity.enums.ReturnStatus;
import com.sufi.marketplace.exception.NotFoundException;
import com.sufi.marketplace.repository.OrderItemRepository;
import com.sufi.marketplace.repository.ReturnRequestRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReturnService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderItemRepository orderItemRepository;

    public ReturnService(ReturnRequestRepository returnRequestRepository, OrderItemRepository orderItemRepository) {
        this.returnRequestRepository = returnRequestRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public ReturnRequest createReturnRequest(Long orderItemId, String reason) {
        OrderItem item = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new NotFoundException("Order item not found"));
        ReturnRequest request = new ReturnRequest();
        request.setOrderItem(item);
        request.setReason(reason);
        request.setStatus(ReturnStatus.RETURN_REQUESTED);
        return returnRequestRepository.save(request);
    }

    public List<ReturnRequest> listReturnsForSeller(User seller) {
        return returnRequestRepository.findAll()
            .stream()
            .filter(r -> r.getOrderItem().getSeller().getId().equals(seller.getId()))
            .toList();
    }

    public void approveReturn(User seller, Long returnId) {
        ReturnRequest request = returnRequestRepository.findById(returnId)
            .orElseThrow(() -> new NotFoundException("Return request not found"));
        if (!request.getOrderItem().getSeller().getId().equals(seller.getId())) {
            throw new NotFoundException("Return request not found");
        }
        request.setStatus(ReturnStatus.APPROVED);
        returnRequestRepository.save(request);
    }

    public void rejectReturn(User seller, Long returnId) {
        ReturnRequest request = returnRequestRepository.findById(returnId)
            .orElseThrow(() -> new NotFoundException("Return request not found"));
        if (!request.getOrderItem().getSeller().getId().equals(seller.getId())) {
            throw new NotFoundException("Return request not found");
        }
        request.setStatus(ReturnStatus.REJECTED);
        returnRequestRepository.save(request);
    }
}
