package com.elbouch.auto.util;

import java.text.Normalizer;

public class Slugify {
    public static String slugify(String input) {
        if (input == null) return null;
        String nowhitespace = input.trim().replaceAll("[\\s]+", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("(^-|-$)", "");
        return slug;
    }
}
