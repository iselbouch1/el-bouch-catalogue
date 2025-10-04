package com.elbouch.auto.service;

import com.elbouch.auto.entity.Image;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {
    private final ImageRepository imageRepository;
    private final FileStorageService fileStorageService;

    public ImageService(ImageRepository imageRepository, FileStorageService fileStorageService) {
        this.imageRepository = imageRepository;
        this.fileStorageService = fileStorageService;
    }

    public Image store(Product product, MultipartFile file, boolean cover) throws IOException {
        String filename = fileStorageService.save(file);
        
        // If setting as cover, unset all other covers for this product
        if (cover || product.getImages().stream().noneMatch(Image::isCover)) {
            product.getImages().forEach(img -> img.setCover(false));
            cover = true;
        }
        
        Image img = new Image();
        img.setProduct(product);
        img.setUrl("/uploads/" + filename);
        img.setAlt(file.getOriginalFilename() != null ? file.getOriginalFilename() : "Product image");
        img.setCover(cover);
        return imageRepository.save(img);
    }

    public void deleteImage(Image image) {
        String url = image.getUrl();
        if (url != null && url.startsWith("/uploads/")) {
            String filename = url.substring("/uploads/".length());
            fileStorageService.delete(filename);
        }
        imageRepository.delete(image);
    }
}

