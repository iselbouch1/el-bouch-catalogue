package com.elbouch.auto.dto;

import java.util.List;
import java.util.Map;

public record PagedResponse<T>(
        List<T> data,
        Map<String, Object> meta
) {}
