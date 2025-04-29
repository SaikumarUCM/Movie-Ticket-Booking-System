package com.movieticketreservation.service;

import com.movieticketreservation.dto.MovieDto;
import com.movieticketreservation.exception.MovieNotFoundException;

import java.util.List;
import java.util.Optional;

public interface MovieService {
    List<MovieDto> getMovies();

    Optional<MovieDto> getMovie(String id) throws MovieNotFoundException;

    MovieDto addMovie(MovieDto movieDto);

    Optional<MovieDto> updateMovie(String id, MovieDto updatedMovieDto) throws MovieNotFoundException;

    void deleteMovie(String id) throws MovieNotFoundException;

    Optional<MovieDto> findByTitle(String title) throws MovieNotFoundException;


}
