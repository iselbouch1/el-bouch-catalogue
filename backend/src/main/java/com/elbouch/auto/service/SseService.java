package com.elbouch.auto.service;

import com.elbouch.auto.dto.ProductEventDto;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((ex) -> emitters.remove(emitter));
        emitters.add(emitter);
        return emitter;
    }

    public void broadcast(ProductEventDto event) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("product").data(event));
            } catch (Exception e) {
                try { emitter.completeWithError(e); } catch (Exception ignored) {}
                emitters.remove(emitter);
            }
        }
    }
}
