package com.movieticketreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentsDto {
    private String paymentId;
    private String username;
    private List<PaymentDetailsDto> payments;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class PaymentDetailsDto {
    private String paymentId;
    private String bookingId;
    private String paymentType;
    private String cardNumber;
    private String cardName;
    private int expiryMonth;
    private int expiryYear;
    private String cvv;
    private double totalAmount;
    private LocalDateTime paymentDate;
    private String status;
}
