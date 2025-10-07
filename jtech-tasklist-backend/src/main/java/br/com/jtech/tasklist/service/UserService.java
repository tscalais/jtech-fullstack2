package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.UserAlreadyExistsException;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO register(String name, String password) {
        try {
            UserEntity user = new UserEntity();
            user.setUserName(name);
            user.setPassword(passwordEncoder.encode(password));
            return UserDTO.of(userRepository.save(user));
        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("Usuário já existe ou violação de chave primária.");
        }
    }

    public Optional<UserDTO> getProfile(Long id) {
        //todo: carregr o perfil completo
        return userRepository.findById(id).map(UserDTO::of);
    }

    public Optional<UserDTO> findById(Long id) {
        //todo: carregr apenas o dados basicos
        return userRepository.findById(id).map(UserDTO::of);
    }

    public Optional<UserDTO> findByUserName(String userName) {
        return userRepository.findByUserName(userName).map(UserDTO::of);
    }

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(UserDTO::of).toList();
    }
}