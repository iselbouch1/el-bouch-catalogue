package com.elbouch.auto.controller;

import com.elbouch.auto.repository.ProductRepository;
import com.elbouch.auto.util.Mapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PublicController {

    private final ProductRepository productRepository;

    public PublicController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping(value = {"/", "/shop"})
    public String shop(Model model) {
        Sort sort = Sort.by(Sort.Order.asc("sortOrder").nullsLast(), Sort.Order.desc("createdAt"));
        var products = productRepository.findAllWithAll(
            (root, query, cb) -> cb.equal(root.get("isVisible"), true),
            PageRequest.of(0, 50, sort)
        );
        model.addAttribute("products", products.getContent().stream().map(Mapper::toDto).toList());
        return "public/index";
    }
}
