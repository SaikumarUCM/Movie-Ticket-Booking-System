package com.movieticketreservation.controller;

import com.movieticketreservation.dto.ScheduleDto;
import com.movieticketreservation.exception.ScheduleNotFoundException;
import com.movieticketreservation.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<List<ScheduleDto>> getSchedules() {
        List<ScheduleDto> schedules = scheduleService.getSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDto> getSchedule(@PathVariable String id) throws ScheduleNotFoundException {
        Optional<ScheduleDto> schedule = scheduleService.getSchedule(id);
        return ResponseEntity.ok(schedule.orElse(null));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<ScheduleDto> getScheduleBookings(@PathVariable String id
            , @RequestParam String date, @RequestParam String time) throws ScheduleNotFoundException {
        Optional<ScheduleDto> schedule = scheduleService.getScheduleBookings(id, date, time);
        return ResponseEntity.ok(schedule.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable String id, @RequestBody ScheduleDto updatedScheduleDto) throws ScheduleNotFoundException {
        Optional<ScheduleDto> updatedSchedule = scheduleService.updateSchedule(id, updatedScheduleDto);
        return ResponseEntity.ok(updatedSchedule.orElse(null));
    }

    @PutMapping("/{id}/cancel-show")
    public ResponseEntity<ScheduleDto> cancelEntireShow(@PathVariable String id
            , @RequestBody ScheduleDto scheduleDto) throws ScheduleNotFoundException {

        Optional<ScheduleDto> updateSchedule = scheduleService.cancelEntireShow(id, scheduleDto);
        return ResponseEntity.ok(updateSchedule.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String id) throws ScheduleNotFoundException {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ScheduleDto> addSchedule(@RequestBody ScheduleDto scheduleDto) {
        ScheduleDto newSchedule = scheduleService.addSchedule(scheduleDto);
        return ResponseEntity.ok(newSchedule);
    }
}
