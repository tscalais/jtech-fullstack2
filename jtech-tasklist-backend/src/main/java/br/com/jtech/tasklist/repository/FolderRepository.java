package br.com.jtech.tasklist.repository;

import br.com.jtech.tasklist.model.entities.FolderEntity;
import br.com.jtech.tasklist.model.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<FolderEntity, Long> {
    List<FolderEntity> findByOwner(UserEntity owner);
}
