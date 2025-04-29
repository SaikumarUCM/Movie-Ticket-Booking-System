package com.movieticketreservation.service;

import com.movieticketreservation.dto.BookingsDto;
import com.movieticketreservation.dto.CustomerDto;
import com.movieticketreservation.exception.CustomerNotFoundException;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<CustomerDto> getCustomers();

    Optional<CustomerDto> getCustomer(String id) throws CustomerNotFoundException;

    CustomerDto addCustomer(CustomerDto customerDto);

    Optional<CustomerDto> updateCustomer(String id, CustomerDto updatedCustomerDto) throws CustomerNotFoundException;

    void deleteCustomer(String id) throws CustomerNotFoundException;

    CustomerDto findByEmail(String email) throws CustomerNotFoundException;

    CustomerDto login(CustomerDto customerDto);

    public List<BookingsDto> getBookingsByCustomerId(String customerId);
}
