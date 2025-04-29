package com.movieticketreservation.serviceImpl;

import com.movieticketreservation.dto.ScheduleDto;
import com.movieticketreservation.entity.BookingsEntity;
import com.movieticketreservation.entity.PaymentDetailsEntity;
import com.movieticketreservation.entity.PaymentsEntity;
import com.movieticketreservation.entity.ScheduleEntity;
import com.movieticketreservation.exception.ScheduleNotFoundException;
import com.movieticketreservation.repository.BookingsRepository;
import com.movieticketreservation.repository.PaymentsRepository;
import com.movieticketreservation.repository.ScheduleRepository;
import com.movieticketreservation.service.ScheduleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private BookingsRepository bookingsRepository;
    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ScheduleDto> getSchedules() {
        List<ScheduleEntity> schedules = scheduleRepository.findAll();
        return schedules.stream().map(scheduleEntity -> modelMapper.map(scheduleEntity, ScheduleDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<ScheduleDto> getSchedule(String id) throws ScheduleNotFoundException {
        Optional<ScheduleEntity> scheduleEntity = scheduleRepository.findById(id);
        if (scheduleEntity.isEmpty()) {
            throw new ScheduleNotFoundException("Schedule not found");
        } else {
            return Optional.of(modelMapper.map(scheduleEntity.get(), ScheduleDto.class));
        }
    }

    @Override
    public ScheduleDto addSchedule(ScheduleDto scheduleDto) {
        ScheduleEntity scheduleEntity = modelMapper.map(scheduleDto, ScheduleEntity.class);
        ScheduleEntity savedScheduleEntity = scheduleRepository.save(scheduleEntity);
        return modelMapper.map(savedScheduleEntity, ScheduleDto.class);
    }

    @Override
    public Optional<ScheduleDto> updateSchedule(String id, ScheduleDto updatedScheduleDto) throws ScheduleNotFoundException {
        Optional<ScheduleEntity> existingScheduleEntity = scheduleRepository.findById(id);
        if (existingScheduleEntity.isEmpty()) throw new ScheduleNotFoundException("Schedule not found");

        ScheduleEntity updatedScheduleEntity = modelMapper.map(updatedScheduleDto, ScheduleEntity.class);
        updatedScheduleEntity.setScheduleId(id);
        scheduleRepository.save(updatedScheduleEntity);

        return Optional.of(modelMapper.map(updatedScheduleEntity, ScheduleDto.class));
    }

    @Override
    public void deleteSchedule(String id) throws ScheduleNotFoundException {
        Optional<ScheduleEntity> existingScheduleEntity = scheduleRepository.findById(id);
        if (existingScheduleEntity.isEmpty()) throw new ScheduleNotFoundException("Schedule not found");

        scheduleRepository.deleteById(id);
    }

    @Override
    public Optional<ScheduleDto> getScheduleBookings(String id, String date, String time) {
        Optional<ScheduleEntity> scheduleEntity = scheduleRepository.findById(id);

        if (scheduleEntity.isEmpty()) {
            throw new ScheduleNotFoundException("Schedule not found");
        } else {
            List<BookingsEntity> bookingsEntities = bookingsRepository.findByScheduleId(id);

            // Filter bookings based on provided date and time
            List<BookingsEntity> filteredBookings = bookingsEntities.stream()
                    .filter(bookingsEntity ->
                            date.equals(bookingsEntity.getShowDate()) && time.equals(bookingsEntity.getShowTime())
                                    && bookingsEntity.getStatus().equals("Confirmed"))
                    .toList();

            ScheduleDto scheduleDto = modelMapper.map(scheduleEntity.get(), ScheduleDto.class);

            if (filteredBookings.isEmpty()) {
                return Optional.of(scheduleDto);
            }

            List<String> seatNumbers = new ArrayList<>();
            filteredBookings.forEach(bookingsEntity -> {
                seatNumbers.addAll(bookingsEntity.getSeatNumbers());
            });


            scheduleDto.setBookedSeatNumbers(seatNumbers);
            return Optional.of(scheduleDto);
        }
    }

    @Override
    public Optional<ScheduleDto> cancelEntireShow(String id, ScheduleDto scheduleDto) {

        List<BookingsEntity> bookingsEntities = bookingsRepository
                .findByScheduleIdAndShowTimeAndShowDate(id
                        , scheduleDto.getShowTime(), scheduleDto.getShowDate());
        bookingsEntities.forEach(bookingsEntity -> {
            bookingsEntity.setStatus("Cancelled");
            bookingsRepository.save(bookingsEntity);
            PaymentsEntity paymentsEntity = paymentsRepository.findByCustomerId(bookingsEntity.getCustomerId());

            List<PaymentDetailsEntity> payments = paymentsEntity.getPayments();
            payments.forEach(paymentDetailsEntity -> {
                if (paymentDetailsEntity.getBookingId().equals(bookingsEntity.getBookingId())) {
                    paymentDetailsEntity.setStatus("Refunded");
                }
            });
            paymentsEntity.setPayments(payments);

            paymentsRepository.save(paymentsEntity);
        });

        return Optional.of(scheduleDto);

    }

}

