class Currency {
  constructor(name, symbol, icon, coefficient) {
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.coefficient = coefficient;
  }

  static fromJSON(obj) {
    return new Currency(obj.name, obj.symbol, obj.icon)
  }
}

function Transaction(category, amount, currency, date = new Date()) {
  this.category = category;
  this.amount = amount;
  this.currency = currency;
  this.date = date;
}

Transaction.prototype.toJSON = function () {
  const obj = {};
  for (key in this) {
    obj[key] = this[key];
  }
  return obj;
}
Transaction.prototype.convertToString = function () {
  return `category: ${this.category.name}, amount: ${this.amount / 1000}, date: ${dateToString(new Date(this.date))}`;
}

class TransactionService {
  static createExpense({ amount, category, currency, meta = {} }) {
    if (!Number.isFinite(amount)) {
      throw new Error('Not a number');
    }

    if (amount <= 0) {
      throw new Error('Invalid amount');
    }

    return new Transaction(category, amount, currency)
  }

  static fromJSON = function (obj) {
    return new Transaction(obj.category, obj.amount, obj.currency, obj.date);
  }
}

class Category {
  constructor(name, icon, id) {
    this.name = name;
    this.icon = icon;
    this.id = id;
  }

  static fromJSON(obj) {
    return new Category(obj.name, obj.icon, obj.id)
  }
}




const categories = getFromLocalStorage('categories', [
  new Category('Eat', 'images/fi-rr-food.svg', 1),
  new Category('Beer', 'images/fi-rr-beer.svg', 2),
  new Category('Bikes', 'images/fi-rr-bike.svg', 3),
  new Category('Books', 'images/fi-rr-book.svg', 4),
  new Category('Energy', 'images/fi-rr-bulb.svg', 5),
  new Category('Kids', 'images/fi-rr-child-head.svg', 6),
  new Category('Croissants', 'images/fi-rr-croissant.svg', 7),
], Category);

const currencies = getFromLocalStorage('currencies', [
  new Currency('US Dollar', '$', 'images/$.svg', 1),
  new Currency('Russian Ruble', '₽', 'images/₽.svg', 75),
  new Currency('Kazahstan Tenge', '₸', 'images/KZT.svg', 503)
], Currency);

const transactions = getFromLocalStorage('expenses', [], Transaction);

let initialBudget = getFromLocalStorage('initialBudget', 6000000);

let uniqueDates = getUniqueDates(transactions);




const contentContainer = document.querySelector('.home-screen');

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.categories-wrapper');
  const style = getComputedStyle(el);
  const width = parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  document.documentElement.style.setProperty('--dynamic-dropdown-menu-width', width + 'px');

  const homeScreen = document.querySelector('.home-screen');
  showScreen(homeScreen)
  const menuButtons = document.querySelectorAll('.menu > *');

  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      switch (button.className) {
        case 'home-button': {
          const screen = document.querySelector('.home-screen');
          showScreen(screen);
          break;
        };
        case 'stats-button': {
          const screen = document.querySelector('.stats-screen');
          showScreen(screen);
          break;
        };
        case 'settings-button': {
          const screen = document.querySelector('.settings-screen');
          showScreen(screen);
          break;
        };
        case 'add-button': {
          const screen = document.querySelector('.history-screen');
          showScreen(screen);
          render(transactions);
          break;
        };
      }
    })
  })
});



currencies.forEach((item, index, array) => {
  const container = document.createElement('div');
  container.classList.add('currency-row');

  const span = document.createElement('span');
  span.textContent = item.name;

  const symbol = document.createElement('img');
  symbol.src = item.icon;

  container.append(span, symbol);
  container.addEventListener('click', () => {
    selectCurrency(item);
    updateElementText(document.querySelector('.currency-select span'), currency.symbol);
    updateElementText(document.querySelector('.budget span'), initialBudget / 1000 + currency.symbol)
    toggleElement(document.querySelector('.currencies-menu'));
  });

  const menu = document.querySelector('.currencies-menu');
  const separator = document.createElement('div');
  separator.className = 'separator';

  if (index !== array.length - 1) {
    menu.append(container, separator);
  } else {
    menu.append(container);
  }
})

let currency = currencies[0];

