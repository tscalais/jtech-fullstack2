package br.com.jtech.tasklist.repository;

import br.com.jtech.tasklist.model.entities.TaskTagEntity;
import br.com.jtech.tasklist.model.entities.TaskEntity;
import br.com.jtech.tasklist.model.entities.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskTagRepository extends JpaRepository<TaskTagEntity, Long> {
    List<TaskTagEntity> findByTask(TaskEntity task);
    List<TaskTagEntity> findByTag(TagEntity tag);
    Optional<TaskTagEntity> findByTaskAndTag(TaskEntity task, TagEntity tag);
    void deleteByTaskAndTag(TaskEntity task, TagEntity tag);
}
