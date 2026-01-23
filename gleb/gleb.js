const Currencies = new Object();
Currencies.USD = {
    name: "United States Dollar",
    sign: "$"
}
Currencies.RUB = {
    name: "Russian Ruble",
    sign: "RUB"
}
Currencies.KZT = {
    name: "Kazahstan Tenge",
    sign: "KZT"
}

const Categories = new Object();
Categories.Eat = {
    name: "Eat",
    icon: "./assets/Eat.svg"
}
Categories.Beer = {
    name: "Beer",
    icon: "./assets/Beer.svg"
}
Categories.Bike = {
    name: "Bike",
    icon: "./assets/Bike.svg"
}
Categories.Book = {
    name: "Book",
    icon: "./assets/Book.svg"
}

class UserBalance {
    constructor(Currencies, amount, sign) {
        this.currency = Currencies;
        this.amount = amount;
        this.sign = sign;
    }
}

class Transaction {
    constructor(curSign, amount, catName, catImage) {
        this.currencySign = curSign;
        this.amount = amount;
        this.catName = catName;
        this.catImage = catImage;
    }
}

let User = {
    defaultCurrency: Currencies.USD,
    additionalCurrencies: [Currencies.RUB, Currencies.KZT],
    balance: [new UserBalance(Currencies.USD, 0, Currencies.USD.sign), new UserBalance(Currencies.RUB, 0, Currencies.RUB.sign), new UserBalance(Currencies.KZT, 0, Currencies.KZT.sign)]
}

let Transactions = [];

const mainBalanceText = document.getElementById("main-balance");
const additionalBalanceText = document.getElementById("additional-balance");
const additionalBalanceText2 = document.getElementById("additional-balance-2");
const addBalanceMenu = document.getElementById('menu-add');
const inputAddBalance = document.getElementById("amount-to-add");
const inputRemoveBalance = document.getElementById("amount-to-remove");
const textSelectedCur = document.getElementById("selected-currency");
const textSelectedCur1 = document.getElementById("selected-currency-1");
const currencySelector = document.getElementById("currency-selector");
const currencySelector1 = document.getElementById("currency-selector-1");
const categoryList = document.getElementById("category-list");
const transactionList = document.getElementById("transactions");
let selectedCurrency = Currencies.USD.sign;
let selectedCategory = Categories;

(function () {
    const mainBalance = User.balance.find((element) => element.currency == User.defaultCurrency)
    mainBalanceText.textContent = mainBalance.amount + mainBalance.currency.sign;
})();

function updateBalance() {
    const mainBalance = User.balance.find((element) => element.currency == User.defaultCurrency);
    const addBalance1 = User.balance.find((element) => element.currency == User.additionalCurrencies[0]);
    const addBalance2 = User.balance.find((element) => element.currency == User.additionalCurrencies[1]);
    mainBalanceText.textContent = mainBalance.amount + mainBalance.sign;
    additionalBalanceText.textContent = addBalance1.amount + addBalance1.sign;
    additionalBalanceText2.textContent = addBalance2.amount + addBalance2.sign;
}

function addToBalance(input) {
    User.balance.find((e) => e.sign == selectedCurrency).amount += Number(input);
    updateBalance();
    inputAddBalance.value = "";
};

function reduceBalance(amount) {
    User.balance.find((e) => e.sign == selectedCurrency).amount += Number(amount) * -1;
    updateBalance();
};

function openAddMenu() {
    addBalanceMenu.style.visibility = "visible";
}

function openCurrencySelector() {
    currencySelector.style.visibility == "hidden" ? currencySelector.style.visibility = "visible" : currencySelector.style.visibility = "hidden";
}

function openCurrencySelector1() {
    currencySelector1.style.visibility == "hidden" ? currencySelector1.style.visibility = "visible" : currencySelector1.style.visibility = "hidden";
}

function closeAddMenu() {
    addBalanceMenu.style.visibility = "hidden";
    inputAddBalance.value = "";
    closeCurrencySelector();
}

