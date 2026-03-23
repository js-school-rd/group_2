function createAnalyticsModule(transactions) {
  function getTotal() {
    let count = transactions.length;
    let sum = 0;

    let counter = function () {
      sum += transactions[count - 1];
      count--;

      if (count > 0) {
        counter()
      }
    }

    counter();

    return sum;
  }

  function getUniqueCategories() {
    let uniqueCategories = new Set();

    transactions.forEach(transaction => uniqueCategories.add(transaction.category))

    return [...uniqueCategories];
  }

  function groupByDate() {
    function dateToString(date) {
      return (new Date(date).toISOString().slice(0, 10))
    }

    let uniqueDates = [...new Set(transactions.map(transaction => { return dateToString(transaction.date) }))];

    return new Map(
      uniqueDates.map(date => {
        return [date, transactions.filter(transaction => dateToString(transaction.date) === date)];
      })
    )
  }

  function getTotalByCategory() {
    let uniqueCategories = [...new Set(transactions.map(transaction => { return transaction.category.name }))];

    return new Map(
      uniqueCategories.map(category => {
        return [category,
          transactions.filter(transaction => transaction.category.name === category).reduce((sum, transaction) => sum + transaction.amount, 0) / 1000
        ];
      })
    )
  }

  function filterByCategory(categoryName) {
    return function (transaction) {
      transaction.category.name === categoryName;
    }
  }

  function addTransaction(tx) {

  }
}