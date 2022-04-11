'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//--------display UI---------

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  mov.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const display = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${movement}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', display);
  });
};
//displayMovements(account1.movements);

// -------- Display balance -----------

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);
  //console.log(balance);
  labelBalance.textContent = `${acc.balance}€`;
};
//calcDisplayBalance(account1.movements);

//----------displaying user summary -----------

const calcDisplaySummary = function (cacc) {
  const income = cacc.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${income}€`;

  const out = cacc.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = cacc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * cacc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
//calcDisplaySummary(account1.movements);

/*-------creating username------------------*/
//const accounts = [account1, account2, account3, account4];

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);
//console.log(accounts);

//--------update UI------------
const displayUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//---------login------------
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // it prevents the default settings here we used to prevent auto refresh/reload
  e.preventDefault();
  currentAccount = accounts.find(function (accs) {
    return accs.username === inputLoginUsername.value;
  });
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    displayUI(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    alert('invalid credentials');
  }
});

//-------transfer money---------------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  if (
    amount > 0 &&
    receverAcc &&
    currentAccount.balance >= amount &&
    receverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receverAcc.movements.push(amount);
    displayUI(currentAccount);
  }
});

//-----------request loan---------------

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  console.log(amount);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    displayUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//-----------close account---------------

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

//-------------sorting-----------------
let sorted = false; //this trick is called state variable i mean current state of sorted
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/*
const deposit = account1.movements.filter(mov => mov > 0);
const withdrawals = account1.movements.filter(mov => mov < 0);
console.log(deposit, withdrawals);
*/
//---------- challenge using forEach method --------------------
//challenge 1
/*
const juliaDogs = [3, 5, 2, 12, 7];
const kateDogs = [4, 1, 15, 8, 3];

const checkDogs = function (juliaArr, kateArr) {
  const JuliaCopy = juliaArr.slice();
  const finalArray = [...(JuliaCopy.slice(1,-2)), ...kateArr];
  console.log(finalArray);
  finalArray.forEach(function (age, i) {
    console.log(
      age > 3
        ? `Dog number ${i + 1} is an adult, and is ${age} years age`
        : `Dog number ${i + 1} is still a puppy`
    );
  });
};
checkDogs(juliaDogs, kateDogs); 
*/
/*
const eurToUsd = 1.1;

const movementsUSD = account1 .movements
.map(mov => mov * eurToUsd);
console.log(movementsUSD);
*/

//---------- challenge using map/filter/reduce methods -------------------
//challenge 2
/*
const calcAverageHumanAge = function (ages) {
  const x =
    ages
      .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
      .filter(dogage => dogage >= 18)
      .reduce((acc, age,i,arr) => acc + age/arr.length, 0);
  console.log(x);
};

//calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/

//Array's coding challenge 4
