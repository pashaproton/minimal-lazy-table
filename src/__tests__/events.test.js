import { test, expect, mock } from "bun:test";
import { createObserver } from "../events";

window.IntersectionObserver = mock(() => class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { }
  unobserve() { }
  disconnect() { }
});

test("should create an instance of IntersectionObserver", () => {
  const observer = createObserver(() => { });
  expect(observer.toString()).toBe((new window.IntersectionObserver(() => { })).toString());
});