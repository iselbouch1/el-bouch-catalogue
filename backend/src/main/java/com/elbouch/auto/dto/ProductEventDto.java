package com.elbouch.auto.dto;

public record ProductEventDto(
        String type,
        String id,
        String slug,
        long timestamp
) {}
