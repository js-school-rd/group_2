
**1)** Лучше убрать комментарии из кода


**2)** У нас есть CSS-файл, поэтому стили лучше хранить там, а не использовать inline-стили:

```html
<p id="selected-currency-1" style="font-size:24px; font-weight:700; align-self:center"></p>
```

Вот дока можно почитать:
[https://doka.guide/css/specificity/](https://doka.guide/css/specificity/)


**3)**

```js
const Currencies = new Object();
```

Короткая форма `new Object()` — это `{}`, лучше использовать её.

Также у тебя набор валют и категорий — это **константы**, они не меняются. Можно сразу описать объект целиком:

```js
const Currencies = {
  USD: {
    name: "United States Dollar",
    sign: "$"
  },
  RUB: {
    name: "Russian Ruble",
    sign: "RUB"
  },
  KZT: {
    name: "Kazahstan Tenge",
    sign: "KZT"
  }
};
```

Так удобнее добавлять и изменять данные


**4)**

```js
const mainBalanceText = document.getElementById("main-balance");
const additionalBalanceText = document.getElementById("additional-balance");
const additionalBalanceText2 = document.getElementById("additional-balance-2");
const addBalanceMenu = document.getElementById("menu-add");
const inputAddBalance = document.getElementById("amount-to-add");
const inputRemoveBalance = document.getElementById("amount-to-remove");
const textSelectedCur = document.getElementById("selected-currency");
const textSelectedCur1 = document.getElementById("selected-currency-1");
const currencySelector = document.getElementById("currency-selector");
const currencySelector1 = document.getElementById("currency-selector-1");
const categoryList = document.getElementById("category-list");
const transactionList = document.getElementById("transactions");
```

Здесь всё хорошо: ты получаешь DOM-элементы в начале, а потом уже работаешь с ними


**5)**

```js
let selectedCategory = Categories;
```

Переменная нигде не используется, лучше удалить такие вещи, чтобы не засорять код


**6)**
Вопрос по логике: я думал, что у нас **один бюджет**, а валюты — это просто отображение одного и того же баланса в разных валютах, а не три отдельных бюджета. Что думаешь?


**7)**

```js
[Currencies.RUB, Currencies.KZT]
```

Это тоже константа, её можно вынести в начало:

```js
const availableCurrencies = [Currencies.RUB, Currencies.KZT];
```

И дальше использовать её по коду


**8)**

```html
<button onclick="closeAddMenu()">Cancel</button>
<button onclick="addToBalance(...)">Add To USD</button>
```

Лучше не использовать inline-обработчики событий.
HTML должен отвечать только за разметку, а обработчики событий стоит добавлять через JS:

```js
element.addEventListener('event', handler);
```

Пример:

```js
const btn = document.querySelector('#btn');

btn.addEventListener('click', () => {
  console.log('Клик!');
});
```

Дока:
[https://learn.javascript.ru/introduction-browser-events](https://learn.javascript.ru/introduction-browser-events)


**9)**

```js
currencySelector.style.visibility = "hidden";
newDiv.style = "height: 33px; display: flex; justify-content: center";
```

Лучше не управлять стилями напрямую из JS.
Создай CSS-класс:

```css
.hidden {
  visibility: hidden;
}
```

И добавляй его через JS:

```js
newDiv.classList.add('hidden');
```

Про `classList`:
[https://medium.com/@shivani.007/classlist-in-javascript-b73cfc598e70](https://medium.com/@shivani.007/classlist-in-javascript-b73cfc598e70)


**10)**

```js
(function () {
  ...
})();
```

Лучше писать обычные функции и вызывать их явно. Так код будет проще читать и поддерживать.


**11)** 

Так все окей, у тебя код разделен на мелкие функции, каждая отвечает за свою часть
