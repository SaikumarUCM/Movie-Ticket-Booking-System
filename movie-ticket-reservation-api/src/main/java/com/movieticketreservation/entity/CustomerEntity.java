package com.movieticketreservation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "customers")
public class CustomerEntity {

    @Id
    private String customerId;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
}
