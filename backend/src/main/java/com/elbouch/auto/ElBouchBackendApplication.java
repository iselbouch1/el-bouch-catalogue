package com.elbouch.auto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ElBouchBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ElBouchBackendApplication.class, args);
    }
}
