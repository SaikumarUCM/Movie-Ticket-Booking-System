package com.movieticketreservation.serviceImpl;

import com.movieticketreservation.dto.BookingsDto;
import com.movieticketreservation.dto.CustomerDto;
import com.movieticketreservation.dto.MovieDto;
import com.movieticketreservation.dto.ScheduleDto;
import com.movieticketreservation.entity.BookingsEntity;
import com.movieticketreservation.entity.CustomerEntity;
import com.movieticketreservation.entity.MovieEntity;
import com.movieticketreservation.entity.ScheduleEntity;
import com.movieticketreservation.exception.CustomerNotFoundException;
import com.movieticketreservation.repository.BookingsRepository;
import com.movieticketreservation.repository.CustomerRepository;
import com.movieticketreservation.repository.MovieRepository;
import com.movieticketreservation.repository.ScheduleRepository;
import com.movieticketreservation.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private BookingsRepository bookingsRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CustomerDto> getCustomers() {
        List<CustomerEntity> customers = customerRepository.findAll();
        return customers.stream().map(customerEntity -> modelMapper.map(customerEntity, CustomerDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<CustomerDto> getCustomer(String id) throws CustomerNotFoundException {
        Optional<CustomerEntity> customerEntity = customerRepository.findById(id);
        if (customerEntity.isEmpty()) {
            throw new CustomerNotFoundException("Customer not found");
        } else {
            CustomerDto finalCustomerDetails = modelMapper.map(customerEntity, CustomerDto.class);
            finalCustomerDetails.setPassword(null);
            finalCustomerDetails.setRole("ROLE_CUSTOMER");
            return Optional.of(finalCustomerDetails);
        }
    }

    @Override
    public CustomerDto addCustomer(CustomerDto customerDto) {
        CustomerEntity customerEntity = modelMapper.map(customerDto, CustomerEntity.class);
        CustomerEntity savedCustomerEntity = customerRepository.save(customerEntity);
        return modelMapper.map(savedCustomerEntity, CustomerDto.class);
    }

    @Override
    public Optional<CustomerDto> updateCustomer(String id, CustomerDto updatedCustomerDto) throws CustomerNotFoundException {
        Optional<CustomerEntity> existingCustomerEntity = customerRepository.findById(id);
        if (existingCustomerEntity.isEmpty()) throw new CustomerNotFoundException("Customer not found");

        CustomerEntity updatedCustomerEntity = modelMapper.map(updatedCustomerDto, CustomerEntity.class);
        updatedCustomerEntity.setCustomerId(id);
        updatedCustomerEntity.setPassword(existingCustomerEntity.get().getPassword());
        customerRepository.save(updatedCustomerEntity);

        CustomerDto finalCustomerDetails = modelMapper.map(updatedCustomerEntity, CustomerDto.class);
        finalCustomerDetails.setPassword(null);
        finalCustomerDetails.setRole("ROLE_CUSTOMER");

        return Optional.of(finalCustomerDetails);
    }

    @Override
    public void deleteCustomer(String id) throws CustomerNotFoundException {
        Optional<CustomerEntity> existingCustomerEntity = customerRepository.findById(id);
        if (existingCustomerEntity.isEmpty()) throw new CustomerNotFoundException("Customer not found");

        customerRepository.deleteById(id);
    }

    @Override
    public CustomerDto findByEmail(String email) throws CustomerNotFoundException {
        CustomerEntity customerEntity = customerRepository.findByEmail(email)
                .orElseThrow(() -> new CustomerNotFoundException("Unknown user"));

        return modelMapper.map(customerEntity, CustomerDto.class);
    }

    @Override
    public CustomerDto login(CustomerDto customerDto) {
        CustomerEntity customerEntity = customerRepository.findByEmail(customerDto.getEmail())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));

        if (customerEntity.getPassword() != null && customerEntity.getPassword().equals(customerDto.getPassword())) {
            CustomerDto finalCustomerDetails = modelMapper.map(customerEntity, CustomerDto.class);
            finalCustomerDetails.setPassword(null);
            finalCustomerDetails.setRole("ROLE_CUSTOMER");
            return finalCustomerDetails;
        }
        throw new CustomerNotFoundException("Invalid password");
    }

    @Override
    public List<BookingsDto> getBookingsByCustomerId(String customerId) {
        Optional<CustomerEntity> customerEntity = customerRepository.findById(customerId);
        if (customerEntity.isEmpty()) {
            throw new CustomerNotFoundException("Customer not found");
        }

        List<BookingsEntity> bookings = bookingsRepository.findAllByCustomerId(customerId);
        return getBookingsAndMovieDetails(bookings);
    }

    public List<BookingsDto> getBookingsAndMovieDetails(List<BookingsEntity> bookings) {
        return bookings.stream().map(bookingsEntity -> {
            BookingsDto bookingsDto = modelMapper.map(bookingsEntity, BookingsDto.class);
            Optional<ScheduleEntity> scheduleEntity = scheduleRepository.findById(bookingsDto.getScheduleId());
            if (scheduleEntity.isPresent()) {
                bookingsDto.setScheduleDto(modelMapper.map(scheduleEntity.get(), ScheduleDto.class));
                Optional<MovieEntity> movieEntity = movieRepository.findById(scheduleEntity.get().getMovieId());
                movieEntity.ifPresent(entity -> bookingsDto.setMovie(modelMapper.map(entity, MovieDto.class)));
            }
            return bookingsDto;
        }).toList();
    }

}
