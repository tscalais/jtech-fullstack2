package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.dto.FolderRequest;
import br.com.jtech.tasklist.dto.FolderResponse;
import br.com.jtech.tasklist.model.entities.FolderEntity;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.FolderRepository;
import br.com.jtech.tasklist.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FolderServiceTest {
    @Mock
    private FolderRepository folderRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private FolderService folderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
    }

    @Test
    void createFolder_success() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setUserName("user");
        FolderRequest request = new FolderRequest();
        request.setName("folder");
        FolderEntity folder = FolderEntity.builder().id(1L).name("folder").owner(user).build();
        when(userRepository.findByUserName(anyString())).thenReturn(Optional.of(user));
        when(folderRepository.save(any(FolderEntity.class))).thenReturn(folder);
        SecurityContextHolder.getContext().setAuthentication(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("user", null));
        FolderResponse response = folderService.createFolder(request);
        assertNotNull(response);
        assertEquals("folder", response.getName());
    }

    @Test
    void listFolders_success() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setUserName("user");
        FolderEntity folder = FolderEntity.builder().id(1L).name("folder").owner(user).build();
        when(userRepository.findByUserName(anyString())).thenReturn(Optional.of(user));
        when(folderRepository.findByOwner(user)).thenReturn(Collections.singletonList(folder));
        SecurityContextHolder.getContext().setAuthentication(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("user", null));
        assertFalse(folderService.listFolders().isEmpty());
    }

    @Test
    void getFolder_accessDenied() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setUserName("user");
        UserEntity other = new UserEntity();
        other.setId(2L);
        FolderEntity folder = FolderEntity.builder().id(1L).name("folder").owner(other).build();
        when(userRepository.findByUserName(anyString())).thenReturn(Optional.of(user));
        when(folderRepository.findById(1L)).thenReturn(Optional.of(folder));
        SecurityContextHolder.getContext().setAuthentication(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("user", null));
        assertThrows(RuntimeException.class, () -> folderService.getFolder(1L));
    }
}