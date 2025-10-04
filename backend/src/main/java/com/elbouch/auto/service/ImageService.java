package com.elbouch.auto.service;

import com.elbouch.auto.entity.Image;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {
    private final ImageRepository imageRepository;
    private final Path uploadDir;

    public ImageService(ImageRepository imageRepository,
                        @Value("${app.uploads-dir:./uploads}") String uploadsDir) throws IOException {
        this.imageRepository = imageRepository;
        this.uploadDir = Paths.get(uploadsDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    public Image store(Product product, MultipartFile file, boolean cover) throws IOException {
        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : "";
        String filename = UUID.randomUUID() + ext;
        Path target = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), target);
        
        // If setting as cover, unset all other covers for this product
        if (cover) {
            product.getImages().forEach(img -> img.setCover(false));
        }
        
        Image img = new Image();
        img.setProduct(product);
        img.setUrl("/files/" + filename);
        img.setAlt(original != null ? original : "Product image");
        img.setCover(cover);
        return imageRepository.save(img);
    }
}
