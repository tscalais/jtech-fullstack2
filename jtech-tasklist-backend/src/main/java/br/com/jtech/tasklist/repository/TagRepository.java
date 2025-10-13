package br.com.jtech.tasklist.repository;

import br.com.jtech.tasklist.model.entities.TagEntity;
import br.com.jtech.tasklist.model.entities.FolderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<TagEntity, Long> {
    List<TagEntity> findByFolder(FolderEntity folder);
}

