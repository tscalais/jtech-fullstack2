package br.com.jtech.tasklist.model;

import br.com.jtech.tasklist.model.entities.FolderEntity;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolderDTO {
    private Long id;
    private String name;
    private String ownerId;
    private String ownerUsername;
    private String createdAt;
    private String updatedAt;
    private List<TaskDTO> tasks;

    public static FolderDTO of(FolderEntity entity) {
        if (entity == null) return null;
        return FolderDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                // FolderEntity não tem description nem tasks
                .build();
    }

    public FolderEntity toEntity() {
        return FolderEntity.builder()
                .id(this.id)
                .name(this.name)
                // FolderEntity não tem description nem tasks
                .build();
    }
}