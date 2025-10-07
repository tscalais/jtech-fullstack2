
package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.config.infra.exceptions.UserAlreadyExistsException;
import br.com.jtech.tasklist.model.UserDTO;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
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
        when(passwordEncoder.encode(password)).thenReturn("encoded");
        when(userRepository.save(any(UserEntity.class))).thenReturn(user);

        UserDTO dto = userService.register(name, password);
        assertNotNull(dto);
        assertEquals(name, dto.getUserName());
    }

    @Test
    void register_userAlreadyExists() {
        String name = "user";
        String password = "pass";
        when(passwordEncoder.encode(password)).thenReturn("encoded");
        when(userRepository.save(any(UserEntity.class))).thenThrow(DataIntegrityViolationException.class);
        assertThrows(UserAlreadyExistsException.class, () -> userService.register(name, password));
    }

    @Test
    void getProfile_found() {
        Long id = 1L;
        UserEntity user = new UserEntity();
        user.setId(id);
        user.setUserName("user");
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        Optional<UserDTO> dto = userService.getProfile(id);
        assertTrue(dto.isPresent());
        assertEquals(id, dto.get().getId());
    }

    @Test
    void getProfile_notFound() {
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());
        Optional<UserDTO> dto = userService.getProfile(id);
        assertFalse(dto.isPresent());
    }
}

