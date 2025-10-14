package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.*;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.service.AuthService;
import br.com.jtech.tasklist.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRequest request, @RequestBody boolean criarExemplo) {
        UserDTO userDTO = userService.register(request, criarExemplo);
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.getUserName(), request.getPassword()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody AuthRequest user) {
        authService.resetPassword(user.getUserName());
        return ResponseEntity.ok().build();
    }

}
