import userDB from './userDB.js';
import currentUser from './currentUser.js';
import { generatePwd, animateLabels } from './components.js';
import {
  createNotification,
  clearElementsValue,
  alertWrongInput,
  accSect,
} from './helper.js';
import { gotoSide, userNav, userNavLoginBtn } from './navigation.js';
import { loadHearts } from './heartIcons.js';

const labels = accSect.querySelectorAll('.account-card__form label'),
  accountCards = accSect.querySelectorAll('.account-card'),
  btnLogin = accSect.querySelector('.account-card__login'),
  btnSignup = accSect.querySelector('.account-card__signup'),
  btnLogout = accSect.querySelector('.account-card__logout'),
  helpMsg = accSect.querySelector('.account-card__help-msg'),
  btnGeneratePwd = accSect.querySelector('.account-card__generate-pwd'),
  sidesLogin = accSect.querySelectorAll('.account-card__side--login'),
  sidesSignup = accSect.querySelectorAll('.account-card__side--signup'),
  welcomeMsg = accSect.querySelector('.account-card__welcome-msg'),
  generatedPwd = accSect.querySelector('.account-card__generated-pwd'),
  lastBookingEls = accSect.querySelectorAll('.account-card__last-booking'),
  favoritesEls = accSect.querySelectorAll('.account-card__favorites'),
  showLastBookingBtn = accSect.querySelector('.account-card__booking-btn'),
  showFavoritesBtn = accSect.querySelector('.account-card__favorites-btn'),
  lastBookingInfo = accSect.querySelector('p.account-card__last-booking'),
  userNavUsername = userNav.querySelector('.user-nav__user-name');

///// common functions /////

function showAccountCards() {
  setTimeout(() => {
    accountCards.forEach(card =>
      card.classList.remove('account-card--invisible')
    );
  }, 1100);
}

function toggleUserInterface() {
  if (currentUser.username) {
    userNavLoginBtn.classList.add('hidden');
    userNav.classList.remove('hidden');

    const user = userDB.getUserInfo(currentUser.username);

    userNavUsername.innerText = user.username;
    welcomeMsg.innerText = `You're logged in as ${user.username}!
    Email address, associated with your account: ${user.email}`;
    gotoSide('settings');
  } else {
    userNavLoginBtn.classList.remove('hidden');
    userNav.classList.add('hidden');
    clearElementsValue([userNavUsername, welcomeMsg]);
    gotoSide('login');
  }
}

///// LOG IN CARDs /////

btnLogin &&
  btnLogin.addEventListener('click', e => {
    e.preventDefault();

    const [userLoginEl, pwdEl] = sidesLogin[0].querySelectorAll(
      '.account-card__form input'
    );

    if (!(userLoginEl.validity.valid && pwdEl.validity.valid)) {
      return;
    }

    const userID = userDB.getUserID(userLoginEl.value, pwdEl.value);

    if (userID === null) {
      alertWrongInput(pwdEl, 'Wrong email or password');
      helpMsg.classList.add('account-card__help-msg--active');
      return;
    }

    // save bookings made by unlogged user
    if (currentUser.username === '' && currentUser.bookings.length > 0) {
      userDB.users[userID].bookings.push(...currentUser.bookings);
    }

    currentUser.setCurrentUser(userDB.users[userID].username);
    currentUser.loadCurrentUser();

    loadHearts();
    createNotification(`Welcome back, ${currentUser.username}`, 'success');
    toggleUserInterface();
    clearElementsValue([userLoginEl, pwdEl]);
  });

///// SIGN UP CARDs /////

btnGeneratePwd &&
  btnGeneratePwd.addEventListener(
    'click',
    () => (generatedPwd.innerText = generatePwd())
  );

btnSignup &&
  btnSignup.addEventListener('click', e => {
    e.preventDefault();
    const [usernameEl, emailEl, pwdEl] = sidesSignup[0].querySelectorAll(
      '.account-card__form input'
    );

    if (
      !(
        usernameEl.validity.valid &&
        emailEl.validity.valid &&
        pwdEl.validity.valid
      )
    ) {
      return;
    }

    if (userDB.findUsername(usernameEl.value) >= 0) {
      alertWrongInput(usernameEl, 'This username is already taken');
      return;
    }

    if (userDB.findEmail(emailEl.value) >= 0) {
      alertWrongInput(emailEl, 'This email is already taken');
      return;
    }

    userDB.addUser(
      usernameEl.value,
      emailEl.value,
      pwdEl.value,
      currentUser.favoriteHotels,
      currentUser.bookings
    );

    currentUser.setCurrentUser(usernameEl.value);
    currentUser.loadCurrentUser();

    createNotification(
      `Congratulations, ${currentUser.username}, you created new account`,
      'success'
    );
    toggleUserInterface();
    clearElementsValue([usernameEl, emailEl, pwdEl]);
  });

///// SETTINGS & BOOKING CARDs /////

btnLogout &&
  btnLogout.addEventListener('click', e => {
    e.preventDefault();

    currentUser.reset();
    toggleUserInterface();
    loadHearts();
    createNotification('You are logged out', 'info');
  });

// show last booking / show favorites
function showLastBookingMsg() {
  if (!currentUser.bookings.length) {
    lastBookingInfo.innerText = `You didn't book anything yet. To make your first booking go to the BOOKING section.`;
    return;
  }

  const booking = currentUser.bookings.at(-1);
  const roomOrTent = booking.hotel.toLowerCase().includes('cabin')
    ? 'room'
    : 'tent';
  const manyOrOneHotel = booking.rooms < 2 ? '' : 's';
  const personOrPeople = booking.ppl < 2 ? 'person' : 'people';

  lastBookingInfo.innerText = `You booked ${booking.rooms} ${roomOrTent}${manyOrOneHotel} for ${booking.ppl} ${personOrPeople} in the ${booking.hotel} for ${booking.dates}.`;
}

showLastBookingBtn &&
  showLastBookingBtn.addEventListener('click', e => {
    e.preventDefault();
    showLastBookingMsg();
    favoritesEls.forEach(el => el.classList.add('hidden'));
    lastBookingEls.forEach(el => el.classList.remove('hidden'));
  });

showFavoritesBtn &&
  showFavoritesBtn.addEventListener('click', e => {
    e.preventDefault();
    favoritesEls.forEach(el => el.classList.remove('hidden'));
    lastBookingEls.forEach(el => el.classList.add('hidden'));
  });

export function initCurrentUserInterface() {
  currentUser.loadCurrentUser();
  toggleUserInterface();
  loadHearts();
  animateLabels(labels);
  showAccountCards();
}
