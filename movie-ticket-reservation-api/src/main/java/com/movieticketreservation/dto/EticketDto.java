package com.movieticketreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EticketDto {
    private String eticketId;

    private String bookingId;
    private String username;
    private String title;
    private String cast;
    private String genre;
    private String theatreName;
    private String location;
    private List<String> seatNumbers;
    private String showTime;
    private String showDate;
}
