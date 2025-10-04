package com.elbouch.auto.dto;

public record CategoryDto(
        String id,
        String name,
        String slug,
        String parentId
) {}
