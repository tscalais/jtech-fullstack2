package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.model.entities.TagEntity;
import br.com.jtech.tasklist.model.entities.TaskTagEntity;
import br.com.jtech.tasklist.repository.TaskRepository;
import br.com.jtech.tasklist.repository.TagRepository;
import br.com.jtech.tasklist.repository.TaskTagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskTagService {
    private final TaskTagRepository taskTagRepository;
    private final TaskRepository taskRepository;
    private final TagRepository tagRepository;

    public TaskTagService(TaskTagRepository taskTagRepository, TaskRepository taskRepository, TagRepository tagRepository) {
        this.taskTagRepository = taskTagRepository;
        this.taskRepository = taskRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional
    public void associateTag(Long taskId, Long tagId) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        TagEntity tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        if (taskTagRepository.findByTaskAndTag(task, tag).isEmpty()) {
            TaskTagEntity association = TaskTagEntity.builder().task(task).tag(tag).build();
            taskTagRepository.save(association);
        }
    }

    @Transactional
    public void dissociateTag(Long taskId, Long tagId) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        TagEntity tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        taskTagRepository.deleteByTaskAndTag(task, tag);
    }
}

