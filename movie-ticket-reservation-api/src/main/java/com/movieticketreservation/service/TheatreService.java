package com.movieticketreservation.service;

import com.movieticketreservation.dto.TheatreDto;
import com.movieticketreservation.exception.TheatreNotFoundException;

import java.util.List;
import java.util.Optional;

public interface TheatreService {
    List<TheatreDto> getTheatres();

    Optional<TheatreDto> getTheatre(String id) throws TheatreNotFoundException;

    TheatreDto addTheatre(TheatreDto theatreDto);

    Optional<TheatreDto> updateTheatre(String id, TheatreDto updatedTheatreDto) throws TheatreNotFoundException;

    void deleteTheatre(String id) throws TheatreNotFoundException;
}
