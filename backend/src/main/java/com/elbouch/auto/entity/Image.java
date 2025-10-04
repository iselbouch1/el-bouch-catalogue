package com.elbouch.auto.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String url;

    private String alt;

    @Column(nullable = false)
    private boolean isCover = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getAlt() { return alt; }
    public void setAlt(String alt) { this.alt = alt; }
    public boolean isCover() { return isCover; }
    public void setCover(boolean cover) { isCover = cover; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
