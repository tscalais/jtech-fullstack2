package br.com.jtech.tasklist.service;
import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import br.com.jtech.tasklist.config.infra.exceptions.UserAlreadyExistsException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserUseCase {
    private final UserRepository userRepository;

    public RegisterUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String name, String password) {
        try {
            UserEntity user = new UserEntity();
            user.setUserName(name);
            user.setPassword(password);
            return User.of(userRepository.save(user));
        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("Usuário já existe ou violação de chave primária.");
        }
    }
}