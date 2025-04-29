package com.movieticketreservation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "bookings")
public class BookingsEntity {
    @Id
    private String bookingId;

    private String customerId;
    private String username;
    private String scheduleId;
    private String showTime;
    private String showDate;
    private List<String> seatNumbers;
    private double totalAmount;
    private String status;
    private LocalDateTime bookingTime;
    private LocalDateTime cancellationTime;
}
