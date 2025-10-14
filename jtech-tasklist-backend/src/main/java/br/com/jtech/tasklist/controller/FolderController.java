package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.FolderRequest;
import br.com.jtech.tasklist.dto.FolderResponse;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.service.FolderService;
import br.com.jtech.tasklist.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folders")
public class FolderController {
    private final FolderService folderService;
    private final TaskService taskService;

    public FolderController(FolderService folderService, TaskService taskService) {
        this.folderService = folderService;
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<FolderResponse> create(@RequestBody FolderRequest request) {
        return ResponseEntity.ok(folderService.createFolder(request));
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> list() {
        return ResponseEntity.ok(folderService.listFolders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FolderResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(folderService.getFolder(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> update(@PathVariable Long id, @RequestBody FolderRequest request) {
        return ResponseEntity.ok(folderService.updateFolder(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{folderId}/tasks")
    public ResponseEntity<List<TaskEntity>> listTasks(@PathVariable Long folderId) {
        return ResponseEntity.ok(taskService.listTasks(folderId));
    }

    @GetMapping("/{folderId}/tasks/{taskId}")
    public ResponseEntity<TaskEntity> getTask(@PathVariable Long folderId, @PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTask(folderId, taskId));
    }

    @PostMapping("/{folderId}/tasks")
    public ResponseEntity<TaskEntity> createTask(@PathVariable Long folderId, @RequestBody TaskEntity task) {
        return ResponseEntity.ok(taskService.createTask(folderId, task));
    }

    @PutMapping("/{folderId}/tasks/{taskId}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long folderId, @PathVariable Long taskId, @RequestBody TaskEntity task) {
        return ResponseEntity.ok(taskService.updateTask(folderId, taskId, task));
    }

    @DeleteMapping("/{folderId}/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long folderId, @PathVariable Long taskId) {
        taskService.deleteTask(folderId, taskId);
        return ResponseEntity.noContent().build();
    }
}