const uniqueExpenses = uniqueDates.map(date =>
  transactions.find(expense => {
    return dateToString(new Date(expense.date)) === dateToString(new Date(date));
  })
)
uniqueExpenses.forEach((item, index) => addOrUpdateHistoryEntryHTML(item, index))



const categoriesContainer = document.querySelector('.categories');

const otherButton = document.querySelector('.other-button');
otherButton.addEventListener('click', () => onCategoryClick());



const currencySpan = document.createElement('span');
currencySpan.textContent = currency.symbol;
document.querySelector('.currency-select').insertBefore(currencySpan, document.querySelector('.currency-select img'));

updateElementText(document.querySelector('.budget span'), initialBudget / 1000 + currency.symbol);


categories.forEach(item => addCategoryCard(item.name, item.icon, item.id));

document.documentElement.style.setProperty('--grid-column-number', 4 - (categories.length % 4));


const currenciesMenuContainer = document.querySelector('.currencies-menu');
const currenciesMenuToggler = document.querySelector('.currency-select');

currenciesMenuToggler.addEventListener('click', () => {
  toggleElement(currenciesMenuContainer, 'flex');
});




function showScreen(targetScreen) {
  const allScreens = [...document.querySelectorAll('.screen')];
  const screenIndex = allScreens.indexOf(targetScreen);
  allScreens.splice(screenIndex, 1);

  allScreens.forEach(screen => screen.style.display = 'none');
  targetScreen.style.display = 'flex';
}

function toggleElement(el, initialDisplay) {
  el.style.display === 'none' ? el.style.display = initialDisplay : el.style.display = 'none';
}

function addCategoryCard(name, image, id) {
  const card = document.createElement('div');
  card.className = 'category-card';
  card.dataset.id = id;
  card.addEventListener('click', () => { onCategoryClick(id) })

  const img = document.createElement('img');
  img.src = image;
  img.alt = 'category';

  const span = document.createElement('span');
  span.textContent = name;
  card.append(img, span);

  categoriesContainer.insertBefore(card, otherButton);
}

function updateElementText(el, text) {
  el.textContent = text;
}

function onCategoryClick(id) {
  const budgetInput = document.querySelector("#budget-input");
  try {
    let category = 'Other';
    if (id) {
      category = categories.find(item => item.id === id);
    }

    const value = Number(budgetInput.value) * 1000;

    const newTransaction = TransactionService.createExpense({ category, amount: value, currency });

    initialBudget -= newTransaction.amount;
    saveToLocalStorage('initialBudget', initialBudget);
    updateElementText(document.querySelector('.budget span'),
      (initialBudget / 1000) + newTransaction.currency.symbol);

    addTransaction(newTransaction);
    addOrUpdateHistoryEntryHTML(newTransaction, uniqueDates.length - 1);
  } catch (error) {
    alert(error.message)
  } finally {
    budgetInput.value = null;
  }
}

function getUniqueDates(transactions) {
  const uniqueDates = [];
  transactions.forEach(item => {
    const date = new Date(item.date);
    const formattedDateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (!uniqueDates.includes(formattedDateString)) { uniqueDates.push(formattedDateString); }
  });
  return uniqueDates;
}

function selectCurrency(selectedCurrency) {
  currency = selectedCurrency;
}

function dateToString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}




