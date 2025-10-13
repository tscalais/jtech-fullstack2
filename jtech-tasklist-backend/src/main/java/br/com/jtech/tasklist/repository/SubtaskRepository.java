package br.com.jtech.tasklist.repository;

import br.com.jtech.tasklist.model.entities.SubtaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubtaskRepository extends JpaRepository<SubtaskEntity, Long> {
    List<SubtaskEntity> findByTaskId(Long taskId);
}

