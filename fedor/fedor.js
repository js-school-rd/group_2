function Currency(name, symbol, icon) {
  this.name = name;
  this.symbol = symbol;
  this.icon = icon;
}

function Expense(category, amount, currency) {
  this.category = category;
  this.amount = amount;
  this.currency = currency;
}

function Category(name, icon, id) {
  this.name = name;
  this.icon = icon;
  this.id = id;
}





const CATEGORIES = getFromLocalStorage('categories', [
  new Category('Eat', 'images/fi-rr-food.svg', 1),
  new Category('Beer', 'images/fi-rr-beer.svg', 2),
  new Category('Bikes', 'images/fi-rr-bike.svg', 3),
  new Category('Books', 'images/fi-rr-book.svg', 4),
  new Category('Energy', 'images/fi-rr-bulb.svg', 5),
  new Category('Kids', 'images/fi-rr-child-head.svg', 6),
  new Category('Croissants', 'images/fi-rr-croissant.svg', 7),
]);

const CURRENCIES = getFromLocalStorage('currencies', [
  new Currency('US Dollar', '$', 'images/$.svg'),
  new Currency('Russian Ruble', '₽', 'images/₽.svg'),
  new Currency('Kazahstan Tenge', '₸', 'images/KZT.svg')
]);

const EXPENSES = getFromLocalStorage('expenses', [])

let initialBudget = getFromLocalStorage('initialBudget', 6000000);



document.addEventListener('DOMContentLoaded', () => {
  const EL = document.querySelector('.categories-wrapper');
  const STYLE = getComputedStyle(EL);
  const WIDTH = parseFloat(STYLE.width) - parseFloat(STYLE.paddingLeft) - parseFloat(STYLE.paddingRight);
  document.documentElement.style.setProperty('--dynamic-dropdown-menu-width', WIDTH + 'px');

});

CURRENCIES.forEach((item, index, array) => {
  const CONTAINER = document.createElement('div');
  CONTAINER.classList.add('currency-row');

  const SPAN = document.createElement('span');
  SPAN.textContent = item.name;

  const SYMBOL = document.createElement('img');
  SYMBOL.src = item.icon;

  CONTAINER.append(SPAN, SYMBOL);
  CONTAINER.addEventListener('click', () => {
    selectCurrency(item);
    updateElementText(document.querySelector('.currency-select span'), currency.symbol);
    updateElementText(document.querySelector('.budget span'), initialBudget / 1000 + currency.symbol)
    toggleElement(document.querySelector('.currencies-menu'));
  });

  const MENU = document.querySelector('.currencies-menu');
  const SEPARATOR = document.createElement('div');
  SEPARATOR.className = 'currency-separator';

  if (index != array.length - 1) {
    MENU.append(CONTAINER, SEPARATOR);
  } else {
    MENU.append(CONTAINER);
  }
})


const CATEGORIES_CONTAINER = document.querySelector('.categories');

const OTHER_BUTTON = document.querySelector('.other-button');
OTHER_BUTTON.addEventListener('click', () => onCategoryClick());


let currency = CURRENCIES[0];

const CURRENCY_SPAN = document.createElement('span');
CURRENCY_SPAN.textContent = currency.symbol;
document.querySelector('.currency-select').insertBefore(CURRENCY_SPAN, document.querySelector('.currency-select img'));

updateElementText(document.querySelector('.budget span'), initialBudget / 1000 + currency.symbol);


CATEGORIES.forEach(item => addCategoryCard(item.name, item.icon, item.id));

document.documentElement.style.setProperty('--grid-column-number', 4 - (CATEGORIES.length % 4));


const CURRENCIES_MENU_CONTAINER = document.querySelector('.currencies-menu');
const CURRENCIES_MENU_TOGGLER = document.querySelector('.currency-select');

CURRENCIES_MENU_TOGGLER.addEventListener('click', () => {
  toggleElement(CURRENCIES_MENU_CONTAINER, 'flex');
});




function toggleElement(el, initialDisplay) {
  el.style.display === 'none' ? el.style.display = initialDisplay : el.style.display = 'none';
}

function addCategoryCard(name, image, id) {
  const CARD = document.createElement('div');
  CARD.className = 'category-card';
  CARD.dataset.id = id;
  CARD.addEventListener('click', () => { onCategoryClick(id) })

  const IMG = document.createElement('img');
  IMG.src = image;
  IMG.alt = 'category';

  const SPAN = document.createElement('span');
  SPAN.textContent = name;
  CARD.append(IMG, SPAN);

  CATEGORIES_CONTAINER.insertBefore(CARD, OTHER_BUTTON);
}

function addExpense(expense, budget) {
  if (budget < expense.amount) {
    alert('Budget exceeded');
    throw console.error('Budget exceeded');
  }

  initialBudget -= expense.amount;

  EXPENSES.push(expense);

  saveToLocalStorage('expenses', EXPENSES);

  saveToLocalStorage('initialBudget', initialBudget);

  updateElementText(document.querySelector('.budget span'),
    (initialBudget / 1000) + expense.currency.symbol);
}

function updateElementText(el, text) {
  el.textContent = text;
}

function onCategoryClick(id) {
  let category = 'Other';
  if (id) {
    category = CATEGORIES.find(item => item.id == id);
  }

  const BUDGET_INPUT = document.querySelector("#budget-input");
  const VALUE = Number(BUDGET_INPUT.value) * 1000;
  if (VALUE <= 0) {
    alert('Incorrect value');
    return;
  }

  addExpense(new Expense(category, VALUE, currency), initialBudget)

  BUDGET_INPUT.value = null;
}

function selectCurrency(selectedCurrency) {
  currency = selectedCurrency;
}




function getFromLocalStorage(key, defaultValue) {
  const VALUE = localStorage.getItem(key);
  if (VALUE === null) return defaultValue;

  try {
    return JSON.parse(VALUE)
  } catch {
    return VALUE
  }
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}