package com.movieticketreservation.service;

import com.movieticketreservation.dto.PaymentsDto;
import com.movieticketreservation.exception.PaymentsNotFoundException;

import java.util.List;
import java.util.Optional;

public interface PaymentsService {
    List<PaymentsDto> getPayments();

    Optional<PaymentsDto> getPayment(String id) throws PaymentsNotFoundException;

    PaymentsDto addPayment(PaymentsDto paymentsDto);

    Optional<PaymentsDto> updatePayment(String id, PaymentsDto updatedPaymentsDto) throws PaymentsNotFoundException;

    void deletePayment(String id) throws PaymentsNotFoundException;
}
