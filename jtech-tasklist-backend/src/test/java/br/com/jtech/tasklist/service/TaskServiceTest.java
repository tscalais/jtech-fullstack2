package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.entities.FolderEntity;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private FolderService folderService;
    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void listTasks_success() {
        Long folderId = 1L;
        TaskEntity task = new TaskEntity();
        when(taskRepository.findByFolderId(folderId)).thenReturn(Collections.singletonList(task));
        doNothing().when(folderService).validateOwner(folderId);
        assertFalse(taskService.listTasks(folderId).isEmpty());
    }

    @Test
    void getTask_success() {
        Long folderId = 1L;
        Long taskId = 2L;
        FolderEntity folder = new FolderEntity();
        folder.setId(folderId);
        TaskEntity task = new TaskEntity();
        task.setId(taskId);
        task.setFolder(folder);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        doNothing().when(folderService).validateOwner(folderId);
        assertEquals(task, taskService.getTask(folderId, taskId));
    }

    @Test
    void getTask_notFound() {
        Long folderId = 1L;
        Long taskId = 2L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());
        doNothing().when(folderService).validateOwner(folderId);
        assertThrows(RuntimeException.class, () -> taskService.getTask(folderId, taskId));
    }

    @Test
    void createTask_success() {
        Long folderId = 1L;
        TaskEntity task = new TaskEntity();
        FolderEntity folder = new FolderEntity();
        folder.setId(folderId);
        when(folderService.getFolderEntity(folderId)).thenReturn(folder);
        when(taskRepository.save(any(TaskEntity.class))).thenReturn(task);
        doNothing().when(folderService).validateOwner(folderId);
        assertEquals(task, taskService.createTask(folderId, task));
    }

    @Test
    void updateTask_notFound() {
        Long folderId = 1L;
        Long taskId = 2L;
        TaskEntity task = new TaskEntity();
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());
        doNothing().when(folderService).validateOwner(folderId);
        assertThrows(RuntimeException.class, () -> taskService.updateTask(folderId, taskId, task));
    }

    @Test
    void deleteTask_notFound() {
        Long folderId = 1L;
        Long taskId = 2L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());
        doNothing().when(folderService).validateOwner(folderId);
        assertThrows(RuntimeException.class, () -> taskService.deleteTask(folderId, taskId));
    }

    @Test
    void updateTaskStatus_success() {
        Long folderId = 1L;
        Long taskId = 2L;
        FolderEntity folder = new FolderEntity();
        folder.setId(folderId);
        TaskEntity task = new TaskEntity();
        task.setId(taskId);
        task.setFolder(folder);
        task.setCompleted(false);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        doNothing().when(folderService).validateOwner(folderId);
        when(taskRepository.save(any(TaskEntity.class))).thenAnswer(i -> i.getArgument(0));
        TaskEntity updated = taskService.updateTaskStatus(folderId, taskId, true);
        assertTrue(updated.isCompleted());
    }

    @Test
    void updateTaskStatus_taskNotFound() {
        Long folderId = 1L;
        Long taskId = 2L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());
        doNothing().when(folderService).validateOwner(folderId);
        assertThrows(RuntimeException.class, () -> taskService.updateTaskStatus(folderId, taskId, true));
    }

    @Test
    void updateTaskStatus_taskNotInFolder() {
        Long folderId = 1L;
        Long taskId = 2L;
        FolderEntity folder = new FolderEntity();
        folder.setId(99L);
        TaskEntity task = new TaskEntity();
        task.setId(taskId);
        task.setFolder(folder);
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        doNothing().when(folderService).validateOwner(folderId);
        assertThrows(RuntimeException.class, () -> taskService.updateTaskStatus(folderId, taskId, true));
    }
}
