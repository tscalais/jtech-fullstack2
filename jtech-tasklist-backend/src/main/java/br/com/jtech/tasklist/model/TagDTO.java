package br.com.jtech.tasklist.model;

import br.com.jtech.tasklist.model.entities.TagEntity;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagDTO {
    private Long id;
    private String name;
    private String color; // Added for frontend compatibility if needed, though not in Entity yet

    public static TagDTO of(TagEntity entity) {
        if (entity == null) return null;
        return TagDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                // .color(entity.getColor()) // If color is added to entity later
                .build();
    }

    public TagEntity toEntity() {
        return TagEntity.builder()
                .id(this.id)
                .name(this.name)
                .build();
    }
}
