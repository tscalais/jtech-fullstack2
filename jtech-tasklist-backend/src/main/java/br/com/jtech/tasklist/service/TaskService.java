package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.TaskDTO;
import br.com.jtech.tasklist.model.entities.FolderEntity;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.repository.TaskRepository;
import br.com.jtech.tasklist.config.infra.exceptions.TaskNotInFolderException;
import br.com.jtech.tasklist.config.infra.exceptions.MaxSubtasksExceededException;
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
                .orElseThrow(TaskNotInFolderException::new);
        if (!task.getFolder().getId().equals(folderId)) {
            throw new TaskNotInFolderException();
        }
        return task;
    }

    public TaskEntity createTask(Long folderId, TaskEntity task) {
        folderService.validateOwner(folderId);
        FolderEntity folder = folderService.getFolderEntity(folderId);
        task.setFolder(folder);
        if (task.getParentTask() != null) {
            TaskEntity parent = taskRepository.findById(task.getParentTask().getId())
                    .orElseThrow(TaskNotInFolderException::new);
            if (parent.getSubtasks() != null && parent.getSubtasks().size() >= 5) {
                throw new MaxSubtasksExceededException();
            }
        }
        return taskRepository.save(task);
    }

    public TaskEntity updateTask(Long folderId, Long taskId, TaskEntity task) {
        folderService.validateOwner(folderId);
        TaskEntity existing = taskRepository.findById(taskId)
                .orElseThrow(TaskNotInFolderException::new);
        if (!existing.getFolder().getId().equals(folderId)) {
            throw new TaskNotInFolderException();
        }
        // Validação: limitar a 5 subtarefas por tarefa ao alterar parentTask
        if (task.getParentTask() != null && (existing.getParentTask() == null ||
                !task.getParentTask().getId().equals(existing.getParentTask().getId()))) {
            TaskEntity parent = taskRepository.findById(task.getParentTask().getId())
                    .orElseThrow(TaskNotInFolderException::new);
            if (parent.getSubtasks() != null && parent.getSubtasks().size() >= 5) {
                throw new MaxSubtasksExceededException();
            }
        }
        task.setId(taskId);
        task.setFolder(existing.getFolder());
        return taskRepository.save(task);
    }

    public void deleteTask(Long folderId, Long taskId) {
        folderService.validateOwner(folderId);
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(TaskNotInFolderException::new);
        if (!task.getFolder().getId().equals(folderId)) {
            throw new TaskNotInFolderException();
        }
        taskRepository.deleteById(taskId);
    }

    public TaskEntity updateTaskStatus(Long folderId, Long taskId, boolean completed) {
        folderService.validateOwner(folderId);
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(TaskNotInFolderException::new);
        if (!task.getFolder().getId().equals(folderId)) {
            throw new TaskNotInFolderException();
        }
        task.setCompleted(completed);
        return taskRepository.save(task);
    }

    public List<TaskEntity> listSubtasks(Long folderId, Long taskId) {
        folderService.validateOwner(folderId);
        TaskEntity parent = getTask(folderId, taskId);
        return parent.getSubtasks();
    }

    public TaskEntity createSubtask(Long folderId, Long taskId, TaskEntity subtask) {
        folderService.validateOwner(folderId);
        TaskEntity parent = getTask(folderId, taskId);
        if (parent.getSubtasks() != null && parent.getSubtasks().size() >= 5) {
            throw new MaxSubtasksExceededException();
        }
        subtask.setParentTask(parent);
        subtask.setFolder(parent.getFolder());
        return taskRepository.save(subtask);
    }

    public TaskDTO toggleFavorite(Long folderId, Long taskId) {
        folderService.validateOwner(folderId);
        TaskEntity task = getTask(folderId, taskId);
        task.setFavorite(!task.isFavorite());
        task = taskRepository.save(task);
        return TaskDTO.of(task);
    }

    public TaskDTO toggleComplete(Long folderId, Long taskId) {
        folderService.validateOwner(folderId);
        TaskEntity task = getTask(folderId, taskId);
        task.setCompleted(!task.isCompleted());
        task = taskRepository.save(task);
        return TaskDTO.of(task);
    }
}
