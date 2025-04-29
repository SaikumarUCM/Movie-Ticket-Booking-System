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
@Document(collection = "schedule")
public class ScheduleEntity {

    @Id
    private String scheduleId;

    private String movieId;
    private String theatreId;
    private List<ShowTimingsEntity> showTimings;
    private String date;
    private String startDate;
    private String endDate;
    private String status;
    private double ticketPrice;
}
