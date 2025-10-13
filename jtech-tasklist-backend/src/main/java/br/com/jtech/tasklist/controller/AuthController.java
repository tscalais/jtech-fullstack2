package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.*;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.service.AuthService;
import br.com.jtech.tasklist.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRequest request) {
        UserDTO userDTO = userService.register(request.getUserName(), request.getPassword(), request.getFullName());
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.getUserName(), request.getPassword()));
    }

    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        boolean isValid = authService.validateToken(authorizationHeader);
        if (isValid) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        UserDTO userDTO = authService.getCurrentUser(authorizationHeader);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody AuthRequest user) {
        authService.resetPassword(user.getUserName());
        return ResponseEntity.ok().build();
    }

}
