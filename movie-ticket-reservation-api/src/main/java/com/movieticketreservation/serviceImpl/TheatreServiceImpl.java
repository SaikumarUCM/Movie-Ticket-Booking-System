package com.movieticketreservation.serviceimpl;

import com.movieticketreservation.dto.TheatreDto;
import com.movieticketreservation.entity.TheatreEntity;
import com.movieticketreservation.exception.TheatreNotFoundException;
import com.movieticketreservation.repository.TheatreRepository;
import com.movieticketreservation.service.TheatreService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TheatreServiceImpl implements TheatreService {

    @Autowired
    private TheatreRepository theatreRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<TheatreDto> getTheatres() {
        List<TheatreEntity> theatres = theatreRepository.findAll();
        return theatres.stream().map(theatreEntity -> modelMapper.map(theatreEntity, TheatreDto.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<TheatreDto> getTheatre(String id) throws TheatreNotFoundException {
        Optional<TheatreEntity> theatreEntity = theatreRepository.findById(id);
        if (theatreEntity.isEmpty()) {
            throw new TheatreNotFoundException("Theatre not found");
        } else {
            return Optional.of(modelMapper.map(theatreEntity.get(), TheatreDto.class));
        }
    }

    @Override
    public TheatreDto addTheatre(TheatreDto theatreDto) {
        TheatreEntity theatreEntity = modelMapper.map(theatreDto, TheatreEntity.class);
        TheatreEntity savedTheatreEntity = theatreRepository.save(theatreEntity);
        return modelMapper.map(savedTheatreEntity, TheatreDto.class);
    }

    @Override
    public Optional<TheatreDto> updateTheatre(String id, TheatreDto updatedTheatreDto) throws TheatreNotFoundException {
        Optional<TheatreEntity> existingTheatreEntity = theatreRepository.findById(id);
        if (existingTheatreEntity.isEmpty()) throw new TheatreNotFoundException("Theatre not found");

        TheatreEntity updatedTheatreEntity = modelMapper.map(updatedTheatreDto, TheatreEntity.class);
        updatedTheatreEntity.setTheatreId(id);
        theatreRepository.save(updatedTheatreEntity);

        return Optional.of(modelMapper.map(updatedTheatreEntity, TheatreDto.class));
    }

    @Override
    public void deleteTheatre(String id) throws TheatreNotFoundException {
        Optional<TheatreEntity> existingTheatreEntity = theatreRepository.findById(id);
        if (existingTheatreEntity.isEmpty()) throw new TheatreNotFoundException("Theatre not found");

        theatreRepository.deleteById(id);
    }
}
