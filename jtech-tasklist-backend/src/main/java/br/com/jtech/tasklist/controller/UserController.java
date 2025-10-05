package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<User> findByUsername(@PathVariable String username) {
        return userService.findByUserName(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<User> profile(@PathVariable Long id) {
        return userService.getProfile(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}