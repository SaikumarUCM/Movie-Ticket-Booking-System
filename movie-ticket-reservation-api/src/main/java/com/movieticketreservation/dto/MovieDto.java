package com.movieticketreservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDto {
    private String movieId;
    private String title;
    private String genre;
    private List<String> cast;
    private String director;
    private String description;
    private String releaseDate; // Change to LocalDateTime
    private int duration;
    private String theaterId;
    private List<ScheduleDto> scheduleDtos;
    private TheatreDto theatreDto;
    private MultipartFile image;
    private String imageUrl;
}

