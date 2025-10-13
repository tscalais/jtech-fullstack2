package br.com.jtech.tasklist.controller;

import br.com.jtech.tasklist.model.entities.TagEntity;
import br.com.jtech.tasklist.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/folders/{folderId}/tags")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagEntity>> list(@PathVariable Long folderId) {
        return ResponseEntity.ok(tagService.listTagsByFolder(folderId));
    }

    @PostMapping
    public ResponseEntity<TagEntity> create(@PathVariable Long folderId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tagService.createTag(folderId, body.get("name")));
    }

    @PutMapping("/{tagId}")
    public ResponseEntity<TagEntity> update(@PathVariable Long tagId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tagService.updateTag(tagId, body.get("name")));
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<Void> delete(@PathVariable Long tagId) {
        tagService.deleteTag(tagId);
        return ResponseEntity.noContent().build();
    }
}
