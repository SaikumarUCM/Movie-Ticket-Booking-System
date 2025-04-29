package com.movieticketreservation.service;

import com.movieticketreservation.dto.EticketDto;
import com.movieticketreservation.exception.EticketNotFoundException;

import java.util.List;
import java.util.Optional;

public interface EticketService {
    List<EticketDto> getEtickets();

    Optional<EticketDto> getEticket(String id) throws EticketNotFoundException;

    EticketDto addEticket(EticketDto eticketDto);

    Optional<EticketDto> updateEticket(String id, EticketDto updatedEticketDto) throws EticketNotFoundException;

    void deleteEticket(String id) throws EticketNotFoundException;
}
