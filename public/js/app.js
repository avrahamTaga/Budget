let year = new Date;

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let AvailableDate = document.getElementById("AvailableDate");

AvailableDate.innerText = `Available Budget in ${months[year.getMonth()]} ${year.getFullYear()}:`;

let incomes = [];
let outcomes = [];

const incomesUrl = '/incomes';
const outcomesUrl = '/outcomes';

const incomesContiner = 'incomesContiner';
const outcomesContiner = 'outcomesContiner';

let incomesSum = 0;
let outcomesSum = 0;

let showIncomesSum = document.getElementById('showIncomesSum');
let showOutomesSum = document.getElementById('showOutomesSum');
let showBalance = document.getElementById('Balance');
let showPercentage = document.getElementById('outcomesPercentage');

let userError = document.getElementById('userErrorMessage');
let errorIcon = document.getElementById('errorIcon');

const percentageBottom = [];

function getIncomes() {
    axios.get('/incomes')
        .then(function (response) {
            if (response.status == 200) {
                incomes = response.data;
                showData(incomes, incomesContiner, incomesUrl);
                incomesSum = sumOfIncomesOrOutcomes(incomes);
                showIncomesSum.innerText = `+ ${incomesSum}.00`;
                updateBalance(incomesSum, outcomesSum);
                percentageOfIncomesOutcomes(incomesSum, outcomesSum);
            } else {
                console.log('error this item not fuond');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getOutcomes() {
    axios.get('/outcomes')
        .then(function (response) {
            if (response.status == 200) {
                outcomes = response.data;
                showData(outcomes, outcomesContiner, outcomesUrl);
                outcomesSum = sumOfIncomesOrOutcomes(outcomes);
                showOutomesSum.innerText = `- ${outcomesSum}.00`;
                updateBalance(incomesSum, outcomesSum);
                percentageOfIncomesOutcomes(incomesSum, outcomesSum);
            } else {
                console.log('error this item not fuond');
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}

getIncomes();
getOutcomes();

// __________________________________________________________________________________________createIncomeOrOutcomeFun

function createIncomeOrOutcome() {
    const description = document.getElementById('incomeOrOutcomeDescription').value;
    const amount = Number(document.getElementById('incomeOrOutcomeAmount').value);
    const type = document.getElementById('type').value;
    let arrType;
    let divType;
    if ((description == '') || (amount <= 0)) {
        userError.style.display = 'block';
        return;
    }
    if (type == '/incomes') {
        arrType = incomes;
        divType = incomesContiner;

    } else {
        arrType = outcomes;
        divType = outcomesContiner;
        showData(outcomes, outcomesContiner, outcomesUrl);
    }
    axios.post(type, {
            description: description,
            amount: amount
        })
        .then(function (response) {
            if (response.status == 201) {
                if (type == '/incomes') {
                    incomes.push(response.data);
                    arrType = incomes;
                    showData(incomes, incomesContiner, incomesUrl);
                    incomesSum = sumOfIncomesOrOutcomes(incomes);
                    showIncomesSum.innerText = `+ ${incomesSum}.00`;
                    updateBalance(incomesSum, outcomesSum);
                } else {
                    outcomes.push(response.data);
                    arrType = outcomes;
                    showData(outcomes, outcomesContiner, outcomesUrl);
                    outcomesSum = sumOfIncomesOrOutcomes(outcomes);
                    showOutomesSum.innerText = `- ${outcomesSum}.00`;
                    updateBalance(incomesSum, outcomesSum);
                    percentageOfIncomesOutcomes(incomesSum, outcomesSum);
                }
                showData(arrType, divType, type);
            } else {
                console.log('error this item not fuond');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// __________________________________________________________________________________________showDataFun

function showData(array, continerDivName, urlAddress) {
    const incomesOrOutcomesContiner = document.getElementById(continerDivName);
    incomesOrOutcomesContiner.innerHTML = '';
    for (let index = 0; index < array.length; index++) {
        const incomeOrOutcomesElement = document.createElement('p');
        incomeOrOutcomesElement.classList.add("removeData")
        const element = array[index];
        incomesOrOutcomesContiner.appendChild(incomeOrOutcomesElement);
        if (continerDivName == 'incomesContiner') {
            incomeOrOutcomesElement.innerHTML = `${element.description}<span class = "deleteOutcome">+ ${element.amount}.00</span><i id="icon1" class="delete far fa-times-circle"></i><br>`;
        } else {
            incomeOrOutcomesElement.innerHTML = `${element.description}<span class = "deleteOutcome">- ${element.amount}.00</span><i id="icon1" class=" delete far fa-times-circle"></i><br>`;
        }



        incomeOrOutcomesElement.onclick = function (e) {
            if (e.target.classList.contains("delete")) 
                deleteIncomeOrOutcomeById(element.id, this, urlAddress);
            }
        }
    }


// __________________________________________________________________________________________deleteIncomeOrOutcomeByIdFun

function deleteIncomeOrOutcomeById(id, thisObject, url, number) {
    axios.delete(`${url}/${id}`)
        .then(function (response) {
            if (response.status == 200) {
                const parent = thisObject.parentElement;
                parent.removeChild(thisObject);
                if (url == '/incomes') {
                    incomes = response.data;
                    incomesSum = sumOfIncomesOrOutcomes(incomes);
                    showIncomesSum.innerText = `+ ${incomesSum}.00`;
                    updateBalance(incomesSum, outcomesSum);
                    percentageOfIncomesOutcomes(incomesSum, outcomesSum);
                    showData(incomes, incomesContiner, incomesUrl);
                } else {
                    outcomes = response.data;
                    outcomesSum = sumOfIncomesOrOutcomes(outcomes);
                    showOutomesSum.innerText = `- ${outcomesSum}.00`;
                    updateBalance(incomesSum, outcomesSum);
                    percentageOfIncomesOutcomes(incomesSum, outcomesSum);
                    showData(outcomes, outcomesContiner, outcomesUrl);
                }
            } else {
                console.log('error this item not fuond');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// __________________________________________________________________________________________sumOfIncomesOrOutcomesFun

function sumOfIncomesOrOutcomes(array) {
    let sumType = 0;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        sumType += element.amount;
    }
    return sumType;
}

// __________________________________________________________________________________________updateBalancefun

function updateBalance(incomes, outcomes) {
    showBalance.innerText = `${incomes - outcomes}.00`;
}

// __________________________________________________________________________________________percentageOfIncomesOutcomes

function percentageOfIncomesOutcomes(incomes, outcomes) {
    showPercentage.innerText = `${Math.floor((outcomes / incomes) * 100)}%`;
    if ((showPercentage.innerText == "NaN%") || (showPercentage.innerText == "Infinity%")) {
        showPercentage.innerText = `0%`;
    } else {
        showPercentage.innerText = `${Math.floor((outcomes / incomes) * 100)}%`;
    }
}

// __________________________________________________________________________________________removeUserErrorMessage

errorIcon.onclick = function () {
    userError.style.display = 'none';
}

// __________________________________________________________________________________________percentageOfAnyOutcomes

// function percentageOfAnyOutcomes(outcomes, incomesSum) {
//     for (let index = 0; index < outcomes.length; index++) {
//         const element = outcomes[index];
//         element.percentage = Math.floor((element.amount / incomesSum) * 100);
//         if (element.percentage == Infinity) {
//             element.percentage = 0;
//         }
//     } 
// }

function bottomPercentage(array) {

    // console.log(percentage[0]);

    let percent;
    console.log(array);
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        percent = Math.floor((element / incomesSum) * 100);
        // console.log(percentage[index]);

        // percentage[index].innerText = percent;
        // console.log(percentage);
        console.log(percent);
    }
}