const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({
        id: Date.now(),
        description,
        amount
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

    transactionFormEl.reset()
};

function updateTransactionList(){
    transactionListEl.innerHTML = ""

    const sortedTransaction = [...transactions].reverse();

    sortedTransaction.forEach((transaction) => {
        if (transaction.amount > 0) {
            var transactionListInnerHTML = `
            <li class="transaction income">
                <span>
                    ${transaction.description}
                </span>
                <span style="color: #059669">
                    $${transaction.amount}
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
                </span>
            </li>
            `;
        } else if (transaction.amount < 0) {
            var transactionListInnerHTML = `
            <li class="transaction expense">
                <span>
                    ${transaction.description}
                </span>
                <span style="color: #dc2626">
                    $${transaction.amount * -1}
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
                </span>
            </li>
            `;
        }
  
        transactionListEl.insertAdjacentHTML('beforeend', transactionListInnerHTML);
    })
}

function removeTransaction(id) {
    transactions = transactions.filter(function(transaction){
        return transaction.id != id;
    })

    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

function updateSummary() {
    expense_balance = transactions.filter(transaction => transaction.amount < 0)
                        .map(transaction => transaction.amount)
    total_expense_balance = expense_balance.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    expenseAmountEl.innerText = "$" + total_expense_balance*(-1);

    income_balance = transactions.filter(transaction => transaction.amount > 0)
                        .map(transaction => transaction.amount)
    total_income_balance = income_balance.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    incomeAmountEl.innerText = "$" + total_income_balance;

    const balance = total_income_balance + total_expense_balance;
    balanceEl.innerText = "$" + balance;

    if (balance < 0) {
        balanceEl.style.color = "#dc2626";
        balanceEl.innerText = "$" + balance*(-1);
    } else if (balance > 0) {
        balanceEl.style.color = "#059669";
    }
}

updateTransactionList();
updateSummary()
