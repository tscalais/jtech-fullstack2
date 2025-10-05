
package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.TokenResponse;
import br.com.jtech.tasklist.dto.UserRequest;
import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.service.RegisterUserUseCase;
import br.com.jtech.tasklist.service.AuthenticateUserUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final RegisterUserUseCase registerUserUseCase;
    private final AuthenticateUserUseCase authenticateUserUseCase;

    public AuthController(RegisterUserUseCase registerUserUseCase,
                          AuthenticateUserUseCase authenticateUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.authenticateUserUseCase = authenticateUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRequest request) {
        User user = registerUserUseCase.register(request.getUserName(), request.getPassword());
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody UserRequest request) {
        String token = authenticateUserUseCase.authenticate(request.getUserName(), request.getPassword());
        return ResponseEntity.ok(new TokenResponse(token));
    }
}

