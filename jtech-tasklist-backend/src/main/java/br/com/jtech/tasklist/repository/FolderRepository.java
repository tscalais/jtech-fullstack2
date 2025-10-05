package br.com.jtech.tasklist.repository;

import br.com.jtech.tasklist.model.Folder;
import br.com.jtech.tasklist.model.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwner(UserEntity owner);
}
