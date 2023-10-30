import * as utils from "./utils.js";
import * as events from "./events.js";
import { fetchData } from "./fetch.js";
import { render as renderTable } from "./table.js";

const makeTableLazy = table => {
  let responseTotal = table.dataset.responseTotal;
  const {
    limit,
    endpoint,
    offsetKey,
    responseSource,
  } = table.dataset;

  if (!endpoint) {
    throw new Error("Please add data-endpoint attribute to your table");
  }

  let page = 0;
  const loaderElement = table.querySelector("[data-loader]");
  const tableRenderer = renderTable(table.querySelector("tbody"));

  const observer = events.createObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchData(utils.generateUrl(endpoint, limit, offsetKey, page++)).then(response => {
          tableRenderer(responseSource ? response[responseSource] : response);

          if (isNaN(responseTotal)) {
            responseTotal = response[responseTotal];
          }

          if (utils.isLimitReached(Array.from(table.querySelectorAll("tbody tr:not([data-row])")).length, responseTotal)) {
            observer.unobserve(loaderElement);
            loaderElement.style.display = "none";
          }
        });
      }
    });
  });

  observer.observe(loaderElement);
}

document.addEventListener("DOMContentLoaded", () => {
  const tables = document.querySelectorAll(".lazy-table");
  tables.forEach(makeTableLazy);
});