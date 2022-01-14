'use strict';

// Data
const account1 = {
  owner: 'Kushagra Devda',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Mana Khare',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Aman Dargar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Soumya Jain',
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

const createUserNames = function (acc) {
  acc.map(user => {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserNames(accounts);

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((foundacc, curr) => foundacc + curr, 0);
  labelBalance.innerHTML = `${acc.balance}€`;
};

// displayBalance(account1.movements);

const displayMovements = function (movements) {
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} €</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplaySummary = function (account) {
  const { movements, interestRate } = account;
  const calcDeposit = movements
    .filter(m => m > 0)
    .reduce((acc, curr) => acc + curr, 0);

  const calcWithdrawal = movements
    .filter(m => m < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const interest = movements
    .filter(m => m > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = `${calcDeposit}€`;
  labelSumOut.textContent = `${Math.abs(calcWithdrawal)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1);

// Update UI
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  displayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// Event Handlers

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value.toLowerCase()
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else console.log(`Incorrect Username/Password`);
});

btnTransfer.addEventListener('click', function (event) {
  // Preventing default action
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
});

btnClose.addEventListener('click', function (event) {
  // Remove default action
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const toBeDeletedAccIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(toBeDeletedAccIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  } else console.log('Invaild Username/Password');

  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUSDConversion = function (movements) {
  const euroToUsd = 1.1;
  const convertedToUSD = movements.map(mov => Math.trunc(mov * euroToUsd));

  console.log(...convertedToUSD);
};

// euroToUSDConversion(movements);

const movementsDescription = function (movements) {
  const movementDescArr = movements.map(
    (mov, i) =>
      `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} ${mov}₤`
  );
  console.log(movementDescArr);
};

// movementsDescription(movements);

const createDeposits = function(movements) {
  const deposits = movements.filter(mov => mov > 0);
  console.log(deposits);
}

// createDeposits(movements);

const createWithdrawals = function(movements) {
  const withdrawals = movements.filter(mov => mov < 0);
  console.log(withdrawals);
}

// createWithdrawals(movements);

const calculateBalance = function(movements) {
  const balance = movements.reduce((acc, cur) => acc + cur, 0);
  console.log(balance);
}

// calculateBalance(movements);

const calculateMaximum = function(movements) {
  const max = movements.reduce((acc, curr) => (acc > curr) ? acc : curr, movements[0]);
  console.log(max);
}

calculateMaximum(movements);
*/
