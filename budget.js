const transactionForm = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description-input");
const amountInput = document.querySelector("#amount-input");
const categoryInput = document.querySelector("#category-input");
const balanceDisplay = document.querySelector("#balance");
const transactionListContainer = document.querySelector("#transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let balance = 0;

// Load transactions from local storage and render them
if (transactions.length > 0) {
  renderTransactions(transactions);
}

// Handle form submission  ( look into the function (e) needs more understanding) : exlanation says it's  The parameter e represents the event object?
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check if editing a transaction
  const editIndex = transactionForm.dataset.editIndex;

  //creates new
  const newTransaction = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    timeStamp: new Date().toLocaleString(),
  };

  if (editIndex !== undefined) {
    // Update existing transaction
    transactions[editIndex] = newTransaction;
    delete transactionForm.dataset.editIndex; // Clear the edit index
  } else {
    // Add new transaction
    transactions.push(newTransaction);
  }
  //save the transaction amount to localstorage
  saveToLocalStorage();
  renderTransactions(transactions);

  // Reset form
  transactionForm.reset();
});

// Render transactions in the UI
function renderTransactions(transArr) {
  transactionListContainer.innerHTML = "";
  balance = 0;

  transArr.forEach((transaction, index) => {
    const transactionElement = document.createElement("div");
    transactionElement.classList.add("transaction");
    transactionElement.textContent =
      transaction.timeStamp +
      " - " + // this is a seperator that literally is representing it self
      transaction.description +
      ": $" + // this is the value in it self the currency represented as a symbol before the number
      transaction.amount.toFixed(2) +
      " (" + // start of  category label.
      transaction.category +
      ")"; // end of  category label.
    // own section to add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      // Populate the form with the existing transaction details for editing
      descriptionInput.value = transaction.description;
      amountInput.value = transaction.amount;
      categoryInput.value = transaction.category;
      transactionForm.dataset.editIndex = index; // Store the index for editing
    });
    // created button the lines under are the following functions to what button should to to delete
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      transactions.splice(index, 1);
      saveToLocalStorage();
      renderTransactions(transactions);
    });

    transactionElement.appendChild(editButton);
    transactionElement.appendChild(deleteButton);
    transactionListContainer.appendChild(transactionElement);

    // Calculate balance
    if (transaction.category === "income") {
      balance += transaction.amount; // adds amount in numbers
    } else {
      balance -= transaction.amount; // subtracts amount in numbers
    }
  });

  balanceDisplay.textContent = balance.toFixed(2); // this is the total balance displayed
}

// Save transactions to local storage
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initial render
renderTransactions(transactions);
