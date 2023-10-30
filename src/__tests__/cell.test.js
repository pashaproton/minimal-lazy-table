import { render } from "../cell.js";
import { expect, test } from "bun:test";

test("should render make element with \"Hello, World!\" text", () => {
  const element = render("Hello, World!");
  expect(element).toBeInstanceOf(HTMLElement);
  expect(element.innerHTML).toBe("Hello, World!");
});