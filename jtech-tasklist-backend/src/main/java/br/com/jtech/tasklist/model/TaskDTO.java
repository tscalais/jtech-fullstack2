package br.com.jtech.tasklist.model;

import br.com.jtech.tasklist.model.entities.TaskEntity;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private boolean favorite;
    private FolderDTO folder;
    private java.util.List<br.com.jtech.tasklist.model.entities.TagEntity> tags;

    public static TaskDTO of(TaskEntity entity) {
        if (entity == null) return null;
        return TaskDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .completed(entity.isCompleted())
                .favorite(entity.isFavorite())
                .folder(FolderDTO.of(entity.getFolder()))
                .tags(entity.getTags())
                .build();
    }

    public TaskEntity toEntity() {
        return TaskEntity.builder()
                .id(this.id)
                .title(this.title)
                .description(this.description)
                .completed(this.completed)
                .favorite(this.favorite)
                .folder(this.folder != null ? this.folder.toEntity() : null)
                .tags(this.tags)
                .build();
    }
}
