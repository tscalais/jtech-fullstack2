package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.dto.FolderRequest;
import br.com.jtech.tasklist.dto.FolderResponse;
import br.com.jtech.tasklist.service.FolderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folders")
public class FolderController {
    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @PostMapping
    public ResponseEntity<FolderResponse> create(@RequestBody FolderRequest request) {
        return ResponseEntity.ok(folderService.createFolder(request));
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> list() {
        return ResponseEntity.ok(folderService.listFolders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FolderResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(folderService.getFolder(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> update(@PathVariable Long id, @RequestBody FolderRequest request) {
        return ResponseEntity.ok(folderService.updateFolder(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }
}
