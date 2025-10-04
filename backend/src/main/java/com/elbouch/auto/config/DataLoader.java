package com.elbouch.auto.config;

import com.elbouch.auto.entity.*;
import com.elbouch.auto.repository.*;
import com.elbouch.auto.util.Slugify;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Component
@Profile("!prod")
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ProductRepository productRepository;

    @Value("${app.uploads-dir:./uploads}")
    private String uploadsDir;

    public DataLoader(CategoryRepository categoryRepository, TagRepository tagRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // ensure uploads dir and copy sample svg files if empty
        Path uploadPath = Paths.get(uploadsDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath)) {
            if (!stream.iterator().hasNext()) {
                copySample("sample-1.svg", uploadPath);
                copySample("sample-2.svg", uploadPath);
            }
        }

        if (categoryRepository.count() == 0) seed();
    }

    private void copySample(String name, Path uploadPath) {
        try {
            Path classpath = Paths.get("src/main/resources/uploads/" + name);
            if (Files.exists(classpath)) {
                Files.copy(classpath, uploadPath.resolve(name), StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ignored) {}
    }

    private void seed() {
        // Categories
        String[] cats = {"Éclairage", "Jantes & Enjoliveurs", "Sièges & Housses", "Volants & Commandes", "Carrosserie & Stickers", "Intérieur & Rangement"};
        List<Category> categories = new ArrayList<>();
        for (String c : cats) {
            Category cat = new Category();
            cat.setName(c);
            cat.setSlug(Slugify.slugify(c));
            categories.add(categoryRepository.save(cat));
        }

        // Tags
        String[] tags = {"noir-mat", "cuir", "chrome", "led", "sport", "carbone"};
        List<Tag> tagEntities = new ArrayList<>();
        for (String t : tags) {
            Tag tag = new Tag();
            tag.setName(t);
            tag.setSlug(Slugify.slugify(t));
            tagEntities.add(tagRepository.save(tag));
        }

        // Products (create ~20)
        for (int i = 1; i <= 20; i++) {
            Product p = new Product();
            p.setName("Produit " + i + " sport");
            p.setSlug(Slugify.slugify(p.getName() + "-" + i));
            p.setShortDescription("Accessoire automobile haut de gamme " + i);
            p.setDescription("Description détaillée du produit " + i + ".");
            p.setVisible(true);
            p.setFeatured(i % 5 == 0);
            p.setSortOrder(i);
            p.setSpecsJson("{\"matiere\":\"cuir\",\"couleur\":\"noir\",\"poids\":