package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.model.entities.SubtaskEntity;
import br.com.jtech.tasklist.service.SubtaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtasks")
public class SubtaskController {
    @Autowired
    private SubtaskService subtaskService;

    @GetMapping("/task/{taskId}")
    public List<SubtaskEntity> listByTask(@PathVariable Long taskId) {
        return subtaskService.listByTask(taskId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubtaskEntity> getById(@PathVariable Long id) {
        return ResponseEntity.ok(subtaskService.getById(id));
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<SubtaskEntity> create(@PathVariable Long taskId, @RequestBody SubtaskEntity subtask) {
        return ResponseEntity.ok(subtaskService.create(taskId, subtask));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubtaskEntity> update(@PathVariable Long id, @RequestBody SubtaskEntity subtask) {
        return ResponseEntity.ok(subtaskService.update(id, subtask));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subtaskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

