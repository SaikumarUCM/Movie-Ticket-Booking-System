package com.movieticketreservation.serviceImpl;

import com.movieticketreservation.dto.BookingsDto;
import com.movieticketreservation.dto.MovieDto;
import com.movieticketreservation.dto.ScheduleDto;
import com.movieticketreservation.entity.*;
import com.movieticketreservation.exception.BookingsNotFoundException;
import com.movieticketreservation.repository.*;
import com.movieticketreservation.service.BookingsService;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookingsServiceImpl implements BookingsService {

    @Autowired
    private BookingsRepository bookingsRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private PaymentsRepository paymentsRepository;
    @Autowired
    private EticketRepository eticketRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<BookingsDto> getBookings() {
        List<BookingsEntity> bookings = bookingsRepository.findAll();
        return getBookingsAndMovieDetails(bookings);
    }

    @Override
    public List<BookingsDto> getBookingsByCustomerId(String customerId) {
        List<BookingsEntity> bookings = bookingsRepository.findAllByCustomerId(customerId);
        return getBookingsAndMovieDetails(bookings);
    }

    @Override
    public Optional<BookingsDto> cancelBooking(String id) {
        Optional<BookingsEntity> bookingsEntity = bookingsRepository.findById(id);
        if (bookingsEntity.isEmpty()) {
            throw new BookingsNotFoundException("Bookings not found");
        } else {
            bookingsEntity.get().setStatus("Cancelled");
            bookingsRepository.save(bookingsEntity.get());

            PaymentsEntity paymentsEntity = paymentsRepository.findByCustomerId(bookingsEntity.get().getCustomerId());

            List<PaymentDetailsEntity> payments = paymentsEntity.getPayments();
            payments.forEach(paymentDetailsEntity -> {
                if (paymentDetailsEntity.getBookingId().equals(bookingsEntity.get().getBookingId())) {
                    paymentDetailsEntity.setStatus("Refunded");
                }
            });
            paymentsEntity.setPayments(payments);

            paymentsRepository.save(paymentsEntity);
            return Optional.of(modelMapper.map(bookingsEntity.get(), BookingsDto.class));
        }
    }

    public List<BookingsDto> getBookingsAndMovieDetails(List<BookingsEntity> bookings) {
        return bookings.stream().map(bookingsEntity -> {
            BookingsDto bookingsDto = modelMapper.map(bookingsEntity, BookingsDto.class);
            Optional<ScheduleEntity> scheduleEntity = scheduleRepository.findById(bookingsDto.getScheduleId());
            if (scheduleEntity.isPresent()) {
                bookingsDto.setScheduleDto(modelMapper.map(scheduleEntity.get(), ScheduleDto.class));
                Optional<MovieEntity> movieEntity = movieRepository.findById(scheduleEntity.get().getMovieId());
                movieEntity.ifPresent(entity -> bookingsDto.setMovie(modelMapper.map(entity, MovieDto.class)));
            }
            return bookingsDto;
        }).toList();
    }

    @Override
    public Optional<BookingsDto> getBooking(String id) throws BookingsNotFoundException {
        Optional<BookingsEntity> bookingsEntity = bookingsRepository.findById(id);
        if (bookingsEntity.isEmpty()) {
            throw new BookingsNotFoundException("Bookings not found");
        } else {
            return Optional.of(modelMapper.map(bookingsEntity.get(), BookingsDto.class));
        }
    }

    @Transactional
    @Override
    public BookingsDto addBooking(BookingsDto bookingsDto) {
        String id = new ObjectId().toString();

        BookingsEntity bookingsEntity = modelMapper.map(bookingsDto, BookingsEntity.class);
        bookingsEntity.setStatus("Confirmed");
        bookingsEntity.setBookingTime(LocalDateTime.now());
        bookingsEntity.setBookingId(id);

        PaymentDetailsEntity paymentDetailsEntity = modelMapper.map(bookingsDto.getPaymentDetails(), PaymentDetailsEntity.class);
        paymentDetailsEntity.setBookingId(id);
        paymentDetailsEntity.setPaymentId(new ObjectId().toString());
        paymentDetailsEntity.setPaymentDate(LocalDateTime.now());
        paymentDetailsEntity.setStatus("Paid");
        paymentDetailsEntity.setTotalAmount(bookingsDto.getTotalAmount());

        PaymentsEntity paymentsEntity = paymentsRepository.findByCustomerId(bookingsDto.getCustomerId());

        if (paymentsEntity == null) {
            paymentsEntity = new PaymentsEntity();
            paymentsEntity.setCustomerId(bookingsDto.getCustomerId());
            paymentsEntity.setUsername(bookingsDto.getUsername());
            List<PaymentDetailsEntity> payments = new ArrayList<>();
            payments.add(paymentDetailsEntity);
            paymentsEntity.setPayments(payments);
        } else {
            List<PaymentDetailsEntity> payments = paymentsEntity.getPayments();
            payments.add(paymentDetailsEntity);
            paymentsEntity.setPayments(payments);
        }

        paymentsRepository.save(paymentsEntity);

        EticketEntity eticketEntity = modelMapper.map(bookingsDto, EticketEntity.class);
        eticketEntity.setBookingId(id);

        eticketRepository.save(eticketEntity);

        BookingsEntity savedBookingsEntity = bookingsRepository.save(bookingsEntity);
        return modelMapper.map(savedBookingsEntity, BookingsDto.class);
    }

    @Override
    public Optional<BookingsDto> updateBooking(String id, BookingsDto updatedBookingsDto) throws BookingsNotFoundException {
        Optional<BookingsEntity> existingBookingsEntity = bookingsRepository.findById(id);
        if (existingBookingsEntity.isEmpty()) throw new BookingsNotFoundException("Bookings not found");

        BookingsEntity updatedBookingsEntity = modelMapper.map(updatedBookingsDto, BookingsEntity.class);
        updatedBookingsEntity.setBookingId(id);
        bookingsRepository.save(updatedBookingsEntity);

        return Optional.of(modelMapper.map(updatedBookingsEntity, BookingsDto.class));
    }

    @Override
    public void deleteBooking(String id) throws BookingsNotFoundException {
        Optional<BookingsEntity> existingBookingsEntity = bookingsRepository.findById(id);
        if (existingBookingsEntity.isEmpty()) throw new BookingsNotFoundException("Bookings not found");

        bookingsRepository.deleteById(id);
    }
}
