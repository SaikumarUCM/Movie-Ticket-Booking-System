package com.movieticketreservation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetailsEntity {

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
