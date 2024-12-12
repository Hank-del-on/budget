const transactionForm = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description-input");
const amountInput = document.querySelector("#amount-input");
const categoryInput = document.querySelector("#category-input");
const balanceDisplay = document.querySelector("#balance");
const transactionListContainer = document.querySelector("#transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let balance = 0;

if (transactions.length > 0) {
  renderTransactions(transactions);
}

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTransaction = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    timeStamp: new Date().toLocaleString(),
  };

  transactions.push(newTransaction);
  saveToLocalStorage();
  renderTransactions(transactions);

  // Reset form
  transactionForm.reset();
});

function renderTransactions(transArr) {
  transactionListContainer.innerHTML = "";
  balance = 0;

  transArr.forEach((transaction, index) => {
    const transactionElement = document.createElement("div");
    transactionElement.classList.add("transaction");
    transactionElement.textContent = `${transaction.timeStamp} - ${
      transaction.description
    }: $${transaction.amount.toFixed(2)} (${transaction.category})`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      transactions.splice(index, 1);
      saveToLocalStorage();
      renderTransactions(transactions);
    });

    transactionElement.appendChild(deleteButton);
    transactionListContainer.appendChild(transactionElement);

    // Calculate balance
    if (transaction.category === "income") {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }
  });

  balanceDisplay.textContent = balance.toFixed(2);
}

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initial render
renderTransactions(transactions);
