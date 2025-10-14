package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.model.TaskDTO;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/folders/{folderId}/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskEntity> updateTaskStatus(
            @PathVariable Long folderId,
            @PathVariable Long taskId,
            @RequestBody TaskStatusRequest request) {
        TaskEntity updated = taskService.updateTaskStatus(folderId, taskId, request.isCompleted());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/favorite")
    public ResponseEntity<TaskDTO> updateFavorite(@PathVariable Long id) {
        TaskDTO updated = taskService.toggleFavorite(id);
        return ResponseEntity.ok(updated);
    }
}
