package com.movieticketreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowTimingsDto {
    private String showTime;
    private int totalSeats;
    private int availableSeats;
    private List<String> bookedSeatNumbers;
}
