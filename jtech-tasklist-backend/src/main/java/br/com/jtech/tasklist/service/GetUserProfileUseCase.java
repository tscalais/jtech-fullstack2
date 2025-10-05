package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GetUserProfileUseCase {
    private final UserRepository userRepository;

    public GetUserProfileUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getProfile(Long userId) {
        return userRepository.findById(userId).map(User::of);
    }
}


