package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.dto.FolderRequest;
import br.com.jtech.tasklist.dto.FolderResponse;
import br.com.jtech.tasklist.model.entities.FolderEntity;
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
        FolderEntity folderEntity = FolderEntity.builder()
                .name(request.getName())
                .owner(owner)
                .build();
        folderEntity = folderRepository.save(folderEntity);
        return toResponse(folderEntity);
    }

    public List<FolderResponse> listFolders() {
        UserEntity owner = getAuthenticatedUser();
        return folderRepository.findByOwner(owner).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public FolderResponse getFolder(Long id) {
        UserEntity owner = getAuthenticatedUser();
        FolderEntity folderEntity = folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
        if (!folderEntity.getOwner().getId().toString().equals(owner.getId().toString())) {
            throw new RuntimeException("Access denied");
        }
        return toResponse(folderEntity);
    }

    @Transactional
    public FolderResponse updateFolder(Long id, FolderRequest request) {
        UserEntity owner = getAuthenticatedUser();
        FolderEntity folderEntity = folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
        if (!folderEntity.getOwner().getId().toString().equals(owner.getId().toString())) {
            throw new RuntimeException("Access denied");
        }
        folderEntity.setName(request.getName());
        return toResponse(folderEntity);
    }

    public void deleteFolder(Long id) {
        UserEntity owner = getAuthenticatedUser();
        FolderEntity folderEntity = folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
        if (!folderEntity.getOwner().getId().toString().equals(owner.getId().toString())) {
            throw new RuntimeException("Access denied");
        }
        folderRepository.delete(folderEntity);
    }

    public FolderEntity getFolderEntity(Long id) {
        return folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
    }

    public void validateOwner(Long folderId) {
        UserEntity owner = getAuthenticatedUser();
        FolderEntity folderEntity = getFolderEntity(folderId);
        if (!folderEntity.getOwner().getId().equals(owner.getId())) {
            throw new br.com.jtech.tasklist.config.infra.exceptions.FolderAccessDeniedException("Access denied to folder " + folderId);
        }
    }

    private FolderResponse toResponse(FolderEntity folderEntity) {
        FolderResponse response = new FolderResponse();
        response.setId(folderEntity.getId());
        response.setName(folderEntity.getName());
        response.setOwnerId(folderEntity.getOwner().getId().toString());
        response.setOwnerUsername(folderEntity.getOwner().getUserName());
        response.setCreatedAt(folderEntity.getCreatedAt() != null ? folderEntity.getCreatedAt().toString() : null);
        response.setUpdatedAt(folderEntity.getUpdatedAt() != null ? folderEntity.getUpdatedAt().toString() : null);
        return response;
    }
}
