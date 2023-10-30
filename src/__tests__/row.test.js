import { test, expect } from "bun:test";
import { render } from "../row.js";

test("should return a function", () => {
  expect(render()).toBeInstanceOf(Function);
});

test("should render make element one cell with \"Hello, World!\" text in it", () => {
  const exampleRow = document.createElement("tr");
  const rowRenderer = render(exampleRow, ["name"]);
  const element = rowRenderer({ name: "Hello, World!" });
  expect(element).toBeInstanceOf(HTMLElement);
  expect(element.innerHTML).toBe("<td>Hello, World!</td>");
});