package com.elbouch.auto.controller;

import com.elbouch.auto.dto.ProductDto;
import com.elbouch.auto.entity.Category;
import com.elbouch.auto.entity.Image;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.entity.Tag;
import com.elbouch.auto.repository.CategoryRepository;
import com.elbouch.auto.repository.ImageRepository;
import com.elbouch.auto.repository.ProductRepository;
import com.elbouch.auto.repository.TagRepository;
import com.elbouch.auto.service.ImageService;
import com.elbouch.auto.service.ProductService;
import com.elbouch.auto.util.Mapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ProductService productService;
    private final ImageService imageService;
    private final ImageRepository imageRepository;

    public AdminController(ProductRepository productRepository, CategoryRepository categoryRepository, TagRepository tagRepository, ProductService productService, ImageService imageService, ImageRepository imageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.productService = productService;
        this.imageService = imageService;
        this.imageRepository = imageRepository;
    }

    @GetMapping
    public String dashboard(Model model) {
        model.addAttribute("productsCount", productRepository.count());
        model.addAttribute("categoriesCount", categoryRepository.count());
        model.addAttribute("tagsCount", tagRepository.count());
        return "admin/dashboard";
    }

    // Products
    @GetMapping("/products")
    public String products(Model model) {
        model.addAttribute("products", productRepository.findAll());
        return "admin/products/list";
    }

    @GetMapping("/products/new")
    public String newProduct(Model model) {
        model.addAttribute("dto", new ProductDto(null, null, null, null, null, List.of(), List.of(), true, false, 0, List.of(), Map.of()));
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("tags", tagRepository.findAll());
        return "admin/products/form";
    }

    @PostMapping("/products")
    public String createProduct(@ModelAttribute("dto") ProductDto dto, BindingResult br) {
        if (br.hasErrors()) return "admin/products/form";
        Product p = productService.create(dto);
        return "redirect:/admin/products";
    }

    @GetMapping("/products/{id}/edit")
    public String editProduct(@PathVariable UUID id, Model model) {
        Product p = productRepository.findById(id).orElseThrow();
        model.addAttribute("dto", Mapper.toDto(p));
        model.addAttribute("product", p);
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("tags", tagRepository.findAll());
        return "admin/products/form";
    }

    @PostMapping("/products/{id}")
    public String updateProduct(@PathVariable UUID id, @ModelAttribute("dto") ProductDto dto, BindingResult br) {
        if (br.hasErrors()) return "admin/products/form";
        productService.update(id, dto);
        return "redirect:/admin/products";
    }

    @PostMapping("/products/{id}/delete")
    public String deleteProduct(@PathVariable UUID id) {
        productService.delete(id);
        return "redirect:/admin/products";
    }

    @PostMapping("/products/{id}/images")
    public String uploadImage(@PathVariable UUID id, @RequestParam("file") MultipartFile file, @RequestParam(name = "cover", defaultValue = "false") boolean cover) throws IOException {
        Product p = productRepository.findById(id).orElseThrow();
        imageService.store(p, file, cover);
        return "redirect:/admin/products/" + id + "/edit";
    }

    @PostMapping("/products/{id}/images/{imageId}/cover")
    public String setCover(@PathVariable UUID id, @PathVariable UUID imageId) {
        Product p = productRepository.findById(id).orElseThrow();
        for (Image img : p.getImages()) { img.setCover(img.getId().equals(imageId)); }
        productRepository.save(p);
        productService.broadcastImageUpdate(id);
        return "redirect:/admin/products/" + id + "/edit";
    }

    @PostMapping("/products/{id}/images/{imageId}/delete")
    public String deleteImage(@PathVariable UUID id, @PathVariable UUID imageId) {
        imageRepository.deleteById(imageId);
        productService.broadcastImageUpdate(id);
        return "redirect:/admin/products/" + id + "/edit";
    }

    // Categories
    @GetMapping("/categories")
    public String categories(Model model) {
        model.addAttribute("categories", categoryRepository.findAll());
        return "admin/categories/list";
    }

    @GetMapping("/categories/new")
    public String newCategory(Model model) {
        model.addAttribute("category", new Category());
        return "admin/categories/form";
    }

    @PostMapping("/categories")
    public String createCategory(@ModelAttribute Category category) {
        categoryRepository.save(category);
        return "redirect:/admin/categories";
    }

    @GetMapping("/categories/{id}/edit")
    public String editCategory(@PathVariable UUID id, Model model) {
        model.addAttribute("category", categoryRepository.findById(id).orElseThrow());
        return "admin/categories/form";
    }

    @PostMapping("/categories/{id}")
    public String updateCategory(@PathVariable UUID id, @ModelAttribute Category category) {
        category.setId(id);
        categoryRepository.save(category);
        return "redirect:/admin/categories";
    }

    @PostMapping("/categories/{id}/delete")
    public String deleteCategory(@PathVariable UUID id) {
        categoryRepository.deleteById(id);
        return "redirect:/admin/categories";
    }

    // Tags
    @GetMapping("/tags")
    public String tags(Model model) {
        model.addAttribute("tags", tagRepository.findAll());
        return "admin/tags/list";
    }

    @GetMapping("/tags/new")
    public String newTag(Model model) {
        model.addAttribute("tag", new Tag());
        return "admin/tags/form";
    }

    @PostMapping("/tags")
    public String createTag(@ModelAttribute Tag tag) {
        tagRepository.save(tag);
        return "redirect:/admin/tags";
    }

    @GetMapping("/tags/{id}/edit")
    public String editTag(@PathVariable UUID id, Model model) {
        model.addAttribute("tag", tagRepository.findById(id).orElseThrow());
        return "admin/tags/form";
    }

    @PostMapping("/tags/{id}")
    public String updateTag(@PathVariable UUID id, @ModelAttribute Tag tag) {
        tag.setId(id);
        tagRepository.save(tag);
        return "redirect:/admin/tags";
    }

    @PostMapping("/tags/{id}/delete")
    public String deleteTag(@PathVariable UUID id) {
        tagRepository.deleteById(id);
        return "redirect:/admin/tags";
    }
}
