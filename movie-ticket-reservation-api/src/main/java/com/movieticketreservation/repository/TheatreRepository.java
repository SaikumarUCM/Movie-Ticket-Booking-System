package com.movieticketreservation.repository;

import com.movieticketreservation.entity.TheatreEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TheatreRepository extends MongoRepository<TheatreEntity, String> {
    // Add custom queries if needed
}
