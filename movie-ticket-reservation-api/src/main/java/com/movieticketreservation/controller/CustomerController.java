package com.movieticketreservation.controller;

import com.movieticketreservation.config.UserAuthenticationProvider;
import com.movieticketreservation.dto.BookingsDto;
import com.movieticketreservation.dto.CustomerDto;
import com.movieticketreservation.exception.CustomerNotFoundException;
import com.movieticketreservation.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    @GetMapping
    public ResponseEntity<List<CustomerDto>> getCustomers() {
        List<CustomerDto> customers = customerService.getCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomer(@PathVariable String id) throws CustomerNotFoundException {
        Optional<CustomerDto> customer = customerService.getCustomer(id);
        return ResponseEntity.ok(customer.orElse(null));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<List<BookingsDto>> getCustomerBookings
            (@PathVariable String id) throws CustomerNotFoundException {
        List<BookingsDto> customerBookings = customerService.getBookingsByCustomerId(id);
        return ResponseEntity.ok(customerBookings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable String id, @RequestBody CustomerDto updatedCustomerDto) throws CustomerNotFoundException {
        Optional<CustomerDto> updatedCustomer = customerService.updateCustomer(id, updatedCustomerDto);
        return ResponseEntity.ok(updatedCustomer.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) throws CustomerNotFoundException {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<CustomerDto> addCustomer(@RequestBody CustomerDto customerDto) {
        CustomerDto newCustomer = customerService.addCustomer(customerDto);
        return ResponseEntity.ok(newCustomer);
    }

    @PostMapping("/login")
    public ResponseEntity<CustomerDto> login(@RequestBody CustomerDto customerDto) {
        CustomerDto customer = customerService.login(customerDto);
        customer.setToken(userAuthenticationProvider.createToken(customerDto.getEmail(), customer.getCustomerId(), "ROLE_CUSTOMER"));
        return ResponseEntity.ok(customer);
    }
}
