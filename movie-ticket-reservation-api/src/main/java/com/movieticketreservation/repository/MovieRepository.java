package com.movieticketreservation.repository;

import com.movieticketreservation.entity.MovieEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends MongoRepository<MovieEntity, String> {
    Optional<MovieEntity> findByTitle(String title);
}
