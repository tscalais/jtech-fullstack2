package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.InvalidCredentialsException;
import br.com.jtech.tasklist.config.infra.jwt.JwtTokenService;
import br.com.jtech.tasklist.dto.AuthResponse;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public AuthResponse authenticate(String username, String password) {
        Optional<UserEntity> user = userRepository.findByUserName(username);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return new AuthResponse(jwtTokenService.generateToken(username));
        }
        throw new InvalidCredentialsException("Usuário ou senha inválidos");
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

    public UserDTO getCurrentUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new InvalidCredentialsException("Token inválido");
        }
        String token = authorizationHeader.substring(7);

        String username = jwtTokenService.getUsernameFromToken(token);
        UserEntity user = userRepository.findByUserName(username)
                .orElseThrow(() -> new InvalidCredentialsException("Usuário não encontrado"));
        return UserDTO.of(user);
    }

    public void resetPassword(String userName) {
        UserEntity user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new InvalidCredentialsException("Usuário não encontrado"));
        user.setPassword(passwordEncoder.encode(userName));
        userRepository.save(user);
    }
}
