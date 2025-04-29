package com.movieticketreservation.serviceImpl;

import com.movieticketreservation.dto.EticketDto;
import com.movieticketreservation.entity.EticketEntity;
import com.movieticketreservation.exception.EticketNotFoundException;
import com.movieticketreservation.repository.EticketRepository;
import com.movieticketreservation.service.EticketService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EticketServiceImpl implements EticketService {

    @Autowired
    private EticketRepository eticketRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<EticketDto> getEtickets() {
        List<EticketEntity> etickets = eticketRepository.findAll();
        return etickets.stream().map(eticketEntity -> modelMapper.map(eticketEntity, EticketDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<EticketDto> getEticket(String id) throws EticketNotFoundException {
        Optional<EticketEntity> eticketEntity = eticketRepository.findByBookingId(id);
        if (eticketEntity.isEmpty()) {
            throw new EticketNotFoundException("Eticket not found");
        } else {
            return Optional.of(modelMapper.map(eticketEntity.get(), EticketDto.class));
        }
    }

    @Override
    public EticketDto addEticket(EticketDto eticketDto) {
        EticketEntity eticketEntity = modelMapper.map(eticketDto, EticketEntity.class);
        EticketEntity savedEticketEntity = eticketRepository.save(eticketEntity);
        return modelMapper.map(savedEticketEntity, EticketDto.class);
    }

    @Override
    public Optional<EticketDto> updateEticket(String id, EticketDto updatedEticketDto) throws EticketNotFoundException {
        Optional<EticketEntity> existingEticketEntity = eticketRepository.findById(id);
        if (existingEticketEntity.isEmpty()) throw new EticketNotFoundException("Eticket not found");

        EticketEntity updatedEticketEntity = modelMapper.map(updatedEticketDto, EticketEntity.class);
        updatedEticketEntity.setEticketId(id);
        eticketRepository.save(updatedEticketEntity);

        return Optional.of(modelMapper.map(updatedEticketEntity, EticketDto.class));
    }

    @Override
    public void deleteEticket(String id) throws EticketNotFoundException {
        Optional<EticketEntity> existingEticketEntity = eticketRepository.findById(id);
        if (existingEticketEntity.isEmpty()) throw new EticketNotFoundException("Eticket not found");

        eticketRepository.deleteById(id);
    }
}
