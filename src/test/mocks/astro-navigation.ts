import { vi } from "vitest";

/**
 * Mock implementation of astro:transitions/client navigate function
 */
export const mockNavigate = vi.fn();

/**
 * Default export for module resolution
 */
export const navigate = mockNavigate;
