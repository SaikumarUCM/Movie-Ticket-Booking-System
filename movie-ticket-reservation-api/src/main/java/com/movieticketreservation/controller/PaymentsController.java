package com.movieticketreservation.controller;

import com.movieticketreservation.dto.PaymentsDto;
import com.movieticketreservation.exception.PaymentsNotFoundException;
import com.movieticketreservation.service.PaymentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payments")
public class PaymentsController {

    @Autowired
    private PaymentsService paymentsService;

    @GetMapping
    public ResponseEntity<List<PaymentsDto>> getPayments() {
        List<PaymentsDto> payments = paymentsService.getPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentsDto> getPayment(@PathVariable String id) throws PaymentsNotFoundException {
        Optional<PaymentsDto> payment = paymentsService.getPayment(id);
        return ResponseEntity.ok(payment.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentsDto> updatePayment(@PathVariable String id, @RequestBody PaymentsDto updatedPaymentsDto) throws PaymentsNotFoundException {
        Optional<PaymentsDto> updatedPayment = paymentsService.updatePayment(id, updatedPaymentsDto);
        return ResponseEntity.ok(updatedPayment.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable String id) throws PaymentsNotFoundException {
        paymentsService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<PaymentsDto> addPayment(@RequestBody PaymentsDto paymentsDto) {
        PaymentsDto newPayment = paymentsService.addPayment(paymentsDto);
        return ResponseEntity.ok(newPayment);
    }
}
