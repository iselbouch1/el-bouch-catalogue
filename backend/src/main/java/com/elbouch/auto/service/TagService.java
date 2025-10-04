package com.elbouch.auto.service;

import com.elbouch.auto.entity.Tag;
import com.elbouch.auto.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> findAll() { return tagRepository.findAll(); }
    public Optional<Tag> findBySlug(String slug) { return tagRepository.findBySlug(slug); }
    public Tag save(Tag t) { return tagRepository.save(t); }
    public void deleteById(java.util.UUID id) { tagRepository.deleteById(id); }
}
