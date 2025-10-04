package com.elbouch.auto.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "tags", uniqueConstraints = {
        @UniqueConstraint(name = "uk_tag_slug", columnNames = {"slug"})
})
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
}
