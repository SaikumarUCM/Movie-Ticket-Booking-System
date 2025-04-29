package com.movieticketreservation.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movieticketreservation.dto.MovieDto;
import com.movieticketreservation.exception.MovieNotFoundException;
import com.movieticketreservation.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getMovies() {
        List<MovieDto> movies = movieService.getMovies();
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovie(@PathVariable String id) throws MovieNotFoundException {
        Optional<MovieDto> movie = movieService.getMovie(id);
        return ResponseEntity.ok(movie.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable String id,
                                                @RequestPart(name = "image", required = false) MultipartFile image,
                                                @RequestPart("movieDto") String movieDtoJson) throws JsonProcessingException, MovieNotFoundException {
        ObjectMapper objectMapper = new ObjectMapper();
        MovieDto updatedMovieDto = objectMapper.readValue(movieDtoJson, MovieDto.class);

        updatedMovieDto.setImage(image);
        Optional<MovieDto> updatedMovie = movieService.updateMovie(id, updatedMovieDto);
        return ResponseEntity.ok(updatedMovie.orElse(null));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) throws MovieNotFoundException {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<MovieDto> addMovie(@RequestPart("image") MultipartFile image
            , @RequestPart("movieDto") String movieDtoJson) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        MovieDto movieDto = objectMapper.readValue(movieDtoJson, MovieDto.class);
        movieDto.setImage(image);
        MovieDto newMovie = movieService.addMovie(movieDto);
        return ResponseEntity.ok(newMovie);
    }

}
