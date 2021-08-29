const modalElement = document.querySelector('.modal-overlay')

const Modal = {
    open(){
        modalElement.classList.add('active')
    },

    close(){
        modalElement.classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("devFinances-transactions")) || []
    },

    set(transactions){
        localStorage.setItem("devFinances-transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index,1)

        App.reload()
    },

    income (){
        // somar as entradas
        incomes = 0;
        // para cada transação
        Transaction.all.forEach((transaction) => {
            // se maior do que zero
            if( transaction.amount > 0 ) {
                // somar a uma variavel e retornar a variavel
                incomes += transaction.amount;
            }
        })

        return incomes;
    },

    expense (){
        // somar as saídas
        expenses = 0;
        // para cada transação
        Transaction.all.forEach(transaction => {
            // se menor do que zero
            if( transaction.amount < 0 ) {
                // somar a uma variavel e retornar a variavel
                expenses += transaction.amount;
            }
        })

        return expenses;
    },

    total (){
        // + com - é -
        return Transaction.income() + Transaction.expense();
    },
}

const DOM = {
        transactionsContainer: document.querySelector('#data-table tbody'),

        addTransaction(transaction, index){
            const tr = document.createElement('tr')
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
            tr.dataset.index = index

            DOM.transactionsContainer.appendChild(tr)
        },

        innerHTMLTransaction(transaction, index){
            const CSSclass = transaction.amount > 0 ? "income" : "expense"
            
            const amount = Utils.formatCurrency(transaction.amount)

            const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
            `
            return html
        },

        updateBalance(){
            document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.income())
            document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expense())
            document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
        },

        clearTransactions(){
            DOM.transactionsContainer.innerHTML = ""
        }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency (value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const { description, amount, date } = Form.getValues()

        if ( description.trim() === "" || 
             amount.trim() === "" || 
             date.trim() === "") {
                throw new Error ("Por favor, preencha todos os campos! :D")
        }
    },

    formatValues(){
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            Form.validateFields()
            // Formatar os dados para salvar
            const transaction = Form.formatValues()
            // salvar e atualizar a aplicação
            Transaction.add(transaction)
            // apagar os dados do formulário
            Form.clearFields()
            // modal feche
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    },
}

const App = {
    init(){  
        // Transaction.all.forEach (DOM.addTransaction) = podemos usar quando os argumentos das funções são os mesmos 
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
            Storage.set(Transaction.all)

        })
        
        DOM.updateBalance()
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()