package br.com.jtech.tasklist.model;


import br.com.jtech.tasklist.dto.UserRequest;
import br.com.jtech.tasklist.model.entities.UserEntity;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String id;
    private String userName;
    private String password;
    private String fullName;

    public static List<UserDTO> of(List<UserEntity> entities) {
        return entities.stream().map(UserDTO::of).toList();
    }

    public UserEntity toEntity() {
        return UserEntity.builder()
                .id(UUID.fromString(getId()))
                .userName(getUserName())
                .password(getPassword())
                .fullName(getFullName())
                .build();
    }

    public static UserDTO of(UserEntity entity) {
        return UserDTO.builder()
                .id(entity.getId().toString())
                .userName(entity.getUserName())
                .password(entity.getPassword())
                .fullName(entity.getFullName())
                .build();
    }

    public static UserDTO of(UserRequest request) {
        return UserDTO.builder()
                //.id(request.getId())
                .userName(request.getUserName())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .build();
    }
}
