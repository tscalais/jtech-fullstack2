package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.TasklistRequest;
import br.com.jtech.tasklist.model.Tasklist;
import br.com.jtech.tasklist.service.CreateTasklistUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tasklists")
public class CreateTasklistController {
    private final CreateTasklistUseCase createTasklistUseCase;

    public CreateTasklistController(CreateTasklistUseCase createTasklistUseCase) {
        this.createTasklistUseCase = createTasklistUseCase;
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody TasklistRequest request) {
        createTasklistUseCase.create( Tasklist.of( request) );
        return ResponseEntity.noContent().build();
    }
}