package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.UserAlreadyExistsException;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.model.entities.*;
import br.com.jtech.tasklist.repository.*;
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

    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private TaskRepository taskRepository;

    public UserDTO register(String name, String password) {
        try {
            UserEntity user = new UserEntity();
            user.setUserName(name);
            user.setPassword(passwordEncoder.encode(password));
            user = userRepository.save(user);

            // Criar pasta de exemplo
            FolderEntity folder = new FolderEntity();
            folder.setName("Reforma do Escritório");
            folder.setOwner(user);
            folder = folderRepository.save(folder);

            // Criar tasks de exemplo
            TaskEntity task = new TaskEntity();
            task.setTitle("Planejamento");
            task.setDescription("Esta é uma tarefa de exemplo criada automaticamente.");
            task.setFolder(folder);
            task.setFavorite(true);
            task.setCompleted(false);
            taskRepository.save(task);

            task = new TaskEntity();
            task.setTitle("Compras");
            task.setDescription("Esta é uma tarefa de exemplo criada automaticamente.");
            task.setFolder(folder);
            task.setFavorite(true);
            task.setCompleted(false);
            taskRepository.save(task);


            task = new TaskEntity();
            task.setTitle("Execução");
            task.setDescription("Esta é uma tarefa de exemplo criada automaticamente.");
            task.setFolder(folder);
            task.setCompleted(false);
            taskRepository.save(task);

            return UserDTO.of(user);

        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("Usuário já existe.");
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