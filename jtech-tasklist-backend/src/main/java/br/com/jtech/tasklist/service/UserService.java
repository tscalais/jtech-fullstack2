package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.*;
import br.com.jtech.tasklist.config.infra.jwt.JwtTokenService;
import br.com.jtech.tasklist.dto.UserRequest;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.model.entities.*;
import br.com.jtech.tasklist.repository.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FolderRepository folderRepository;
    private final TaskRepository taskRepository;
    private final JwtTokenService jwtTokenService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, FolderRepository folderRepository, TaskRepository taskRepository, JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.folderRepository = folderRepository;
        this.taskRepository = taskRepository;
        this.jwtTokenService = jwtTokenService;
    }

    public UserDTO register(UserRequest request, boolean criarExemplo) {
        try {
            UserEntity user = new UserEntity();
            user.setFullName(request.getFullName());
            user.setUserName(request.getUserName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            user = userRepository.save(user);

            if (criarExemplo) {
                criarDadosExemplo(user);
            }

            return UserDTO.of(user);

        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("Usuário já existe.");
        }
    }

    private void criarDadosExemplo(UserEntity user) {
        FolderEntity folder = new FolderEntity();
        folder.setName("Reforma do Escritório");
        folder.setOwner(user);
        folder = folderRepository.save(folder);

        TaskEntity planejamento = new TaskEntity();
        planejamento.setTitle("Planejamento");
        planejamento.setDescription("Definir o escopo e o orçamento da reforma.");
        planejamento.setFolder(folder);
        planejamento.setFavorite(true);
        planejamento.setCompleted(false);
        planejamento = taskRepository.save(planejamento);

        TaskEntity levantamento = new TaskEntity();
        levantamento.setTitle("Levantamento de necessidades");
        levantamento.setDescription("Listar tudo que precisa ser reformado.");
        levantamento.setFolder(folder);
        levantamento.setParentTask(planejamento);
        levantamento.setCompleted(false);
        levantamento = taskRepository.save(levantamento);

        TaskEntity orcamento = new TaskEntity();
        orcamento.setTitle("Orçamento");
        orcamento.setDescription("Solicitar orçamentos a fornecedores.");
        orcamento.setFolder(folder);
        orcamento.setParentTask(planejamento);
        orcamento.setCompleted(false);
        orcamento = taskRepository.save(orcamento);

        TaskEntity compras = new TaskEntity();
        compras.setTitle("Compras");
        compras.setDescription("Lista de compras para a reforma.");
        compras.setFolder(folder);
        compras.setFavorite(true);
        compras.setCompleted(false);
        compras = taskRepository.save(compras);

        TaskEntity materiais = new TaskEntity();
        materiais.setTitle("Materiais");
        materiais.setDescription("Comprar materiais de construção.");
        materiais.setFolder(folder);
        materiais.setParentTask(compras);
        materiais.setCompleted(false);
        materiais = taskRepository.save(materiais);

        TaskEntity moveis = new TaskEntity();
        moveis.setTitle("Móveis");
        moveis.setDescription("Comprar móveis novos para o escritório.");
        moveis.setFolder(folder);
        moveis.setParentTask(compras);
        moveis.setCompleted(false);
        moveis = taskRepository.save(moveis);

        TaskEntity execucao = new TaskEntity();
        execucao.setTitle("Execução");
        execucao.setDescription("Acompanhamento da execução da reforma.");
        execucao.setFolder(folder);
        execucao.setCompleted(false);
        execucao = taskRepository.save(execucao);

        TaskEntity pintura = new TaskEntity();
        pintura.setTitle("Pintura");
        pintura.setDescription("Pintar as paredes do escritório.");
        pintura.setFolder(folder);
        pintura.setParentTask(execucao);
        pintura.setCompleted(false);
        pintura = taskRepository.save(pintura);

        TaskEntity eletrica = new TaskEntity();
        eletrica.setTitle("Elétrica");
        eletrica.setDescription("Revisar a parte elétrica.");
        eletrica.setFolder(folder);
        eletrica.setParentTask(execucao);
        eletrica.setCompleted(false);
        eletrica = taskRepository.save(eletrica);

        TaskEntity finalizacao = new TaskEntity();
        finalizacao.setTitle("Finalização");
        finalizacao.setDescription("Verificar se tudo está conforme o planejado.");
        finalizacao.setFolder(folder);
        finalizacao.setCompleted(false);
        finalizacao = taskRepository.save(finalizacao);

        TaskEntity checklist = new TaskEntity();
        checklist.setTitle("Checklist de entrega");
        checklist.setDescription("Conferir todos os itens da reforma.");
        checklist.setFolder(folder);
        checklist.setParentTask(finalizacao);
        checklist.setCompleted(false);
        checklist = taskRepository.save(checklist);
    }

    public Optional<UserDTO> getProfile(Long id) {
        return userRepository.findById(id).map(UserDTO::of);
    }

    public Optional<UserDTO> findById(Long id) {
        return userRepository.findById(id).map(UserDTO::of);
    }

    public Optional<UserDTO> findByUserName(String userName) {
        return userRepository.findByUserName(userName).map(UserDTO::of);
    }

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(UserDTO::of).toList();
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
                .orElseThrow(UserNotFoundException::new);
        return UserDTO.of(user);
    }

}