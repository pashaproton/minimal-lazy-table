import { render as renderCell } from "./cell.js";

export const render = (exampleElement, keys) => data => {
  const element = exampleElement.cloneNode(true);

  keys.forEach(key => {
    element.appendChild(renderCell(data[key]));
    element.removeAttribute("style");
    element.removeAttribute("data-row");
  });

  return element;
};