package com.movieticketreservation.repository;

import com.movieticketreservation.entity.PaymentsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentsRepository extends MongoRepository<PaymentsEntity, String> {
    PaymentsEntity findByCustomerId(String customerId);
    // Add custom queries if needed
}
