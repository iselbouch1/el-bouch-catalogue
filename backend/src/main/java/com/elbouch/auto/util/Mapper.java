package com.elbouch.auto.util;

import com.elbouch.auto.dto.CategoryDto;
import com.elbouch.auto.dto.ImageDto;
import com.elbouch.auto.dto.ProductDto;
import com.elbouch.auto.entity.Category;
import com.elbouch.auto.entity.Image;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.entity.Tag;

import java.util.*;
import java.util.stream.Collectors;

public class Mapper {

    public static CategoryDto toDto(Category c) {
        return new CategoryDto(
                c.getId().toString(),
                c.getName(),
                c.getSlug(),
                c.getParentId() == null ? null : c.getParentId().toString()
        );
    }

    public static ProductDto toDto(Product p) {
        List<String> categoryIds = p.getCategories().stream()
                .map(cat -> cat.getId().toString())
                .toList();
        List<String> tags = p.getTags().stream()
                .map(Tag::getSlug)
                .toList();
        List<ImageDto> images = p.getImages().stream()
                .sorted((a,b) -> Boolean.compare(b.isCover(), a.isCover()))
                .map(img -> new ImageDto(img.getUrl(), img.getAlt(), img.isCover()))
                .toList();
        return new ProductDto(
                p.getId().toString(),
                p.getName(),
                p.getSlug(),
                p.getShortDescription(),
                p.getDescription(),
                categoryIds,
                tags,
                p.isVisible(),
                p.getFeatured(),
                p.getSortOrder(),
                images,
                JsonUtils.toMap(p.getSpecsJson())
        );
    }

    public static void applyDtoToEntity(ProductDto dto, Product p,
                                        Map<UUID, Category> categoryMap,
                                        Map<String, Tag> tagBySlug) {
        p.setName(dto.name());
        p.setSlug(Slugify.slugify(dto.slug() != null && !dto.slug().isBlank() ? dto.slug() : dto.name()));
        p.setShortDescription(dto.shortDescription());
        p.setDescription(dto.description());
        p.setVisible(Boolean.TRUE.equals(dto.isVisible()));
        p.setFeatured(dto.isFeatured());
        p.setSortOrder(dto.sortOrder());
        p.setSpecsJson(JsonUtils.toJson(dto.specs()));

        // categories
        Set<Category> cats = new HashSet<>();
        if (dto.categoryIds() != null) {
            for (String idStr : dto.categoryIds()) {
                try {
                    UUID id = UUID.fromString(idStr);
                    Category c = categoryMap.get(id);
                    if (c != null) cats.add(c);
                } catch (Exception ignored) {}
            }
        }
        p.setCategories(cats);

        // tags by slug
        Set<Tag> tags = new HashSet<>();
        if (dto.tags() != null) {
            for (String slug : dto.tags()) {
                Tag t = tagBySlug.get(slug);
                if (t != null) tags.add(t);
            }
        }
        p.setTags(tags);

        // images handled elsewhere (upload endpoints) or full replace here if provided
        if (dto.images() != null && !dto.images().isEmpty()) {
            p.getImages().clear();
            boolean hasCover = false;
            for (ImageDto i : dto.images()) {
                Image img = new Image();
                img.setProduct(p);
                img.setUrl(i.url());
                img.setAlt(i.alt());
                boolean cover = Boolean.TRUE.equals(i.isCover());
                if (cover) hasCover = true;
                img.setCover(cover);
                p.getImages().add(img);
            }
            if (!hasCover && !p.getImages().isEmpty()) {
                p.getImages().get(0).setCover(true);
            }
        }
    }
}
