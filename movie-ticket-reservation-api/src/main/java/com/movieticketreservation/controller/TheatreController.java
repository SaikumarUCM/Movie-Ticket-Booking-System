package com.movieticketreservation.controller;

import com.movieticketreservation.dto.TheatreDto;
import com.movieticketreservation.exception.TheatreNotFoundException;
import com.movieticketreservation.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/theatre")
public class TheatreController {

    @Autowired
    private TheatreService theatreService;

    @GetMapping
    public ResponseEntity<List<TheatreDto>> getTheatres() {
        List<TheatreDto> theatres = theatreService.getTheatres();
        return ResponseEntity.ok(theatres);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheatreDto> getTheatre(@PathVariable String id) throws TheatreNotFoundException {
        Optional<TheatreDto> theatre = theatreService.getTheatre(id);
        return ResponseEntity.ok(theatre.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TheatreDto> updateTheatre(@PathVariable String id, @RequestBody TheatreDto updatedTheatreDto) throws TheatreNotFoundException {
        Optional<TheatreDto> updatedTheatre = theatreService.updateTheatre(id, updatedTheatreDto);
        return ResponseEntity.ok(updatedTheatre.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheatre(@PathVariable String id) throws TheatreNotFoundException {
        theatreService.deleteTheatre(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<TheatreDto> addTheatre(@RequestBody TheatreDto theatreDto) {
        TheatreDto newTheatre = theatreService.addTheatre(theatreDto);
        return ResponseEntity.ok(newTheatre);
    }
}
