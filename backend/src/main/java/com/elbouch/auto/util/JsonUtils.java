package com.elbouch.auto.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.Map;

public class JsonUtils {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static String toJson(Map<String, Object> map) {
        try {
            return map == null ? null : MAPPER.writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JSON map", e);
        }
    }

    public static Map<String, Object> toMap(String json) {
        try {
            if (json == null || json.isBlank()) return Collections.emptyMap();
            return MAPPER.readValue(json, new TypeReference<Map<String, Object>>(){});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}
