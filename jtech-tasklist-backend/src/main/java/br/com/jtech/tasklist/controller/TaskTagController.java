package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.service.TaskTagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks/{taskId}/tags")
public class TaskTagController {
    private final TaskTagService taskTagService;

    public TaskTagController(TaskTagService taskTagService) {
        this.taskTagService = taskTagService;
    }

    @PostMapping("/{tagId}")
    public ResponseEntity<Void> associateTag(@PathVariable Long taskId, @PathVariable Long tagId) {
        taskTagService.associateTag(taskId, tagId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<Void> dissociateTag(@PathVariable Long taskId, @PathVariable Long tagId) {
        taskTagService.dissociateTag(taskId, tagId);
        return ResponseEntity.noContent().build();
    }
}
