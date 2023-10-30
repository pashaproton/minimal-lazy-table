class LazyTableCell {
  #data = null;

  constructor(data) {
    this.#data = data;
    return this.#render();
  }

  #render = () => {
    const element = document.createElement('td');
    element.innerHTML = this.#data;
    return element;
  }
}

class LazyTableRow {
  #data = null;
  #keys = [];

  constructor(data) {
    this.#data = data;
    this.#keys = Array.from(document.querySelectorAll('[data-key]')).map(key => key.dataset.key);
    return this.#render();
  }

  #render = () => {
    const element = document.querySelector('[data-row]').cloneNode(true);

    this.#keys.forEach(key => {
      const cell = new LazyTableCell(this.#data[key]);
      element.appendChild(cell);
      element.removeAttribute('style');
      element.removeAttribute('data-row');
    });

    return element;
  }
}

class LazyTable {
  #data = [];
  #page = 0;
  #rows = [];
  #body = null;
  #limit = null;
  #endpoint = null;
  #offsetKey = null;
  #responseTotal = null;
  #responseSource = null;

  #observer = null;

  #loaderElement = null;

  constructor(table) {
    this.#body = table.querySelector("tbody") || table;

    if (!table.dataset.endpoint) {
      throw new Error("Please add data-endpoint attribute to your table");
    }
    this.#endpoint = table.dataset.endpoint;

    this.#limit = table.dataset.limit;
    this.#offsetKey = table.dataset.offsetKey;

    if (this.#limit && !this.#offsetKey) {
      this.#offsetKey = 'offset';
    }

    table.querySelector('[data-row]').style.display = 'none';
    this.#loaderElement = table.querySelector('[data-loader]');
    this.#loaderElement.style.display = 'none';

    this.#responseTotal = table.dataset.responseTotal;
    this.#responseSource = table.dataset.responseSource;

    this.#fetchData()
      .then(this.#processResponse);
  }

  #processResponse = () => {
    this.#bindEvents();
  };

  #render = data => {
    data.forEach(row => {
      const rowElement = new LazyTableRow(row);
      this.#rows.push(rowElement);
      this.#body.appendChild(rowElement);
    });
  }

  #generateUrl = () => {
    const url = new URL(this.#endpoint);

    if (this.#limit) {
      url.searchParams.append('limit', this.#limit);
      url.searchParams.append(this.#offsetKey, this.#page * this.#limit);
    }

    return url;
  }

  #loading = isOn => {
    if (isOn) {
      this.#loaderElement.removeAttribute('style');
    } else {
      this.#loaderElement.style.display = 'none';
    }
  }

  #fetchData = async () => {
    this.#loading(true);

    const response = await fetch(this.#generateUrl());
    const data = await response.json();
    const newData = this.#responseSource ? data[this.#responseSource] : data;
    this.#data = [...this.#data, ...newData];

    if (isNaN(this.#responseTotal)) {
      this.#responseTotal = this.#responseTotal ? data[this.#responseTotal] : 1000;
    }

    if (this.#limit) {
      this.#page++;
    }

    this.#render(newData);
    this.#loading(false);
  }

  #isLimitReached = () => {
    return this.#data.length >= this.#responseTotal;
  }

  #bindEvents = () => {
    if (this.#observer) {
      this.#observer.disconnect();

      if (this.#isLimitReached()) {
        return;
      }
    }

    this.#observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.#fetchData().then(this.#processResponse);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px 200px 0px',
      threshold: 0
    });

    this.#observer.observe(this.#rows[this.#rows.length - 1]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tables = document.querySelectorAll('.lazy-table');
  tables.forEach(table => new LazyTable(table));
});