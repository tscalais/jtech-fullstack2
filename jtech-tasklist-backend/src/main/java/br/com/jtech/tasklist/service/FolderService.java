package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.dto.FolderRequest;
import br.com.jtech.tasklist.dto.FolderResponse;
import br.com.jtech.tasklist.model.Folder;
import br.com.jtech.tasklist.model.entities.UserEntity;
import br.com.jtech.tasklist.repository.FolderRepository;
import br.com.jtech.tasklist.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FolderService {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderService(FolderRepository folderRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    private UserEntity getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public FolderResponse createFolder(FolderRequest request) {
        UserEntity owner = getAuthenticatedUser();
        Folder folder = Folder.builder()
                .name(request.getName())
                .owner(owner)
                .build();
        folder = folderRepository.save(folder);
        return toResponse(folder);
    }

    public List<FolderResponse> listFolders() {
        UserEntity owner = getAuthenticatedUser();
        return folderRepository.findByOwner(owner).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public FolderResponse getFolder(Long id) {
        UserEntity owner = getAuthenticatedUser();
        Folder folder = folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
        if (!folder.getOwner().getId().toString().equals(owner.getId().toString())) {
            throw new RuntimeException("Access denied");
        }
        return toResponse(folder);
    }

    @Transactional
    public FolderResponse updateFolder(Long id, FolderRequest request) {
        UserEntity owner = getAuthenticatedUser();
        Folder folder = folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
        if (!folder.getOwner().getId().toString().equals(owner.getId().toString())) {
            throw new RuntimeException("Access denied");
        }
        folder.setName(request.getName());
        return toResponse(folder);
    }

    public void deleteFolder(Long id) {
        UserEntity owner = getAuthenticatedUser();
        Folder folder = folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
        if (!folder.getOwner().getId().toString().equals(owner.getId().toString())) {
            throw new RuntimeException("Access denied");
        }
        folderRepository.delete(folder);
    }

    private FolderResponse toResponse(Folder folder) {
        FolderResponse response = new FolderResponse();
        response.setId(folder.getId());
        response.setName(folder.getName());
        response.setOwnerId(folder.getOwner().getId().toString());
        response.setOwnerUsername(folder.getOwner().getUserName());
        response.setCreatedAt(folder.getCreatedAt() != null ? folder.getCreatedAt().toString() : null);
        response.setUpdatedAt(folder.getUpdatedAt() != null ? folder.getUpdatedAt().toString() : null);
        return response;
    }
}
