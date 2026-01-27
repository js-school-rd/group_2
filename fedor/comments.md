### 1) Шрифты
Необязательно скачивать много файлов шрифтов, обычно достаточно для одного шрифта 3 типа `Regular / Medium / Bold` 

### 2) Функционал
По функционалу всё ок: есть валидации, логика корректно отрабатывает

### 3) Нейминг фоновых изображений
Для фоновых изображений лучше не использовать названия вроде  
`Vector Vector (1).svg`.

Лучше давать более осмысленные имена, например:  
`layout-background-img.svg` — сразу понятно, что это фон


### 4) CSS-переменные
```css
:root {
  --bg-color: #1e1e1e;
  --font-family: 'Manrope';
  --font-color: white;
  --bg-image: url(images/Vector.svg);
  --grid-column-number: 4;
}
````

Очень круто!
Так использовать переменные и их использовать правильно и так строится дизайн-система (цвета, размеры, шрифты)

### 5) Комментарии

Комментарии лучше удалить:

```html
<!-- Initial budget -->
```

По коду и так понятно, что происходит


### 6) Константы, нейминг и структура

```js
const initialCategories = [
  new Category('Eat', 'images/Vector (1).svg', 1),
  new Category('Beer', 'images/fi-rr-beer.svg', 2),
  new Category('Bikes', 'images/fi-rr-bike.svg', 3),
  new Category('Books', 'images/fi-rr-book.svg', 4),
  new Category('Energy', 'images/fi-rr-bulb.svg', 5),
  new Category('Kids', 'images/fi-rr-child-head.svg', 6),
  new Category('Croissants', 'images/fi-rr-croissant.svg', 7),
];
```

Все такие значения лучше выносить в начало файла и объявлять через `const`, если они не переопределяются

По неймингу для констант лучше использовать `UPPER_CASE`:

```js
const CURRENCY_USD_SYMBOL = '$';
const INITIAL_BUDGET = 6_000_000;
```

Также конструкторы лучше объявлять в начале файла, чтобы сразу было понятно, какие сущности есть в проекте:

```js
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
```


### 7) Работа с `localStorage`

```js
if (!Array.isArray(JSON.parse(localStorage.getItem('expenses')))) {
  localStorage.setItem('expenses', '[]');
}
```

Работу с `localStorage` лучше вынести в отдельные хелпер-функции и использовать их по всему проекту

```js
function getFromLocalStorage(key, defaultValue) {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function setToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}
```


### 8) Обработчики событий 

```js
otherButton.addEventListener('click', () => onCategoryClick());
card.addEventListener('click', () => onCategoryClick(id));
```

В обработчиках: избегаем неявного преобразования типов (`+input.value`) и используем строгое сравнение `===` вместо `==`

Пример:

```js
const inputValue = Number(input.value);

if (item.id === id) {
  ...
}
```
