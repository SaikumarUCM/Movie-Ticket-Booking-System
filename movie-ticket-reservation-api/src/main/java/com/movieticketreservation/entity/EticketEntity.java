package com.movieticketreservation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "eticket")
public class EticketEntity {

    @Id
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