function closeCurrencySelector() {
    currencySelector.style.visibility = "hidden";
}

function closeCurrencySelector1() {
    currencySelector.style.visibility = "hidden";
}

function selectCurrency(cur) {
    textSelectedCur.textContent = cur;
    textSelectedCur1.textContent = cur;
    selectedCurrency = cur;
    selectedCurrency1 = cur;
    closeCurrencySelector();
    closeCurrencySelector1();
}

function drawCurrencies(curs) {
    for (let i = 0; i < Object.keys(curs).length; i++) {
        const newDiv = document.createElement("div");
        const newText = document.createElement("p");
        const currencyValue = Object.values(curs).at(i);
        newDiv.appendChild(newText);
        newText.textContent = Object.values(curs).at(i).sign;
        currencySelector.appendChild(newDiv);
        newDiv.style = "height: 33px; display: flex; justify-content: center";
        newDiv.onclick = () => selectCurrency(currencyValue.sign);
        newText.style = "font-size: 24px; align-self: center; font-weight: 700";
    }
}

function drawCurrencies1(curs) {
    for (let i = 0; i < Object.keys(curs).length; i++) {
        const newDiv = document.createElement("div");
        const newText = document.createElement("p");
        const currencyValue = Object.values(curs).at(i);
        newDiv.appendChild(newText);
        newText.textContent = Object.values(curs).at(i).sign;
        currencySelector1.appendChild(newDiv);
        newDiv.style = "height: 33px; display: flex; justify-content: center";
        newDiv.onclick = () => selectCurrency(currencyValue.sign);
        newText.style = "font-size: 24px; align-self: center; font-weight: 700";
    }
}

function createTransaction(value) {
    if (inputRemoveBalance.value == "") {
        alert("Type Balance Please!")
    } else if (User.balance.find((e) => e.sign == selectedCurrency).amount - inputRemoveBalance.value < 0) {
        alert("You're broken, reduce your waste")
    } else {
        let newTrans = new Transaction(selectedCurrency, Number(inputRemoveBalance.value), value.name, value.icon);
        Transactions.push(newTrans);
        reduceBalance(inputRemoveBalance.value);
        inputRemoveBalance.value = "";
        drawTransaction(newTrans);
    }
}

(function () {
    for (let i = 0; i < Object.keys(Categories).length; i++) {
        const newCatCard = document.createElement("div");
        const newImage = document.createElement("img");
        const newCatName = document.createElement("p");
        const catValue = Object.values(Categories).at(i);
        newCatCard.appendChild(newImage);
        newCatCard.appendChild(newCatName);
        newCatName.textContent = catValue.name;
        newImage.src = catValue.icon;
        newCatCard.className = "cat-card";
        newCatName.className = "cat-name";
        newImage.className = "cat-img";
        categoryList.appendChild(newCatCard);
        newCatCard.onclick = () => createTransaction(catValue);
    };
})();

function drawTransaction(transaction) {
    const newTransactionDiv = document.createElement("div");
    const newTransactionIconName = document.createElement("div");
    const newTransactionIcon = document.createElement("img");
    const newTransactionName = document.createElement("p");
    const newTransactionAmountSign = document.createElement("p");
    newTransactionIconName.appendChild(newTransactionIcon);
    newTransactionIconName.appendChild(newTransactionName);
    newTransactionDiv.appendChild(newTransactionIconName);
    newTransactionDiv.appendChild(newTransactionAmountSign);
    newTransactionIcon.src = transaction.catImage;
    newTransactionIcon.className = "cat-img";
    newTransactionName.textContent = transaction.catName;
    newTransactionName.className = "cat-name";
    newTransactionAmountSign.textContent = transaction.amount + transaction.currencySign;
    newTransactionAmountSign.style = "font-size: 24px; font-weight:700";
    newTransactionDiv.className = "transaction";
    transactionList.appendChild(newTransactionDiv);
}

drawCurrencies(Currencies);
drawCurrencies1(Currencies);

selectCurrency(Currencies.USD.sign);