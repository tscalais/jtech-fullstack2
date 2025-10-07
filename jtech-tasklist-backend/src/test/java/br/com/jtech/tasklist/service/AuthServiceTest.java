package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.InvalidCredentialsException;
import br.com.jtech.tasklist.config.infra.jwt.JwtTokenService;
import br.com.jtech.tasklist.dto.AuthResponse;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtTokenService jwtTokenService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(userRepository);
        authService.jwtTokenService = jwtTokenService;
        authService.passwordEncoder = passwordEncoder;
    }

    @Test
    void authenticate_success() {
        String username = "user";
        String password = "pass";
        UserEntity user = new UserEntity();
        user.setUserName(username);
        user.setPassword("encoded");
        when(userRepository.findByUserName(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, "encoded")).thenReturn(true);
        when(jwtTokenService.generateToken(username)).thenReturn("token");

        AuthResponse response = authService.authenticate(username, password);
        assertNotNull(response);
        assertEquals("token", response.getToken());
    }

    @Test
    void authenticate_invalidCredentials() {
        String username = "user";
        String password = "wrong";
        UserEntity user = new UserEntity();
        user.setUserName(username);
        user.setPassword("encoded");
        when(userRepository.findByUserName(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, "wrong")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.authenticate(username, password));
    }

    @Test
    void authenticate_userNotFound() {
        String username = "user";
        String password = "pass";
        when(userRepository.findByUserName(username)).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.authenticate(username, password));
    }
}

