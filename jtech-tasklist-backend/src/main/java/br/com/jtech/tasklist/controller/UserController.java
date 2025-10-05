package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.service.FindUserUseCase;
import br.com.jtech.tasklist.service.GetUserProfileUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final FindUserUseCase findUserUseCase;
    private final GetUserProfileUseCase getUserProfileUseCase;

    public UserController(FindUserUseCase findUserUseCase, GetUserProfileUseCase getUserProfileUseCase) {
        this.findUserUseCase = findUserUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> findByUsername(@PathVariable String username) {
        return findUserUseCase.findByEmail(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<User> profile(@PathVariable Long id) {
        return getUserProfileUseCase.getProfile(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}