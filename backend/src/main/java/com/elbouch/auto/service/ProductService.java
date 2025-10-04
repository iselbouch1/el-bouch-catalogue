package com.elbouch.auto.service;

import com.elbouch.auto.dto.ProductDto;
import com.elbouch.auto.dto.ProductEventDto;
import com.elbouch.auto.entity.Category;
import com.elbouch.auto.entity.Image;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.entity.Tag;
import com.elbouch.auto.repository.CategoryRepository;
import com.elbouch.auto.repository.ProductRepository;
import com.elbouch.auto.repository.TagRepository;
import com.elbouch.auto.util.Mapper;
import com.elbouch.auto.util.ProductSpecifications;
import com.elbouch.auto.util.Slugify;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final SseService sseService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, TagRepository tagRepository, SseService sseService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.sseService = sseService;
    }

    @Transactional(readOnly = true)
    public Page<Product> search(String search, String categorySlug, String tagsCsv, Boolean visible, Boolean featured, int page, int perPage) {
        Specification<Product> spec = Specification.<Product>where(null)
                .and(ProductSpecifications.search(search))
                .and(ProductSpecifications.categorySlug(categorySlug))
                .and(ProductSpecifications.tagsCsv(tagsCsv))
                .and(ProductSpecifications.visible(visible))
                .and(ProductSpecifications.featured(featured));
        Sort sort = Sort.by(Sort.Order.asc("sortOrder").nullsLast(), Sort.Order.desc("createdAt"));
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.min(perPage, 50), sort);
        return productRepository.findAll(spec, pageable);
    }

    @Cacheable(value = "productBySlug", key = "#slug")
    @Transactional(readOnly = true)
    public Optional<Product> findBySlug(String slug) {
        return productRepository.findBySlugWithAll(slug);
    }

    @Transactional(readOnly = true)
    public List<Product> related(Product ref, int limit) {
        Set<String> tagSlugs = ref.getTags().stream().map(Tag::getSlug).collect(Collectors.toSet());
        Set<String> catSlugs = ref.getCategories().stream().map(Category::getSlug).collect(Collectors.toSet());
        Specification<Product> spec = Specification.where(ProductSpecifications.tagsCsv(String.join(",", tagSlugs)))
                .or(ProductSpecifications.categorySlug(catSlugs.stream().findFirst().orElse(null)))
                .and((root, query, cb) -> cb.notEqual(root.get("id"), ref.getId()));
        Page<Product> page = productRepository.findAll(spec, PageRequest.of(0, limit));
        return page.getContent();
    }

    @Transactional
    @CacheEvict(value = {"productBySlug", "categories"}, allEntries = true)
    public Product create(ProductDto dto) {
        Product p = new Product();
        apply(dto, p);
        ensureSingleCover(p);
        p = productRepository.save(p);
        try {
            sseService.broadcast(new ProductEventDto("product.created", p.getId().toString(), p.getSlug(), System.currentTimeMillis()));
        } catch (Exception ignored) {}

        return p;
    }
    
    @Transactional
    @CacheEvict(value = {"productBySlug", "categories"}, allEntries = true)
    public void broadcastImageUpdate(UUID productId) {
        productRepository.findById(productId).ifPresent(p -> {
            try {
                sseService.broadcast(new ProductEventDto("image.updated", p.getId().toString(), p.getSlug(), System.currentTimeMillis()));
            } catch (Exception ignored) {}

        });
    }

    @Transactional
    @CacheEvict(value = {"productBySlug", "categories"}, allEntries = true)
    public Product update(UUID id, ProductDto dto) {
        Product p = productRepository.findByIdWithAll(id).orElseThrow();
        apply(dto, p);
        ensureSingleCover(p);
        p = productRepository.save(p);
        try {
            sseService.broadcast(new ProductEventDto("product.updated", p.getId().toString(), p.getSlug(), System.currentTimeMillis()));
        } catch (Exception ignored) {}

        return p;
    }

    @Transactional
    @CacheEvict(value = {"productBySlug", "categories"}, allEntries = true)
    public void delete(UUID id) {
        productRepository.findById(id).ifPresent(p -> {
            productRepository.delete(p);
            try {
                sseService.broadcast(new ProductEventDto("product.deleted", p.getId().toString(), p.getSlug(), System.currentTimeMillis()));
            } catch (Exception ignored) {}

        });
    }

    private void apply(ProductDto dto, Product p) {
        // build helper maps
        Map<UUID, Category> catMap = categoryRepository.findAll().stream().collect(Collectors.toMap(Category::getId, c -> c));
        Map<String, Tag> tagBySlug = tagRepository.findAll().stream().collect(Collectors.toMap(Tag::getSlug, t -> t));

        // generate unique slug if needed
        String baseSlug = Slugify.slugify(dto.slug() != null && !dto.slug().isBlank() ? dto.slug() : dto.name());
        String uniqueSlug = baseSlug;
        int i = 1;
        while (p.getId() == null && productRepository.existsBySlug(uniqueSlug)) {
            uniqueSlug = baseSlug + "-" + (i++);
        }
        ProductDto withSlug = new ProductDto(
                dto.id(), dto.name(), uniqueSlug, dto.shortDescription(), dto.description(),
                dto.categoryIds(), dto.tags(), dto.isVisible(), dto.isFeatured(), dto.sortOrder(), dto.images(), dto.specs()
        );
        Mapper.applyDtoToEntity(withSlug, p, catMap, tagBySlug);
    }

    private void ensureSingleCover(Product p) {
        boolean hasCover = false;
        for (Image img : p.getImages()) {
            if (img.isCover()) {
                if (!hasCover) {
                    hasCover = true;
                } else {
                    img.setCover(false);
                }
            }
        }
        if (!hasCover && !p.getImages().isEmpty()) {
            p.getImages().get(0).setCover(true);
        }
    }
}
