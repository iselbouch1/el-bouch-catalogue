package com.elbouch.auto.repository;

import com.elbouch.auto.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    @EntityGraph(attributePaths = {"images", "categories", "tags"})
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithAll(@Param("id") UUID id);
    
    @EntityGraph(attributePaths = {"images", "categories", "tags"})
    @Query("SELECT p FROM Product p WHERE p.slug = :slug")
    Optional<Product> findBySlugWithAll(@Param("slug") String slug);
    
    @EntityGraph(attributePaths = {"images", "categories", "tags"})
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);
    
    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
