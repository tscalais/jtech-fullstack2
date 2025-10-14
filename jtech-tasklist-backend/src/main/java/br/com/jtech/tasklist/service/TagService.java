package br.com.jtech.tasklist.service;

import br.com.jtech.tasklist.model.entities.FolderEntity;
import br.com.jtech.tasklist.model.entities.TagEntity;
import br.com.jtech.tasklist.repository.FolderRepository;
import br.com.jtech.tasklist.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {
    private final TagRepository tagRepository;
    private final FolderRepository folderRepository;

    public TagService(TagRepository tagRepository, FolderRepository folderRepository) {
        this.tagRepository = tagRepository;
        this.folderRepository = folderRepository;
    }

    @Transactional(readOnly = true)
    public List<TagEntity> listTagsByFolder(Long folderId) {
        FolderEntity folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        return tagRepository.findByFolder(folder);
    }

    @Transactional
    public TagEntity createTag(Long folderId, String name) {
        FolderEntity folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        TagEntity tag = TagEntity.builder().name(name).folder(folder).build();
        return tagRepository.save(tag);
    }

    @Transactional
    public TagEntity updateTag(Long tagId, String name) {
        TagEntity tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        tag.setName(name);
        return tagRepository.save(tag);
    }

    @Transactional
    public void deleteTag(Long tagId) {
        tagRepository.deleteById(tagId);
    }
}

