import { test as base } from "@playwright/test";

/**
 * Base test fixture that can be extended with custom fixtures
 */
export const test = base.extend({
  // Add custom fixtures here as needed
});

export { expect } from "@playwright/test";
