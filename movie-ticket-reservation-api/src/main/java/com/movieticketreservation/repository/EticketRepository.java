package com.movieticketreservation.repository;

import com.movieticketreservation.entity.EticketEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EticketRepository extends MongoRepository<EticketEntity, String> {
    Optional<EticketEntity> findByBookingId(String id);
    // Add custom queries if needed
}
