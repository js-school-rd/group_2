if (localStorage.getItem('categories') == null) {
const categoriesTemp = [
  { icon: 'assets/fi-rr-beer.svg',        title: 'Beer', id: 1 },
  { icon: 'assets/fi-rr-bike.svg',        title: 'Sport', id: 2},
  { icon: 'assets/fi-rr-book.svg',        title: 'Book', id: 3},
  { icon: 'assets/fi-rr-bulb.svg',        title: 'Energy', id: 4},
  { icon: 'assets/fi-rr-child-head.svg',  title: 'Kids', id: 5},
  { icon: 'assets/fi-rr-croissant.svg',   title: 'Food', id: 6},
  { icon: 'assets/fi-rr-ice-cream.svg',   title: 'Dessert', id: 7}
];

localStorage.setItem('categories', JSON.stringify(categoriesTemp))
}

if (localStorage.getItem('budget') == null) {
  localStorage.setItem('budget', 5000)
}

let budget = localStorage.getItem('budget')
document.getElementById('budget').textContent = `${budget}$`  

const categories = JSON.parse(localStorage.getItem('categories'))
console.log(categories)

let costsList = JSON.parse(localStorage.getItem('costs'))
console.log(costsList)

if (JSON.parse(localStorage.getItem('costs')) == null) {
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
  liOther.className = 'category'
  liOther.innerHTML = `<p class=''>Other</p>`
  liOther.setAttribute('data-categoryId', 9999)

  categoryList.append(liOther)
  liOther.style.gridColumn = `span ${otherSpan}`
})

const historyDayTemplate = document.getElementById('historyDayTemplate')
const historyList = document.querySelector('[data-js-history-list]')
const dayCostList = document.querySelector('[data-js-day-cost-list]')
const historyDayCostTemplate = document.getElementById('historyDayCostTemplate')


function Cost(categoryId, amount, datetime) {
  this.categoryId = categoryId
  this.amount = amount
  this.datetime = datetime.toISOString()
}

function renderCost(targetList, cost) {
  const newCost = historyDayCostTemplate.content.cloneNode(true)
  const costTime = cost.datetime.split('T')[1].slice(0, 5);
  const costLeft = newCost.querySelector('.costleft')
  const costRight = newCost.querySelector('.costRight')
  const costCategory = categories.filter(item => item.id == cost.categoryId)

  costLeft.querySelector('p').textContent = costTime
  console.log(costCategory)
  console.log(costCategory.icon)
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
      const dateISO = new Date(item)
      newDay.querySelector('.historyDayTitleSum').textContent = `${daySum}$`
      newDay.querySelector('.historyDayTitleDate')
      .textContent =dateISO.toLocaleDateString('en-US', {
        day: "2-digit",
        month: 'short'
      }
      )
      
      const targetList = newDay.querySelector('.historyDayCostList')
      console.log(targetList)
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
    alert('не деризи')
  } else {
  newCost = new Cost(categoryId, amount, datetime)
  console.log(newCost)
  budget = budget - amount
  budgetDisplay.textContent = `${budget}$`
  if (costsList == null) {
  costsList = [newCost]
  }
  else {
    costsList.unshift(newCost)
  }
  localStorage.setItem('costs', JSON.stringify(costsList))
  localStorage.setItem('budget', budget)

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
  if (budgetInput.value > 0 && Number(budgetInput.value) <= +budget) {
  categoryList.classList.remove('inactive-category')
  budgetInputBlock.classList.add('active-input-block')
  budgetDisplay.classList.remove('invalid-text')
  }
  else if (budgetInput.value > 0 && Number(budgetInput.value) > +budget) {
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
