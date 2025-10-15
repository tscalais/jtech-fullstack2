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

    public UserDTO register(UserRequest request) {
        try {
            UserEntity user = new UserEntity();
            user.setFullName(request.getFullName());
            user.setUserName(request.getUserName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            user = userRepository.save(user);

            if (request.getCriarExemplo()) {
                criarDadosExemplo(user);
            }

            return UserDTO.of(user);

        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException();
        }
    }

    private void criarDadosExemplo(UserEntity user) {
        // Pasta de exemplo original
        FolderEntity reformaEscritorio = new FolderEntity();
        reformaEscritorio.setName("Reforma do Escritório");
        reformaEscritorio.setOwner(user);
        reformaEscritorio = folderRepository.save(reformaEscritorio);

        TaskEntity planejamento = new TaskEntity();
        planejamento.setTitle("Planejamento");
        planejamento.setDescription("Definir o escopo e o orçamento da reforma.");
        planejamento.setFolder(reformaEscritorio);
        planejamento.setFavorite(true);
        planejamento.setCompleted(false);
        planejamento = taskRepository.save(planejamento);

        TaskEntity levantamento = new TaskEntity();
        levantamento.setTitle("Levantamento de necessidades");
        levantamento.setDescription("Listar tudo que precisa ser reformado.");
        levantamento.setFolder(reformaEscritorio);
        levantamento.setParentTask(planejamento);
        levantamento.setCompleted(false);
        levantamento = taskRepository.save(levantamento);

        TaskEntity orcamento = new TaskEntity();
        orcamento.setTitle("Orçamento");
        orcamento.setDescription("Solicitar orçamentos a fornecedores.");
        orcamento.setFolder(reformaEscritorio);
        orcamento.setParentTask(planejamento);
        orcamento.setCompleted(false);
        orcamento = taskRepository.save(orcamento);

        TaskEntity compras = new TaskEntity();
        compras.setTitle("Compras");
        compras.setDescription("Lista de compras para a reforma.");
        compras.setFolder(reformaEscritorio);
        compras.setFavorite(true);
        compras.setCompleted(false);
        compras = taskRepository.save(compras);

        TaskEntity materiais = new TaskEntity();
        materiais.setTitle("Materiais");
        materiais.setDescription("Comprar materiais de construção.");
        materiais.setFolder(reformaEscritorio);
        materiais.setParentTask(compras);
        materiais.setCompleted(false);
        materiais = taskRepository.save(materiais);

        TaskEntity moveis = new TaskEntity();
        moveis.setTitle("Móveis");
        moveis.setDescription("Comprar móveis novos para o escritório.");
        moveis.setFolder(reformaEscritorio);
        moveis.setParentTask(compras);
        moveis.setCompleted(false);
        moveis = taskRepository.save(moveis);

        TaskEntity execucao = new TaskEntity();
        execucao.setTitle("Execução");
        execucao.setDescription("Acompanhamento da execução da reforma.");
        execucao.setFolder(reformaEscritorio);
        execucao.setCompleted(false);
        execucao = taskRepository.save(execucao);

        TaskEntity pintura = new TaskEntity();
        pintura.setTitle("Pintura");
        pintura.setDescription("Pintar as paredes do escritório.");
        pintura.setFolder(reformaEscritorio);
        pintura.setParentTask(execucao);
        pintura.setCompleted(false);
        pintura = taskRepository.save(pintura);

        TaskEntity eletrica = new TaskEntity();
        eletrica.setTitle("Elétrica");
        eletrica.setDescription("Revisar a parte elétrica.");
        eletrica.setFolder(reformaEscritorio);
        eletrica.setParentTask(execucao);
        eletrica.setCompleted(false);
        eletrica = taskRepository.save(eletrica);

        TaskEntity finalizacao = new TaskEntity();
        finalizacao.setTitle("Finalização");
        finalizacao.setDescription("Verificar se tudo está conforme o planejado.");
        finalizacao.setFolder(reformaEscritorio);
        finalizacao.setCompleted(false);
        finalizacao = taskRepository.save(finalizacao);

        TaskEntity checklist = new TaskEntity();
        checklist.setTitle("Checklist de entrega");
        checklist.setDescription("Conferir todos os itens da reforma.");
        checklist.setFolder(reformaEscritorio);
        checklist.setParentTask(finalizacao);
        checklist.setCompleted(false);
        checklist = taskRepository.save(checklist);

        // Nova pasta de exemplo
        FolderEntity projetoPessoal = new FolderEntity();
        projetoPessoal.setName("Projeto Pessoal");
        projetoPessoal.setOwner(user);
        projetoPessoal = folderRepository.save(projetoPessoal);

        // Task 1
        TaskEntity aprenderSpring = new TaskEntity();
        aprenderSpring.setTitle("Aprender Spring Boot");
        aprenderSpring.setDescription("Estudar o framework Spring Boot para desenvolvimento Java.");
        aprenderSpring.setFolder(projetoPessoal);
        aprenderSpring.setCompleted(false);
        aprenderSpring = taskRepository.save(aprenderSpring);

        // Subtasks para Task 1
        TaskEntity lerDocumentacao = new TaskEntity();
        lerDocumentacao.setTitle("Ler documentação oficial");
        lerDocumentacao.setDescription("Acessar e ler a documentação oficial do Spring Boot.");
        lerDocumentacao.setFolder(projetoPessoal);
        lerDocumentacao.setParentTask(aprenderSpring);
        lerDocumentacao.setCompleted(false);
        lerDocumentacao = taskRepository.save(lerDocumentacao);

        TaskEntity criarProjetoExemplo = new TaskEntity();
        criarProjetoExemplo.setTitle("Criar projeto de exemplo");
        criarProjetoExemplo.setDescription("Criar um projeto simples usando Spring Boot.");
        criarProjetoExemplo.setFolder(projetoPessoal);
        criarProjetoExemplo.setParentTask(aprenderSpring);
        criarProjetoExemplo.setCompleted(false);
        criarProjetoExemplo = taskRepository.save(criarProjetoExemplo);

        // Task 2
        TaskEntity praticarIngles = new TaskEntity();
        praticarIngles.setTitle("Praticar Inglês");
        praticarIngles.setDescription("Dedicar tempo diário para praticar inglês.");
        praticarIngles.setFolder(projetoPessoal);
        praticarIngles.setCompleted(false);
        praticarIngles = taskRepository.save(praticarIngles);

        // Subtasks para Task 2
        TaskEntity assistirVideos = new TaskEntity();
        assistirVideos.setTitle("Assistir vídeos em inglês");
        assistirVideos.setDescription("Assistir vídeos educativos em inglês no YouTube.");
        assistirVideos.setFolder(projetoPessoal);
        assistirVideos.setParentTask(praticarIngles);
        assistirVideos.setCompleted(false);
        assistirVideos = taskRepository.save(assistirVideos);

        TaskEntity fazerExercicios = new TaskEntity();
        fazerExercicios.setTitle("Fazer exercícios de gramática");
        fazerExercicios.setDescription("Realizar exercícios de gramática em aplicativos de idiomas.");
        fazerExercicios.setFolder(projetoPessoal);
        fazerExercicios.setParentTask(praticarIngles);
        fazerExercicios.setCompleted(false);
        fazerExercicios = taskRepository.save(fazerExercicios);
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