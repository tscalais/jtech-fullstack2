package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.jwt.JwtTokenService;
import br.com.jtech.tasklist.dto.AuthResponse;
import br.com.jtech.tasklist.config.infra.exceptions.InvalidCredentialsException;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse authenticate(String username, String password) {
        Optional<UserEntity> user = userRepository.findByUserName(username);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return new AuthResponse(jwtTokenService.generateToken(username));
        }
        throw new InvalidCredentialsException("Invalid username or password");
    }

    public boolean validateToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authorizationHeader.substring(7);
        try {
            return jwtTokenService.validateToken(token);
        } catch (Exception e) {
            return false;
        }
    }
}
