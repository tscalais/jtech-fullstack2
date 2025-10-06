
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
        UserDTO userDTO = userService.register(request.getUserName(), request.getPassword());
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request.getUserName(), request.getPassword()));
    }
}