function getFromLocalStorage(key, defaultValue, Class = null) {
  const value = localStorage.getItem(key);

  if (value === null) { return defaultValue }

  try {
    const parsed = JSON.parse(value);

    if (Class) {
      if (Array.isArray(parsed)) {
        return parsed.map(item => { return Class === Transaction ? new TransactionService.fromJSON(item) : new Class().fromJSON(item) })
      }

      if (parsed && typeof parsed === 'object') {
        return Class === Transaction ? new TransactionService.fromJSON(parsed) : new Class().fromJSON(parsed);
      }
    }

    return parsed;
  } catch {
    return value;
  }
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function addOrUpdateHistoryEntryHTML(Transaction, index) {
  const dateObj = new Date(Transaction.date);
  const dateString = dateToString(dateObj);

  const isEntryExist = Boolean(transactions.find((item) => dateToString(new Date(item.date)) === dateString));

  const expensesForThisDate = transactions.filter(item => dateString === dateToString(new Date(item.date)))
  const expensesSum = expensesForThisDate.reduce((sum, item) => { return sum += item.amount }, 0);

  const otherCurrencies = getOtherCurrencies(currency, currencies);

  const sumSpan = document.querySelectorAll('.sum-span')[index];
  const sumForThisDateText = expensesSum / 1000 + currency.symbol;

  let historyContainer = document.querySelector('.history-container');
  if (!historyContainer) {
    historyContainer = document.createElement('div');
    historyContainer.className = 'history-container';
  }
  contentContainer.append(historyContainer);


  if (!isEntryExist || !sumSpan) {
    const dateContainer = document.createElement('div');
    dateContainer.className = 'date-entry';
    dateContainer.dataset.id = index;

    const dateAndSumWrapper = document.createElement('div');
    dateAndSumWrapper.className = 'date-and-sum-wrapper';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'date-span';
    dateSpan.textContent = dateString;

    const sumSpan = document.createElement('span');
    sumSpan.className = 'sum-span';
    sumSpan.textContent = sumForThisDateText;

    const dateAndSumSpan = document.createElement('span');
    dateAndSumSpan.className = 'date-and-sum-span';
    dateAndSumSpan.append(dateSpan, sumSpan);

    const otherCurrenciesSpan = document.createElement('span');
    otherCurrenciesSpan.textContent = constructOtherCurrenciesSpan(otherCurrencies, expensesSum);
    otherCurrenciesSpan.className = 'other-currencies-span';

    dateAndSumWrapper.append(dateAndSumSpan, otherCurrenciesSpan);

    const expenseEntriesContainer = document.createElement('div');
    expenseEntriesContainer.className = 'expense-entries-container';

    expensesForThisDate.forEach(expense => {
      expenseEntriesContainer.prepend(constructEntry(expense));
    });
    dateContainer.append(dateAndSumWrapper, expenseEntriesContainer);

    historyContainer.prepend(dateContainer);
  }
  else {
    sumSpan.textContent = sumForThisDateText;
    const allExpenseEntriesContainers = document.querySelectorAll('.expense-entries-container');
    const lastExpenseEntriesContainer = allExpenseEntriesContainers[0];
    lastExpenseEntriesContainer.prepend(constructEntry(Transaction));
  }
}

function dateToString(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function constructOtherCurrenciesSpan(currencies, sum) {
  return currencies.map(currency => {
    return (sum * currency.coefficient / 1000) + currency.symbol;
  }).join(' | ');
}

function getOtherCurrencies(currency, currencies) {
  const currentCurrencyIndex = currencies.indexOf(currency);
  const otherCurrencies = currencies.slice();
  otherCurrencies.splice(currentCurrencyIndex, 1);
  return otherCurrencies;
}

function addTransaction(Transaction) {
  transactions.push(Transaction);
  saveToLocalStorage('expenses', transactions);
}

function constructEntry(expense) {
  const expenseEntry = document.createElement('div');
  expenseEntry.className = 'expense-entry';

  const otherCurrencies = getOtherCurrencies(currency, currencies);

  const timeAndCategoryContainer = document.createElement('div');
  timeAndCategoryContainer.className = 'time-and-category-container';
  const timeSpan = document.createElement('span');
  timeSpan.textContent = `${new Date(expense.date).getHours()}:${new Date(expense.date).getMinutes()}`;
  const categoryIcon = document.createElement('img');
  categoryIcon.src = expense.category.icon;
  timeAndCategoryContainer.append(timeSpan, categoryIcon);

  const currenciesAndSumContainer = document.createElement('div');
  currenciesAndSumContainer.className = 'currencies-and-sum-container';
  const entrySumSpan = document.createElement('span');
  entrySumSpan.textContent = expense.amount / 1000 + currency.symbol;
  const otherCurrenciesForExpenseSpan = document.createElement('span');
  otherCurrenciesForExpenseSpan.className = 'other-currencies-span';
  otherCurrenciesForExpenseSpan.textContent = constructOtherCurrenciesSpan(otherCurrencies, expense.amount);
  currenciesAndSumContainer.append(otherCurrenciesForExpenseSpan, entrySumSpan);

  expenseEntry.append(timeAndCategoryContainer, currenciesAndSumContainer);

  return expenseEntry;
}

function render(transactions) {
  const historyContainer = document.createElement('div');
  historyContainer.className = 'history-container';

  transactions.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item.convertToString();
    historyContainer.append(span);
  });

  const historyScreen = document.querySelector('.history-screen');
  historyScreen.append(historyContainer);
}