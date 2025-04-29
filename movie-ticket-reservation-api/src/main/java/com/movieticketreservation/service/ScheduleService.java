package com.movieticketreservation.service;

import com.movieticketreservation.dto.ScheduleDto;
import com.movieticketreservation.exception.ScheduleNotFoundException;

import java.util.List;
import java.util.Optional;

public interface ScheduleService {
    List<ScheduleDto> getSchedules();

    Optional<ScheduleDto> getSchedule(String id) throws ScheduleNotFoundException;

    ScheduleDto addSchedule(ScheduleDto scheduleDto);

    Optional<ScheduleDto> updateSchedule(String id, ScheduleDto updatedScheduleDto) throws ScheduleNotFoundException;

    void deleteSchedule(String id) throws ScheduleNotFoundException;

    public Optional<ScheduleDto> getScheduleBookings(String id, String date, String time);

    Optional<ScheduleDto> cancelEntireShow(String id, ScheduleDto scheduleDto);
}
