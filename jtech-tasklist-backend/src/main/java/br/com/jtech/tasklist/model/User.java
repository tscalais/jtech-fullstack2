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
public class User {

    private String id;
    private String userName;
    private String password;

    public static List<User> of(List<UserEntity> entities) {
        return entities.stream().map(User::of).toList();
    }

    public UserEntity toEntity() {
        return UserEntity.builder()
                .id(UUID.fromString(getId()))
                .userName(getUserName())
                .password(getPassword())
                .build();
    }

    public static User of(UserEntity entity) {
        return User.builder()
                .id(entity.getId().toString())
                .userName(entity.getUserName())
                .password(entity.getPassword())
                .build();
    }

    public static User of(UserRequest request) {
        return User.builder()
                //.id(request.getId())
                .userName(request.getUserName())
                .password(request.getPassword())
                .build();
    }
}
