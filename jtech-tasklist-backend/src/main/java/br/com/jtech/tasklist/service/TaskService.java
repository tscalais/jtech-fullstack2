package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.entities.FolderEntity;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private FolderService folderService;

    public List<TaskEntity> listTasks(Long folderId) {
        folderService.validateOwner(folderId);
        return taskRepository.findByFolderId(folderId);
    }

    public TaskEntity getTask(Long folderId, Long taskId) {
        folderService.validateOwner(folderId);
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getFolder().getId().equals(folderId)) {
            throw new RuntimeException("Task does not belong to this folder");
        }
        return task;
    }

    public TaskEntity createTask(Long folderId, TaskEntity task) {
        folderService.validateOwner(folderId);
        FolderEntity folder = folderService.getFolderEntity(folderId);
        task.setFolder(folder);
        return taskRepository.save(task);
    }

    public TaskEntity updateTask(Long folderId, Long taskId, TaskEntity task) {
        folderService.validateOwner(folderId);
        TaskEntity existing = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!existing.getFolder().getId().equals(folderId)) {
            throw new RuntimeException("Task does not belong to this folder");
        }
        task.setId(taskId);
        task.setFolder(existing.getFolder());
        return taskRepository.save(task);
    }

    public void deleteTask(Long folderId, Long taskId) {
        folderService.validateOwner(folderId);
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getFolder().getId().equals(folderId)) {
            throw new RuntimeException("Task does not belong to this folder");
        }
        taskRepository.deleteById(taskId);
    }
}

