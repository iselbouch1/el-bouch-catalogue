package com.elbouch.auto.controller;

import com.elbouch.auto.dto.*;
import com.elbouch.auto.entity.Category;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.service.CategoryService;
import com.elbouch.auto.service.ProductService;
import com.elbouch.auto.service.SseService;
import com.elbouch.auto.util.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class PublicApiController {

    private final CategoryService categoryService;
    private final ProductService productService;
    private final SseService sseService;

    public PublicApiController(CategoryService categoryService, ProductService productService, SseService sseService) {
        this.categoryService = categoryService;
        this.productService = productService;
        this.sseService = sseService;
    }

    @GetMapping("/categories")
    public List<CategoryDto> categories() {
        return categoryService.findAll().stream().map(Mapper::toDto).toList();
    }

    @GetMapping("/products")
    public PagedResponse<ProductDto> products(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) Integer visible,
            @RequestParam(required = false) Integer featured,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(name = "per_page", defaultValue = "12") int perPage
    ) {
        Boolean vis = visible == null ? null : visible == 1;
        Boolean feat = featured == null ? null : featured == 1;
        Page<Product> result = productService.search(search, category, tags, vis, feat, page, perPage);
        List<ProductDto> data = result.getContent().stream().map(Mapper::toDto).toList();
        Map<String, Object> meta = Map.of(
                "page", page,
                "perPage", perPage,
                "total", result.getTotalElements()
        );
        return new PagedResponse<>(data, meta);
    }

    @GetMapping("/products/{slug}")
    public ProductDto product(@PathVariable String slug) {
        Product p = productService.findBySlug(slug).orElseThrow();
        return Mapper.toDto(p);
    }

    @GetMapping("/products/{slug}/related")
    public List<ProductDto> related(@PathVariable String slug) {
        Product p = productService.findBySlug(slug).orElseThrow();
        return productService.related(p, 8).stream().map(Mapper::toDto).toList();
    }

    @GetMapping(path = "/events/products", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter events() {
        return sseService.subscribe();
    }

    // Secured endpoints for write operations (admin authenticated via Spring Security)
    @PostMapping("/products")
    public ProductDto create(@RequestBody ProductDto dto) {
        Product saved = productService.create(dto);
        return Mapper.toDto(saved);
    }

    @PutMapping("/products/{id}")
    public ProductDto update(@PathVariable UUID id, @RequestBody ProductDto dto) {
        Product saved = productService.update(id, dto);
        return Mapper.toDto(saved);
    }

    @DeleteMapping("/products/{id}")
    public void delete(@PathVariable UUID id) {
        productService.delete(id);
    }
}
