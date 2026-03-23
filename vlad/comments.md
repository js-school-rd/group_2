### **1)**

По функционалу всё ок, поля дизейблятся, есть валидации

### **2)**

`console.log(categories)` и другие `console.log`
Для разработки и дебага, но перед деплоем лучше убирать, чтобы не засорять консоль и не забывать временный код


### **3)**

```css
.historyDayGroup > .budget_convert > li {
  font-weight: 400;
  color: #C9C9C9;
  font-size: 12px;
}

.historyDayGroup > .budget_convert > li:first-child {
  padding-left: 0px;
}
```

Такие глубокие селекторы лучше избегать, потому что сложно отследить откуда прилетело свойство, сложно переопределять, тяжело читать и поддерживать

Лучше добавлять тдельные классы и id и меньше завязваться на теги из DOM



```css
.budget-item {
  font-size: 12px;
  color: #C9C9C9;
}
```


### **4)**

```css
#FFFFFFCC
#032B2E66
```

Это цвет с альфа-каналом (прозрачностью).
Лучше и понятнее использовать `rgba`

```css
color: rgba(255, 255, 255, 0.8);
background: rgba(3, 43, 46, 0.4);
```

### **5)**

```html
<li><a><img src="assets/menu/fi-rr-home.svg"></a></li>
```

У `<img>` обязательно стоит добавлять `alt`:

* для доступности (screen readers)
* для SEO
* для ботов и ассистивных технологий


```html
<img src="assets/menu/fi-rr-home.svg" alt="Home page">
```

Хорошая статья:
[https://doka.guide/html/alt/](https://doka.guide/html/alt/)


### **6)**

```js
const categoriesTemp = [
  { icon: 'assets/fi-rr-beer.svg', title: 'Beer', id: 1 },
  ...
];
```

Отличный подход
Сначала описываешь конфигурации / константы, потом используешь их в логике


* константы принято писать в `UPPER_SNAKE_CASE`

```js
const CATEGORIES_TEMP = [];
```

Также:

```js
function Cost(categoryId, amount, datetime) {
  this.categoryId = categoryId
  this.amount = amount
  this.datetime = datetime.toISOString()
}
```

Функции-конструкторы лучше располагать в начале файла, чтобы сразу было понятно: какие есть сущности и с какими данными работаешь

### **7)**

```js
liOne.className = 'category'
```

Лучше использовать `classList.add`, потому что: `className` **перезатирает все классы**, легко случайно сломать стили


```js
liOne.classList.add('category');
```

Также `innerHTML`:

```js
liOther.innerHTML = `<p>Other</p>`;
```

Лучше:

```js
const p = document.createElement('p');
p.textContent = 'Other';
liOther.appendChild(p);
```
Потому что innerHTML полностью перезаписывает содержимое

### **8)**

```js
budgetInput.addEventListener('input', () => {
  if (budgetInput.value > 0 && Number(budgetInput.value) <= +budget) {
    ...
```

Тут несколько раз используется `budgetInput.value`
Лучше считать значение **один раз** и сделать **явное преобразование**


```js
budgetInput.addEventListener('input', () => {
  const value = Number(budgetInput.value);
  const maxBudget = Number(budget);

  if (value > 0 && value <= maxBudget) {
    ...
  }
});
```

### **9)**

```js
const costTime = cost.datetime.split('T')[1].slice(0, 5);
```

И дальше много работы с датами:

* `split`
* `slice`
* `toLocaleDateString`

Лучше вынести в **вспомогательные функции**, например:

```js
function getTimeFromISO(date) {
  return new Date(date).toISOString().slice(11, 16);
}

function getDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}
```
### **10)**

```js
localStorage.setItem('categories', JSON.stringify(categoriesTemp))
```

Работу с `localStorage` тоже удобно оборачивать в функции:

```js
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
```

### **11)**

```js
const uniqeDates = [
  ...new Set(
    costsList.map(item => {
      const d = new Date(item.datetime)
      return d.toISOString().slice(0, 10);
    })
  )
]
```

Тут используется сразу несколько концепций JS:

* `map`
* `Set`
* `spread operator`

ссылки оставлю, часто используются в коде, важно разобраться

* Map / Set: [https://javascript.info/map-set](https://javascript.info/map-set)
* Spread operator: [https://javascript.info/rest-parameters-spread](https://javascript.info/rest-parameters-spread)