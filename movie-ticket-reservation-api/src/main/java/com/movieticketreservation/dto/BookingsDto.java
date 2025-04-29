package com.movieticketreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingsDto {
    private String bookingId;
    private String customerId;
    private String movieId;
    private String scheduleId;
    private String theatreId;
    private String username;
    private String status;
    private String showTime;
    private String showDate;
    private List<String> seatNumbers;
    private double totalAmount;
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationTime;
    private PaymentDetailsDto paymentDetails;
    private MovieDto movie;
    private ScheduleDto scheduleDto;
    private String movieTitle;
    private String cast;
    private String genre;
    private String theatreName;
    private String location;
}
