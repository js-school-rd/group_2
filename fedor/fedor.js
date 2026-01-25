const budgetFromLocalStorage = localStorage.getItem('initialBudget');
let initialBudget = 0;

if (budgetFromLocalStorage === null || budgetFromLocalStorage === undefined) {
  initialBudget = 6000000;
  localStorage.setItem('initialBudget', initialBudget)
}
else { initialBudget = budgetFromLocalStorage }

const categoriesContainer = document.querySelector('.categories');

const otherButton = document.querySelector('.other-button');
otherButton.addEventListener('click', () => onCategoryClick());

let currency = '$';

updateBudgetDisplay(initialBudget, currency);

if (!Array.isArray(JSON.parse(localStorage.getItem('expenses')))) {
  localStorage.setItem('expenses', '[]');
}

if (!Array.isArray(localStorage.getItem('categories'))) {
  const initialCategories = [
    new Category('Eat', 'images/Vector (1).svg', 1),
    new Category('Beer', 'images/fi-rr-beer.svg', 2),
    new Category('Bikes', 'images/fi-rr-bike.svg', 3),
    new Category('Books', 'images/fi-rr-book.svg', 4),
    new Category('Energy', 'images/fi-rr-bulb.svg', 5),
    new Category('Kids', 'images/fi-rr-child-head.svg', 6),
    new Category('Croissants', 'images/fi-rr-croissant.svg', 7),
  ]

  localStorage.setItem('categories', JSON.stringify(initialCategories));
}

const categories = JSON.parse(localStorage.getItem('categories'));

categories.forEach(item => addCategoryCard(item.name, item.icon, item.id));

document.documentElement.style.setProperty('--grid-column-number', 4 - (categories.length % 4));




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

function addExpense(expense, budget) {
  if (budget < expense.amount) {
    alert('Budget exceeded');
    throw console.error('Budget exceeded');
  }

  initialBudget -= expense.amount;

  const expensesArray = JSON.parse(localStorage.getItem('expenses'));
  expensesArray.push(expense);

  localStorage.setItem('expenses', JSON.stringify(expensesArray));

  localStorage.setItem('initialBudget', initialBudget);

  updateBudgetDisplay(initialBudget, expense.currency);
}

function updateBudgetDisplay(amount, currency) {
  const qwe = amount / 1000;
  document.querySelector(".budget span").textContent = qwe + currency;
}

function onCategoryClick(id) {
  let category = 'Other';
  if (id) {
    category = categories.find(item => item.id == id);
  }

  const input = document.querySelector("#budget-input");
  const value = +input.value * 1000;
  if (value <= 0) {
    alert('Incorrect value');
    return;
  }

  addExpense(new Expense(category, value, currency), initialBudget)

  input.value = null;
}

