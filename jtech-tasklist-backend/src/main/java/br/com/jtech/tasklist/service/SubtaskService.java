package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.entities.SubtaskEntity;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.repository.SubtaskRepository;
import br.com.jtech.tasklist.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class SubtaskService {
    @Autowired
    private SubtaskRepository subtaskRepository;
    @Autowired
    private TaskRepository taskRepository;

    public List<SubtaskEntity> listByTask(Long taskId) {
        return subtaskRepository.findByTaskId(taskId);
    }

    public SubtaskEntity getById(Long id) {
        return subtaskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subtarefa não encontrada"));
    }

    public SubtaskEntity create(Long taskId, SubtaskEntity subtask) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Tarefa não encontrada"));
        if (task.getSubtasks().size() >= 5) {
            throw new IllegalStateException("Limite de 5 subtarefas por tarefa atingido");
        }
        subtask.setTask(task);
        return subtaskRepository.save(subtask);
    }

    public SubtaskEntity update(Long id, SubtaskEntity subtaskUpdate) {
        SubtaskEntity subtask = getById(id);
        subtask.setDescription(subtaskUpdate.getDescription());
        subtask.setCompleted(subtaskUpdate.isCompleted());
        return subtaskRepository.save(subtask);
    }

    public void delete(Long id) {
        subtaskRepository.deleteById(id);
    }
}

