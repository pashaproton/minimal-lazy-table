export const render = data => {
  const element = document.createElement('td');
  element.innerHTML = data;
  return element;
}