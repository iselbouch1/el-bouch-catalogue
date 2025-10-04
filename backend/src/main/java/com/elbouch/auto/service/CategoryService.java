package com.elbouch.auto.service;

import com.elbouch.auto.entity.Category;
import com.elbouch.auto.repository.CategoryRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Cacheable("categories")
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
}
