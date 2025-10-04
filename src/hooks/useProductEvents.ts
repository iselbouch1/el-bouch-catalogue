import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

interface ProductEvent {
  type: "product.created" | "product.updated" | "product.deleted" | "image.updated";
  productId: string;
  slug: string;
  timestamp: number;
}

/**
 * Hook to listen for real-time product updates via SSE
 * Automatically invalidates React Query cache when products change
 */
export function useProductEvents() {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Don't connect SSE in mock mode
    if (USE_MOCK) {
      return;
    }

    // Create SSE connection
    const eventSource = new EventSource(`${API_BASE_URL}/api/v1/events/products`);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("product", (e) => {
      try {
        const event = JSON.parse(e.data) as ProductEvent;
        console.log("[SSE] Product event received:", event);

        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product", event.slug] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      } catch (error) {
        console.error("[SSE] Failed to parse event:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("[SSE] Connection error:", error);
      // Auto-reconnect is handled by EventSource
    };

    eventSource.onopen = () => {
      console.log("[SSE] Connected to product events");
    };

    // Cleanup on unmount
    return () => {
      console.log("[SSE] Closing connection");
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [queryClient]);

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
  };
}
