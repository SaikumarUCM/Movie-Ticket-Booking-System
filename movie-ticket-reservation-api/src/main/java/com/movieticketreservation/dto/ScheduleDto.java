package com.movieticketreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDto {
    private String scheduleId;
    private String movieId;
    private String theatreId;
    private List<ShowTimingsDto> showTimings;
    private String date;
    private String startDate;
    private String endDate;
    private String showTime;
    private String showDate;
    private String status;
    private int totalSeats;
    private int availableSeats;
    private double ticketPrice;
    private List<String> bookedSeatNumbers;
}
