package com.elbouch.auto.util;

import com.elbouch.auto.entity.Category;
import com.elbouch.auto.entity.Product;
import com.elbouch.auto.entity.Tag;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> visible(Boolean visible) {
        if (visible == null) return null;
        return (root, query, cb) -> cb.equal(root.get("isVisible"), visible);
    }

    public static Specification<Product> featured(Boolean featured) {
        if (featured == null) return null;
        return (root, query, cb) -> cb.equal(root.get("isFeatured"), featured);
    }

    public static Specification<Product> search(String q) {
        if (q == null || q.isBlank()) return null;
        String like = "%" + q.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("shortDescription")), like),
                cb.like(cb.lower(root.get("description")), like),
                cb.like(cb.lower(root.join("tags").get("name")), like)
        );
    }

    public static Specification<Product> categorySlug(String slug) {
        if (slug == null || slug.isBlank()) return null;
        return (root, query, cb) -> {
            Join<Product, Category> join = root.join("categories");
            return cb.equal(join.get("slug"), slug);
        };
    }

    public static Specification<Product> tagsCsv(String csv) {
        if (csv == null || csv.isBlank()) return null;
        List<String> slugs = List.of(csv.split(","));
        return (root, query, cb) -> {
            query.distinct(true);
            Join<Product, Tag> join = root.join("tags");
            return join.get("slug").in(slugs);
        };
    }
}
