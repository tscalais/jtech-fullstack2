package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.TaskPinnedRequest;
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

    @PatchMapping("/{id}/pinned")
    public ResponseEntity<TaskDTO> updatePinned(@PathVariable Long id, @RequestBody TaskPinnedRequest request) {
        TaskDTO updated = taskService.updatePinned(id, request.isPinned());
        return ResponseEntity.ok(updated);
    }

    // Outros endpoints podem ser adicionados aqui
}
