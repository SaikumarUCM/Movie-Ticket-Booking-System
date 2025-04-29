package com.movieticketreservation.serviceimpl;

import com.movieticketreservation.dto.PaymentsDto;
import com.movieticketreservation.entity.PaymentsEntity;
import com.movieticketreservation.exception.PaymentsNotFoundException;
import com.movieticketreservation.repository.PaymentsRepository;
import com.movieticketreservation.service.PaymentsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentsServiceImpl implements PaymentsService {

    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<PaymentsDto> getPayments() {
        List<PaymentsEntity> payments = paymentsRepository.findAll();
        return payments.stream().map(paymentsEntity -> modelMapper.map(paymentsEntity, PaymentsDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<PaymentsDto> getPayment(String id) throws PaymentsNotFoundException {
        Optional<PaymentsEntity> paymentsEntity = paymentsRepository.findById(id);
        if (paymentsEntity.isEmpty()) {
            throw new PaymentsNotFoundException("Payments not found");
        } else {
            return Optional.of(modelMapper.map(paymentsEntity.get(), PaymentsDto.class));
        }
    }

    @Override
    public PaymentsDto addPayment(PaymentsDto paymentsDto) {
        PaymentsEntity paymentsEntity = modelMapper.map(paymentsDto, PaymentsEntity.class);
        PaymentsEntity savedPaymentsEntity = paymentsRepository.save(paymentsEntity);
        return modelMapper.map(savedPaymentsEntity, PaymentsDto.class);
    }

    @Override
    public Optional<PaymentsDto> updatePayment(String id, PaymentsDto updatedPaymentsDto) throws PaymentsNotFoundException {
        Optional<PaymentsEntity> existingPaymentsEntity = paymentsRepository.findById(id);
        if (existingPaymentsEntity.isEmpty()) throw new PaymentsNotFoundException("Payments not found");

        PaymentsEntity updatedPaymentsEntity = modelMapper.map(updatedPaymentsDto, PaymentsEntity.class);
        updatedPaymentsEntity.setPaymentId(id);
        paymentsRepository.save(updatedPaymentsEntity);

        return Optional.of(modelMapper.map(updatedPaymentsEntity, PaymentsDto.class));
    }

    @Override
    public void deletePayment(String id) throws PaymentsNotFoundException {
        Optional<PaymentsEntity> existingPaymentsEntity = paymentsRepository.findById(id);
        if (existingPaymentsEntity.isEmpty()) throw new PaymentsNotFoundException("Payments not found");

        paymentsRepository.deleteById(id);
    }
}
