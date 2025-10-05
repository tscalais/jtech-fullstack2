package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticateUserUseCase {
    private final UserRepository userRepository;

    public AuthenticateUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String authenticate(String username, String password) {
        Optional<UserEntity> user = userRepository.findByUserName(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            //todo: gerar e retornar um token JWT real
            return "fake-jwt-token";
        }
        throw new RuntimeException("Usuário ou senha inválidos");
    }
}


