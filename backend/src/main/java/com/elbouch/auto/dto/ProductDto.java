package com.elbouch.auto.dto;

import java.util.List;
import java.util.Map;

public record ProductDto(
        String id,
        String name,
        String slug,
        String shortDescription,
        String description,
        List<String> categoryIds,
        List<String> tags,
        Boolean isVisible,
        Boolean isFeatured,
        Integer sortOrder,
        List<ImageDto> images,
        Map<String, Object> specs
) {}
