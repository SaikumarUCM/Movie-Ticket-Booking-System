package com.movieticketreservation.controller;

import com.movieticketreservation.dto.EticketDto;
import com.movieticketreservation.exception.EticketNotFoundException;
import com.movieticketreservation.service.EticketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/eticket")
public class EticketController {

    @Autowired
    private EticketService eticketService;

    @GetMapping
    public ResponseEntity<List<EticketDto>> getEtickets() {
        List<EticketDto> etickets = eticketService.getEtickets();
        return ResponseEntity.ok(etickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EticketDto> getEticket(@PathVariable String id) throws EticketNotFoundException {
        Optional<EticketDto> eticket = eticketService.getEticket(id);
        return ResponseEntity.ok(eticket.orElse(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EticketDto> updateEticket(@PathVariable String id, @RequestBody EticketDto updatedEticketDto) throws EticketNotFoundException {
        Optional<EticketDto> updatedEticket = eticketService.updateEticket(id, updatedEticketDto);
        return ResponseEntity.ok(updatedEticket.orElse(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEticket(@PathVariable String id) throws EticketNotFoundException {
        eticketService.deleteEticket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<EticketDto> addEticket(@RequestBody EticketDto eticketDto) {
        EticketDto newEticket = eticketService.addEticket(eticketDto);
        return ResponseEntity.ok(newEticket);
    }
}
