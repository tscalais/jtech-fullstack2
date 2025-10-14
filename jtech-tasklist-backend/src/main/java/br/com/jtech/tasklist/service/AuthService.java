package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.InvalidCredentialsException;
import br.com.jtech.tasklist.config.infra.exceptions.UserNotFoundException;
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
            return new AuthResponse(jwtTokenService.generateToken(username), UserDTO.of(user.get()));
        }
        throw new InvalidCredentialsException();
    }



    public void resetPassword(String userName) {
        UserEntity user = userRepository.findByUserName(userName)
                .orElseThrow(UserNotFoundException::new);
        user.setPassword(passwordEncoder.encode(userName));
        userRepository.save(user);
    }
}
