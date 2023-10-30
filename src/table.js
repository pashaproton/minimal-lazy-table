import { render as renderRow } from "./row.js";

export const render = tbodyElement => data => {
  const keys = Array.from(document.querySelectorAll("[data-key]")).map(key => key.dataset.key);
  const exampleElement = document.querySelector("[data-row]");
  const rowRenderer = renderRow(exampleElement, keys);
  data.forEach(row => {
    tbodyElement.appendChild(rowRenderer(row));
  });
};
