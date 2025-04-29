package com.movieticketreservation.serviceImpl;

import com.movieticketreservation.dto.MovieDto;
import com.movieticketreservation.dto.ScheduleDto;
import com.movieticketreservation.entity.MovieEntity;
import com.movieticketreservation.entity.ScheduleEntity;
import com.movieticketreservation.exception.MovieNotFoundException;
import com.movieticketreservation.repository.MovieRepository;
import com.movieticketreservation.repository.ScheduleRepository;
import com.movieticketreservation.service.MovieService;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<MovieDto> getMovies() {
        List<MovieEntity> movies = movieRepository.findAll();

        return movies.stream().map(movieEntity -> {
            List<ScheduleEntity> scheduleEntities = scheduleRepository.findByMovieId(movieEntity.getMovieId());
            MovieDto movieDto = modelMapper.map(movieEntity, MovieDto.class);
            List<ScheduleDto> scheduleDtos = scheduleEntities.stream()
                    .map(scheduleEntity -> modelMapper.map(scheduleEntity, ScheduleDto.class))
                    .collect(Collectors.toList());
            movieDto.setScheduleDtos(scheduleDtos);
            return movieDto;
        }).collect(Collectors.toList());
    }

    @Override
    public Optional<MovieDto> getMovie(String id) throws MovieNotFoundException {
        Optional<MovieEntity> movieEntity = movieRepository.findById(id);
        if (movieEntity.isEmpty()) {
            throw new MovieNotFoundException("Movie not found");
        } else {
            List<ScheduleEntity> scheduleEntities = scheduleRepository.findByMovieId(movieEntity.get().getMovieId());
            MovieDto movieDto = modelMapper.map(movieEntity.get(), MovieDto.class);
            List<ScheduleDto> scheduleDtos = scheduleEntities.stream()
                    .map(scheduleEntity -> modelMapper.map(scheduleEntity, ScheduleDto.class))
                    .collect(Collectors.toList());
            movieDto.setScheduleDtos(scheduleDtos);
            return Optional.of(movieDto);
        }
    }

    @Override
    public MovieDto addMovie(MovieDto movieDto) {
        String id = new ObjectId().toString();
        MovieEntity movieEntity = modelMapper.map(movieDto, MovieEntity.class);
        String fileName = handleFileUpload(id, movieDto.getImage());
        movieEntity.setImageUrl(fileName);
        movieEntity.setMovieId(id);

        MovieEntity savedMovieEntity = movieRepository.save(movieEntity);
        return modelMapper.map(savedMovieEntity, MovieDto.class);
    }

    @Override
    public Optional<MovieDto> updateMovie(String id, MovieDto updatedMovieDto) throws MovieNotFoundException {
        Optional<MovieEntity> existingMovieEntity = movieRepository.findById(id);
        if (existingMovieEntity.isEmpty()) throw new MovieNotFoundException("Movie not found");

        MovieEntity updatedMovieEntity = modelMapper.map(updatedMovieDto, MovieEntity.class);

        String fileName = "";
        if (updatedMovieDto.getImage() != null) {
            fileName = handleFileUpload(id, updatedMovieDto.getImage());
            updatedMovieEntity.setImageUrl(fileName);
        }

        updatedMovieEntity.setMovieId(id);
        movieRepository.save(updatedMovieEntity);

        return Optional.of(modelMapper.map(updatedMovieEntity, MovieDto.class));
    }

    @Override
    public void deleteMovie(String id) throws MovieNotFoundException {
        Optional<MovieEntity> existingMovieEntity = movieRepository.findById(id);
        if (existingMovieEntity.isEmpty()) throw new MovieNotFoundException("Movie not found");

        movieRepository.deleteById(id);
    }

    @Override
    public Optional<MovieDto> findByTitle(String title) throws MovieNotFoundException {
        return Optional.empty();
    }


    private String handleFileUpload(String recipeId, MultipartFile movieImage) {
        String uniqueFileName = "";
        try {
            String uploadDir = "/Documents/GitHub/movie-ticket-reservation/movie-ticket-reservation-ui/src/images";
            String originalFileName = movieImage.getOriginalFilename();
            assert originalFileName != null;
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            uniqueFileName = recipeId + fileExtension;

            Path filePath = Paths.get(uploadDir, uniqueFileName);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

            Files.write(filePath, movieImage.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return uniqueFileName;
    }
}
