let bugdet = 6000;
const transactions = [];

const inputExpence = document.getElementById("expence-amount");
const listCat = document.getElementById("list-categories");
const textBudget = document.getElementById("text-budget");
const historyScreen = document.getElementById("history");
const mainScreen = document.getElementById("main");
const showHistory = document.getElementById("show-history");
const hideHistory = document.getElementById("text-history");
const transactionList = document.getElementById("transactions");

const categories = new Object();
categories.Eat = {
  name: "Eat",
  icon: "./assets/Eat.svg",
};
categories.Beer = {
  name: "Beer",
  icon: "./assets/Beer.svg",
};
categories.Bike = {
  name: "Bike",
  icon: "./assets/Bike.svg",
};
categories.Book = {
  name: "Book",
  icon: "./assets/Book.svg",
};

function Transaction(amount, category, createdAt, meta) {
  this.amount = amount;
  this.category = category;
  this.createdAt = createdAt;
  this.meta = meta;
}

Transaction.prototype.format = function () {
  return "$" + this.amount + " " + this.category.name + " " + this.createdAt;
};

Transaction.prototype.toJSON = function () {
  return {
    amount: this.amount,
    category: this.category,
    createdAt: this.createdAt,
  };
};

const TransactionService = {
  createExpense({
    amount = Number(inputExpence.value),
    category,
    createdAt = new Date(),
    meta = {},
  } = {}) {
    if (amount > 0) {
      return new Transaction(amount, category, createdAt, meta);
    } else {
      throw new Error("АБАЛДЕЛ?");
    }
  },
};

function addTransaction(tx) {
  transactions.push(tx);
}

const HistoryScreen = {
  show() {
    mainScreen.classList.add("hidden");
    mainScreen.classList.remove("visible");
    historyScreen.classList.add("visible");
    historyScreen.classList.remove("hidden");
  },
  hide() {
    historyScreen.classList.add("hidden");
    historyScreen.classList.remove("visible");
    mainScreen.classList.add("visible");
    mainScreen.classList.remove("hidden");
  },
  render(transactions) {
    transactionList.innerHTML = "";
    Array.prototype.forEach.call(transactions, (tx) => {
      const txText = document.createElement("p");
      txText.className = "tx-text";
      txText.textContent = tx.format();
      transactionList.appendChild(txText);
    });
  },
};

function drawCategories() {
  for (let i = 0; i < Object.keys(categories).length; i++) {
    const newCatCard = document.createElement("div");
    const newImage = document.createElement("img");
    const newCatName = document.createElement("p");
    const catValue = Object.values(categories).at(i);
    newCatCard.appendChild(newImage);
    newCatCard.appendChild(newCatName);
    newCatName.textContent = catValue.name;
    newImage.src = catValue.icon;
    newCatCard.className = "cat-card";
    newCatName.className = "cat-name";
    newImage.className = "cat-img";
    listCat.appendChild(newCatCard);
    newCatCard.onclick = () => {
      try {
        addTransaction(
          TransactionService.createExpense({ category: catValue }),
        );
      } catch (error) {
        console.log(error);
      } finally {
        bugdet = bugdet - Number(inputExpence.value);
        textBudget.textContent = bugdet + "$";
        HistoryScreen.render(transactions);
        inputExpence.value = "";
      }
    };
  }
}

drawCategories();
showHistory.addEventListener("click", HistoryScreen.show);
hideHistory.addEventListener("click", HistoryScreen.hide);
HistoryScreen.hide();
