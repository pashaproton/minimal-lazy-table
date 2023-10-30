import { test, expect, mock } from "bun:test";
import { fetchData } from "../fetch";

window.fetch = async () => ({
  json: async () => "peanut butter",
});

test("fetchData returns data", async () => {
  const data = await fetchData();
  expect(data).toBe("peanut butter");
});