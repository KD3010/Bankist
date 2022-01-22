'use strict';

// Data
const account1 = {
  owner: 'Kushagra Devda',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 10000],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2020-07-26T12:01:20.894Z',
  ],

  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Mana Khare',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],

  currency: 'GBP',
  locale: 'en-GB',
};

// const account3 = {
//   owner: 'Aman Dargar',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Soumya Jain',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

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
const btnLogout = document.querySelector('.btn--Logout');

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

const formatDate = function (locale, date) {
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

const formatNumber = function (loc, cur, val) {
  const options = {
    style: 'currency',
    currency: cur,
  };

  return new Intl.NumberFormat(loc, options).format(val);
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((foundacc, curr) => foundacc + curr, 0);
  labelBalance.innerHTML = `${formatNumber(
    acc.locale,
    acc.currency,
    acc.balance
  )}`;

  const today = new Date();
  labelDate.textContent = formatDate(acc.locale, today);
};

// displayBalance(account1.movements);

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const sortedMovements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  sortedMovements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const transactionDate = new Date(acc.movementsDates[i]);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${formatDate(
      acc.locale,
      transactionDate
    )}</div>
    <div class="movements__value">${formatNumber(
      acc.locale,
      acc.currency,
      mov
    )}</div>
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

  labelSumIn.textContent = `${formatNumber(
    account.locale,
    account.currency,
    calcDeposit
  )}`;
  labelSumOut.textContent = `${formatNumber(
    account.locale,
    account.currency,
    Math.abs(calcWithdrawal)
  )}`;
  labelSumInterest.textContent = `${formatNumber(
    account.locale,
    account.currency,
    interest
  )}`;
};

// calcDisplaySummary(account1);

// Update UI
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc);
  // Display Balance
  displayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  let time = 60 * 10;

  const timer = setInterval(() => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;
  }, 1000);

  return timer;
};

// Event Handlers
let currentAccount, timer;

// Login User
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

    // Clearing Login Inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // UI Update
    updateUI(currentAccount);
  } else console.log(`Incorrect Username/Password`);
});

// Transfer Amount
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

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
});

// Loan Sanction
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  setTimeout(() => {
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Updating the UI
      updateUI(currentAccount);
    }
  }, 5000);

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Close Account
btnClose.addEventListener('click', function (event) {
  // Remove default action
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin &&
    currentAccount.balance > 0
  ) {
    const toBeDeletedAccIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(toBeDeletedAccIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  } else {
    if (currentAccount.balance < 0) {
      console.log('You can not close account with a loan pending');
    } else console.log('Invaild Username/Password');
  }

  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});

// Logout from the account
btnLogout.addEventListener('click', () => {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
});
