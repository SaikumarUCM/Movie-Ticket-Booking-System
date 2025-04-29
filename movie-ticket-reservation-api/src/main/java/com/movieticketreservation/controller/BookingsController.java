package com.movieticketreservation.controller;

import com.movieticketreservation.dto.BookingsDto;
import com.movieticketreservation.exception.BookingsNotFoundException;
import com.movieticketreservation.service.BookingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
public class BookingsController {

    @Autowired
    private BookingsService bookingsService;

    @GetMapping
    public ResponseEntity<List<BookingsDto>> getBookings() {
        List<BookingsDto> bookings = bookingsService.getBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingsDto> getBooking(@PathVariable String id) throws BookingsNotFoundException {
        Optional<BookingsDto> booking = bookingsService.getBooking(id);
        return ResponseEntity.ok(booking.orElse(null));
    }


    @PutMapping("/{id}")
    public ResponseEntity<BookingsDto> updateBooking(@PathVariable String id, @RequestBody BookingsDto updatedBookingsDto) throws BookingsNotFoundException {
        Optional<BookingsDto> updatedBooking = bookingsService.updateBooking(id, updatedBookingsDto);
        return ResponseEntity.ok(updatedBooking.orElse(null));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingsDto> cancelBooking(@PathVariable String id) throws BookingsNotFoundException {
        Optional<BookingsDto> updatedBooking = bookingsService.cancelBooking(id);
        return ResponseEntity.ok(updatedBooking.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) throws BookingsNotFoundException {
        bookingsService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<BookingsDto> addBooking(@RequestBody BookingsDto bookingsDto) {
        BookingsDto newBooking = bookingsService.addBooking(bookingsDto);
        return ResponseEntity.ok(newBooking);
    }
}
