import { test, expect } from "bun:test";
import * as utils from "../utils";

test("isLimitReached returns true when current is greater than or equal to total", () => {
  expect(utils.isLimitReached(11, 10)).toBe(true);
});

test("isLimitReached returns false when current is less than total", () => {
  expect(utils.isLimitReached(9, 10)).toBe(false);
});

test("generateUrl returns a URL with the correct query params", () => {
  const url = utils.generateUrl("https://example.com", 10, "offset", 2);
  expect(url.toString()).toBe("https://example.com/?limit=10&offset=20");
});