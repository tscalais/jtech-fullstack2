package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.model.TaskDTO;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.service.FolderService;
import br.com.jtech.tasklist.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folders/{folderId}/tasks")
public class TaskController {
    private final TaskService taskService;
    private final FolderService folderService;

    public TaskController(TaskService taskService, FolderService folderService) {
        this.taskService = taskService;
        this.folderService = folderService;
    }

    // Listar tarefas de uma pasta
    @GetMapping
    public ResponseEntity<List<TaskEntity>> listTasks(@PathVariable Long folderId) {
        return ResponseEntity.ok(taskService.listTasks(folderId));
    }

    // Criar tarefa em uma pasta
    @PostMapping
    public ResponseEntity<TaskEntity> createTask(@PathVariable Long folderId, @RequestBody TaskEntity task) {
        return ResponseEntity.ok(taskService.createTask(folderId, task));
    }

    // Obter tarefa por id
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskEntity> getTask(@PathVariable Long folderId, @PathVariable Long taskId) {
        TaskEntity task = taskService.getTask(folderId, taskId);
        return ResponseEntity.ok(task);
    }

    // Atualizar tarefa
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long folderId, @PathVariable Long taskId, @RequestBody TaskEntity task) {
        TaskEntity updated = taskService.updateTask(folderId, taskId, task);
        return ResponseEntity.ok(updated);
    }

    // Deletar tarefa
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long folderId, @PathVariable Long taskId) {
        taskService.deleteTask(folderId, taskId);
        return ResponseEntity.noContent().build();
    }

    // Listar subtarefas de uma tarefa
    @GetMapping("/{taskId}/subtasks")
    public ResponseEntity<List<TaskEntity>> listSubtasks(@PathVariable Long folderId, @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.listSubtasks(folderId, taskId));
    }

    // Criar subtarefa
    @PostMapping("/{taskId}/subtasks")
    public ResponseEntity<TaskEntity> createSubtask(@PathVariable Long folderId, @PathVariable Long taskId, @RequestBody TaskEntity subtask) {
        return ResponseEntity.ok(taskService.createSubtask(folderId, taskId, subtask));
    }

    // Atualizar status
    @PatchMapping("/{taskId}/completed")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long folderId, @PathVariable Long taskId) {
        TaskDTO updated = taskService.toggleComplete(folderId, taskId);
        return ResponseEntity.ok(updated);
    }

    // Atualizar favorito
    @PatchMapping("/{taskId}/favorite")
    public ResponseEntity<TaskDTO> updateFavorite(@PathVariable Long folderId, @PathVariable Long taskId) {
        TaskDTO updated = taskService.toggleFavorite(folderId, taskId);
        return ResponseEntity.ok(updated);
    }
}
