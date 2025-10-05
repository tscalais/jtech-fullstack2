package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.User;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import br.com.jtech.tasklist.config.infra.exceptions.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String name, String password) {
        try {
            UserEntity user = new UserEntity();
            user.setUserName(name);
            user.setPassword(passwordEncoder.encode(password));
            return User.of(userRepository.save(user));
        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("Usuário já existe ou violação de chave primária.");
        }
    }

    public Optional<User> getProfile(Long id) {
        //todo: carregr o perfil completo
        return userRepository.findById(id).map(User::of);
    }

    public Optional<User> findById(Long id) {
        //todo: carregr apenas o dados basicos
        return userRepository.findById(id).map(User::of);
    }

    public Optional<User> findByUserName(String userName) {
        return userRepository.findByUserName(userName).map(User::of);
    }

}