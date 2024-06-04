document.addEventListener('DOMContentLoaded', () => {
    const executiveForm = document.getElementById('executiveForm');
    const executiveList = document.getElementById('executiveList');
    const totalInflows = document.getElementById('totalInflows');
    const totalOutflows = document.getElementById('totalOutflows');
    const totalBalance = document.getElementById('totalBalance');
    const transactionType = document.getElementById('transactionType');
    const isTreasurerCheckbox = document.getElementById('isTreasurer');
    const searchName = document.getElementById('searchName');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let editingIndex = -1;

    function updateSummary() {
        let inflows = 0;
        let outflows = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'inflow') {
                inflows += transaction.amount;
            } else {
                outflows += transaction.amount;
            }
        });

        const balance = inflows - outflows;

        totalInflows.textContent = inflows;
        totalOutflows.textContent = outflows;
        totalBalance.textContent = balance;
    }

    function displayTransactions(filterName = '') {
        executiveList.innerHTML = '';
        transactions.forEach((transaction, index) => {
            if (transaction.name.toLowerCase().includes(filterName.toLowerCase())) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${transaction.name}</strong> (${transaction.role} - ${transaction.email})<br>
                    ${transaction.date} - ${transaction.type} - $${transaction.amount}<br>
                    Remarks: ${transaction.remarks}
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                `;
                executiveList.appendChild(li);
            }
        });
    }

    function toggleTransactionTypeOptions() {
        if (isTreasurerCheckbox.checked) {
            transactionType.querySelector('option[value="outflow"]').disabled = false;
        } else {
            transactionType.querySelector('option[value="outflow"]').disabled = true;
            transactionType.value = 'inflow';
        }
    }

    isTreasurerCheckbox.addEventListener('change', () => {
        toggleTransactionTypeOptions();
    });

    executiveForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('transactionType').value;
        const date = document.getElementById('date').value;
        const remarks = document.getElementById('remarks').value;

        const transaction = { name, email, role, amount, type, date, remarks };

        if (editingIndex > -1) {
            transactions[editingIndex] = transaction;
            editingIndex = -1;
        } else {
            transactions.push(transaction);
        }

        localStorage.setItem('transactions', JSON.stringify(transactions));

        displayTransactions();
        updateSummary();

        executiveForm.reset();
        toggleTransactionTypeOptions(); // Reset transaction type options after form submission
    });

    executiveList.addEventListener('click', (event) => {
        const target = event.target;
        const index = target.getAttribute('data-index');

        if (target.classList.contains('edit')) {
            const transaction = transactions[index];
            document.getElementById('name').value = transaction.name;
            document.getElementById('email').value = transaction.email;
            document.getElementById('role').value = transaction.role;
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('date').value = transaction.date;
            document.getElementById('remarks').value = transaction.remarks;

            isTreasurerCheckbox.checked = transaction.type === 'outflow';
            toggleTransactionTypeOptions();

            editingIndex = index;
        }

        if (target.classList.contains('delete')) {
            transactions.splice(index, 1);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            displayTransactions();
            updateSummary();
        }
    });

    searchName.addEventListener('input', () => {
        const filterName = searchName.value;
        displayTransactions(filterName);
    });

    // Initialize
    displayTransactions();
    updateSummary();
    toggleTransactionTypeOptions();
});
