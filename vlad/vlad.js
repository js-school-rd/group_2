function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

if (loadFromStorage('categories') == null) {
const categoriesTemp = [
  { icon: 'assets/fi-rr-beer.svg',        title: 'Beer', id: 1 },
  { icon: 'assets/fi-rr-bike.svg',        title: 'Sport', id: 2},
  { icon: 'assets/fi-rr-book.svg',        title: 'Book', id: 3},
  { icon: 'assets/fi-rr-bulb.svg',        title: 'Energy', id: 4},
  { icon: 'assets/fi-rr-child-head.svg',  title: 'Kids', id: 5},
  { icon: 'assets/fi-rr-croissant.svg',   title: 'Food', id: 6},
  { icon: 'assets/fi-rr-ice-cream.svg',   title: 'Dessert', id: 7}
];

saveToStorage('categories', categoriesTemp)
}

if (loadFromStorage('budget') == null) {
  saveToStorage('budget', 5000)
}

let budget = loadFromStorage('budget')
document.getElementById('budget').textContent = `${budget}$`  

const categories = loadFromStorage('categories')

function Cost(categoryId, amount, datetime) {
  this.categoryId = categoryId
  this.amount = amount
  this.datetime = datetime.toISOString()
}

function getTimeFromISO(date) {
  return new Date(date).toISOString().slice(11, 16);
}

function getDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function getLocalTime(date) {
  return new Date(date).toLocaleTimeString().slice(0, 5);
}

function getLocalDate(date) {
  return new Date(date).toLocaleDateString()
}

function getLocalDateUI(date) {
  return new Date(date).toLocaleDateString('en-US', {
        day: "2-digit",
        month: 'short'
      }
    )
}

let costsList = loadFromStorage('costs')

if (loadFromStorage('costs') == null) {
  let costsList = []
}

const otherSpan = 4 - (categories.length % 4)

const budgetDisplay = document.getElementById('budget')

const categoryList = document.querySelector('.category-select')
document.addEventListener('DOMContentLoaded', () => {

  for (let i = 0; i < categories.length; i++) {
    const liOne = document.createElement('li')
    liOne.className = 'category'
    liOne.setAttribute('data-categoryId', categories[i].id)

    const img = document.createElement('img')
    img.src = categories[i].icon
    
    const p = document.createElement('p')
    p.textContent = categories[i].title

    liOne.append(img, p)
    categoryList.append(liOne)
  }

  const liOther = document.createElement('li')
  liOther.classList.add('category')
  const p = document.createElement('p');
  p.textContent = 'Other';
  liOther.appendChild(p);
  liOther.setAttribute('data-categoryId', 9999)

  categoryList.append(liOther)
  liOther.style.gridColumn = `span ${otherSpan}`
})

const historyDayTemplate = document.getElementById('historyDayTemplate')
const historyList = document.querySelector('[data-js-history-list]')
const dayCostList = document.querySelector('[data-js-day-cost-list]')
const historyDayCostTemplate = document.getElementById('historyDayCostTemplate')

function renderCost(targetList, cost) {
  const newCost = historyDayCostTemplate.content.cloneNode(true)
  const costTime = getLocalTime(cost.datetime)
  const costLeft = newCost.querySelector('.costleft')
  const costRight = newCost.querySelector('.costRight')
  const costCategory = categories.filter(item => item.id == cost.categoryId)

  costLeft.querySelector('p').textContent = costTime
  if (cost.categoryId != 9999) {
  costLeft.querySelector('img').src = costCategory[0].icon
  }
  costRight.querySelector('.costAmount').textContent = `${cost.amount}$`
  targetList.append(newCost)
}

function renderDaysList(){
  const uniqeDates = [
    ...new Set(
      costsList.map(item => {
        const d = new Date(item.datetime)
        return d.toISOString().slice(0, 10);
      })
    )
  ]
  historyList.replaceChildren();
  uniqeDates.forEach(function(item) {
      const dayTemplate = document.getElementById('historyDayTemplate')
      const newDay = dayTemplate.content.cloneNode(true)
      const costsInDay = costsList.filter(costitem =>
      costitem.datetime.slice(0, 10) === item
      );
      let daySum = 0
      costsInDay.forEach(item => daySum += Number(item.amount))
      newDay.querySelector('.historyDayTitleSum').textContent = `${daySum}$`
      newDay.querySelector('.historyDayTitleDate')
      .textContent = getLocalDateUI(item)
      
      const targetList = newDay.querySelector('.historyDayCostList')
      costsInDay.forEach(function(cost) {
        renderCost(targetList, cost)
      }
      )

      historyList.append(newDay)
  }
  )
}

function addCost(categoryId, amount, datetime) {
  if (+budget < +amount) {
    alert('не дерзи')
  } else {
  newCost = new Cost(categoryId, amount, datetime)
  budget = budget - amount
  budgetDisplay.textContent = `${budget}$`
  if (costsList == null) {
  costsList = [newCost]
  }
  else {
    costsList.unshift(newCost)
  }
  saveToStorage('costs', costsList)
  saveToStorage('budget', budget)

  renderDaysList()
  }
}

const budgetInput = document.querySelector('.quick_add_input')

function resetInputs() {
  budgetInput.value = null
  budgetInput.blur()
  budgetInputBlock.classList.remove('active-input-block')
  budgetInputBlock.classList.remove('invalid-input-block')
  categoryList.classList.add('inactive-category')
}

categoryList.addEventListener('click', (e) => {
  const item = e.target.closest('.category')
  const categoryID = item.dataset.categoryid
  const amount = budgetInput.value
  const datetime = new Date ()
  addCost(categoryID, amount, datetime)
  resetInputs()
})

if (costsList != null) {
  renderDaysList()
}

const budgetInputBlock = document.querySelector('.quick_add_input_block')

budgetInput.addEventListener('input', (e) => {
  const value = Number(budgetInput.value);
  const maxBudget = Number(budget);
  if (value > 0 && value <= maxBudget) {
  categoryList.classList.remove('inactive-category')
  budgetInputBlock.classList.add('active-input-block')
  budgetDisplay.classList.remove('invalid-text')
  }
  else if (value > 0 && value > maxBudget) {
    categoryList.classList.add('inactive-category')
    budgetDisplay.classList.add('invalid-text')
    
  }
  else {
    categoryList.classList.add('inactive-category')
    budgetDisplay.classList.remove('invalid-text')
  }
})

budgetInput.addEventListener('focus', (e) => {
  budgetInputBlock.classList.add('active-input-block')
})

budgetInput.addEventListener('blur', (e) => {
  budgetInputBlock.classList.remove('active-input-block')
})
