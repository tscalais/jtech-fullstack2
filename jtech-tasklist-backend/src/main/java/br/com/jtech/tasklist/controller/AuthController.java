
package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.AuthRequest;
import br.com.jtech.tasklist.dto.AuthResponse;
import br.com.jtech.tasklist.dto.UserRequest;
import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.service.UserService;
import br.com.jtech.tasklist.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRequest request) {
        User user = userService.register(request.getUserName(), request.getPassword());
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.getUserName(), request.getPassword()));
    }
}

