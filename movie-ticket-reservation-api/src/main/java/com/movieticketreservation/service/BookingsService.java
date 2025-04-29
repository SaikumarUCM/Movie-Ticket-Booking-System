package com.movieticketreservation.service;

import com.movieticketreservation.dto.BookingsDto;
import com.movieticketreservation.exception.BookingsNotFoundException;

import java.util.List;
import java.util.Optional;

public interface BookingsService {
    List<BookingsDto> getBookings();

    Optional<BookingsDto> getBooking(String id) throws BookingsNotFoundException;

    BookingsDto addBooking(BookingsDto bookingsDto);

    Optional<BookingsDto> updateBooking(String id, BookingsDto updatedBookingsDto) throws BookingsNotFoundException;

    void deleteBooking(String id) throws BookingsNotFoundException;

    public List<BookingsDto> getBookingsByCustomerId(String customerId);

    Optional<BookingsDto> cancelBooking(String id);
}
