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
@Document(collection = "movie")
public class MovieEntity {

    @Id
    private String movieId;

    private String title;
    private String genre;
    private List<String> cast;
    private String director;
    private String description;
    private String releaseDate;
    private int duration;
    private String imageUrl;


}

