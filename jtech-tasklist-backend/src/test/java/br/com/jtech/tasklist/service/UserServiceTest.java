package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.UserAlreadyExistsException;
import br.com.jtech.tasklist.dto.UserRequest;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private FolderRepository folderRepository;
    @Mock
    private TaskRepository taskRepository;
    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_success() {
        String name = "user";
        String password = "pass";
        UserEntity user = new UserEntity();
        user.setUserName(name);
        user.setPassword("encoded");
        user.setFullName("Full Name");
        user.setId(UUID.randomUUID());
        when(passwordEncoder.encode(password)).thenReturn("encoded");
        when(userRepository.save(any(UserEntity.class))).thenReturn(user);
        when(folderRepository.save(any())).thenReturn(null);
        when(taskRepository.save(any())).thenReturn(null);
        UserRequest request = new UserRequest(name, password, "Full Name", false);
        UserDTO dto = userService.register(request);
        assertNotNull(dto);
        assertEquals(name, dto.getUserName());
    }

    @Test
    void register_userAlreadyExists() {
        String name = "user";
        String password = "pass";
        when(passwordEncoder.encode(password)).thenReturn("encoded");
        when(userRepository.save(any(UserEntity.class))).thenThrow(DataIntegrityViolationException.class);
        UserRequest request = new UserRequest(name, password, "Full Name", false);
        assertThrows(UserAlreadyExistsException.class, () -> userService.register(request));
    }

    @Test
    void getProfile_found() {
        Long id = 1L;
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setUserName("user");
        user.setFullName("Full Name");
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        Optional<UserDTO> dto = userService.getProfile(id);
        assertTrue(dto.isPresent());
        assertEquals(user.getId().toString(), dto.get().getId());
    }

    @Test
    void getProfile_notFound() {
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());
        Optional<UserDTO> dto = userService.getProfile(id);
        assertFalse(dto.isPresent());
    }
}
