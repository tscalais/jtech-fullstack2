package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class FindUserUseCase {
    private final UserRepository userRepository;

    public FindUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id).map(User::of);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByUserName(email).map(User::of);
    }
}
