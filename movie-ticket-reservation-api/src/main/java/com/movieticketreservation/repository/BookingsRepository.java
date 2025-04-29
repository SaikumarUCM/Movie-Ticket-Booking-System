package com.movieticketreservation.repository;

import com.movieticketreservation.entity.BookingsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingsRepository extends MongoRepository<BookingsEntity, String> {
    List<BookingsEntity> findByScheduleId(String id);

    List<BookingsEntity> findAllByCustomerId(String customerId);

    List<BookingsEntity> findByScheduleIdAndShowTimeAndShowDate(String scheduleId, String showTime, String showDate);

    // Add custom queries if needed
}
