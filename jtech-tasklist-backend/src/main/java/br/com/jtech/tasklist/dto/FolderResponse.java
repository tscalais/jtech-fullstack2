package br.com.jtech.tasklist.dto;

import lombok.Data;

@Data
public class FolderResponse {
    private Long id;
    private String name;
    private String ownerId;
    private String ownerUsername;
    private String createdAt;
    private String updatedAt;
}
