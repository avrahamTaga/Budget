console.log('server is loading');
const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
const path = require("path");
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));
const routHelper = require('./incomes_outcomes');

function inCome(description, amount, id) {
    this.description = description;
    this.amount = amount;
    this.id = id;
}

let incomes = [];

function outCome(description, amount, id) {
    this.description = description;
    this.amount = amount;
    this.id = id;
}

let outcomes = [];

function historyPage(operation, date, description) {
    this.operation = operation;
    this.date = date;
    this.description = description;
}

let history = [
    new historyPage('post', new Date(), 'income')
]

let incomesIdCounter = 1;
let outcomesIdCounter = 1;

// ____________________________________________________________________________________get incomes/outcome

app.get('/incomes', (req, res) => {
    routHelper.handleGetArray(res, incomes);
});

app.get('/outcomes', (req, res) => {
    routHelper.handleGetArray(res, outcomes);
});

// ____________________________________________________________________________________post incomes/outcome

app.post('/incomes', (req, res) => {
    routHelper.handleCreateData(req, res, incomes, incomesIdCounter);
    incomesIdCounter++;
});

app.post('/outcomes', (req, res) => {
    routHelper.handleCreateData(req, res, outcomes, outcomesIdCounter);
    outcomesIdCounter++;
});

// ____________________________________________________________________________________delete incomes/outcome

app.delete('/incomes/:id', (req, res) => {
    routHelper.handleDeleteData(req, res, incomes);
});

app.delete('/outcomes/:id', (req, res) => {
    routHelper.handleDeleteData(req, res, outcomes);
});

app.get('/historey', (req, res) => {
    res.send(history);
})

app.get('*', (req, res) => {
    res.send('<h1 style = "color : red">404.That’s an error.<br>The requested URL / 4 was not found on this server.<br>That’ s all we know.</h1>');
})

app.listen(PORT, () => {
    console.log(`server is lisening port : ${PORT}`);
})