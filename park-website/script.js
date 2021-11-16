'use strict';

console.log(`Hi there! Your account details are stored only in the local storage of your browser.
You can delete it by typing "localStorage.clear()" in the console.`);

document.addEventListener('DOMContentLoaded', ready);

function ready() {
  // HEART icons

  const cardHearts = document.querySelectorAll('.card__icon-heart');

  cardHearts.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('card__icon-heart--active');
      card.classList.contains('card__icon-heart--active')
        ? createNotification('Marked as favorite', 'success')
        : createNotification('Removed from favorites', 'info');
    });
  });

  // TOAST NOTIFICATIONS
  // const button = cardHearts[0];
  const toasts = document.querySelector('.toasts');
  const messages = [
    'Message One',
    'Message Two',
    'Message Three',
    'Message Four',
  ];
  const types = ['info', 'success', 'error'];

  function getRandomMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  function getRandomType() {
    return types[Math.floor(Math.random() * types.length)];
  }

  // button.addEventListener('click', () => createNotification());

  function createNotification(message = null, type = null) {
    const notification = document.createElement('div');
    notification.classList.add('toast');
    notification.classList.add(type ? type : getRandomType());
    notification.innerText = message ? message : getRandomMessage();
    toasts.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  /////////////////////////

  ///// ACCOUNT /////
  // animation for labels
  const labels = document.querySelectorAll('.account-card__form label');

  labels.forEach(label => {
    label.innerHTML = label.innerText
      .split('')
      .map(
        (letter, idx) =>
          `<span style="transition-delay:${idx * 30}ms">${letter}</span>`
      )
      .join('');
  });

  const cards = document.querySelectorAll('.account-card__side');
  const testBtn = document.querySelector('.testing');
  let counter = 0;
  const rotations = [0, 1, 1];
  const sidesNum = cards.length / 2;

  rotateCards(cards, rotations);
  testBtn.addEventListener('click', () => {
    rotations[counter]++;
    rotations[counter + sidesNum]++;
    counter++;
    if (counter > 2) counter = 0;
    rotations[counter]++;
    rotations[counter + sidesNum]++;
    console.log(counter);
    rotateCards(cards, rotations);
  });

  function rotateCards(cards, rotations) {
    cards.forEach((card, idx) => {
      card.style.transform = `rotateY(${rotations[idx % sidesNum] * 180}deg)`;
    });
  }

  const activateLoginBtn = document.querySelector(
    '.account-card__activate-login'
  );
  const activateSignupBtn = document.querySelector(
    '.account-card__activate-signup'
  );

  activateLoginBtn.addEventListener('click', e => {
    e.preventDefault();
    if (rotations[0] % 2) {
      rotations[0]++;
      rotations[0 + sidesNum]++;
    }
    if (!(rotations[1] % 2)) {
      rotations[1]++;
      rotations[1 + sidesNum]++;
    }
    if (!(rotations[2] % 2)) {
      rotations[2]++;
      rotations[2 + sidesNum]++;
    }
    rotateCards(cards, rotations);
  });

  activateSignupBtn.addEventListener('click', e => {
    e.preventDefault();
    if (rotations[1] % 2) {
      rotations[1]++;
      rotations[1 + sidesNum]++;
    }
    if (!(rotations[0] % 2)) {
      rotations[0]++;
      rotations[0 + sidesNum]++;
    }
    if (!(rotations[2] % 2)) {
      rotations[2]++;
      rotations[2 + sidesNum]++;
    }
    rotateCards(cards, rotations);
  });

  ///// LEAFLET MAP /////

  // Leaflet JS map and markers
  function createMarker(coords, text) {
    const marker = L.marker(coords).addTo(myMap);
    marker.bindPopup(`${text}`);
    return marker;
  }

  const overviewLocationBtns = document.querySelectorAll(
    '.overview__location-btn'
  );

  const locations = [
    { description: 'Park entrance & reception', coords: [49.494, 18.472] },
    { description: 'Ursa Major Cabins', coords: [49.495, 18.426] },
    { description: 'Spruce Cabins', coords: [49.5, 18.45] },
    { description: 'Fire Cabins', coords: [49.481, 18.456] },
    { description: 'Bear Meadow Campground', coords: [49.498, 18.457] },
    { description: 'Leadfoot Campground', coords: [49.485, 18.467] },
    { description: 'Lakeside Campground', coords: [49.509, 18.426] },
  ];

  const myMap = L.map('mapid').setView(locations[0].coords, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);

  const markerEntrance = createMarker(
    locations[0].coords,
    locations[0].description
  );
  markerEntrance._icon.classList.add('entranceIcon');

  overviewLocationBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      createMarker(
        locations[idx + 1].coords,
        locations[idx + 1].description
      ).openPopup();
      createNotification('Lodging marker is added to the map', 'info');
    });
  });
  ///////////////////////

  // RND gallery images order
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function randomizeGalleryImgs() {
    shuffle(galleryRndOrder);
    galleryImgs.forEach(function (el, idx) {
      el.src = `./img/gallery/gallery-${galleryRndOrder[idx]}.jpg`;
    });
  }

  const galleryImgs = document.querySelectorAll('.gallery__img');
  const galleryRndOrder = Array.from({ length: 25 }, (_, idx) => idx + 1);

  randomizeGalleryImgs();
  galleryImgs.forEach(el => el.addEventListener('click', randomizeGalleryImgs));

  /////////////////////////

  ///// generating random stuff /////
  // rating, number of votes
  const averageRatingEls = document.querySelectorAll('.rating__average');
  const countRatingEls = document.querySelectorAll('.rating__count');
  const ratingNumber = countRatingEls.length / 2;

  const averageRatings = [];
  const countRatings = [];

  for (let i = 0; i < ratingNumber; i++) {
    const rating = Math.floor(Math.random() * 50 + 51) / 10;
    const votes = Math.floor(Math.random() * 900 + 100);

    // same numbers for cards section and lodgings section
    averageRatingEls[i].innerText = rating;
    averageRatingEls[i + ratingNumber].innerText = rating;
    countRatingEls[i].innerText = `${votes} votes`;
    countRatingEls[i + ratingNumber].innerText = `${votes} votes`;
  }

  // BACK TO TOP BUTTON
  const toTopBtn = document.querySelector('.to-top-btn');

  function scrollFunction() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      toTopBtn.classList.remove('hidden');
    } else {
      toTopBtn.classList.add('hidden');
    }
  }

  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  window.onscroll = function () {
    scrollFunction();
  };

  toTopBtn.addEventListener('click', topFunction);
  ////////////////////////////////

  // Highlighting nav items
  const headerSection = document.getElementById('header');
  const headerNav = document.getElementById('side-nav__header');
  const aboutSection = document.getElementById('about');
  const aboutNav = document.getElementById('side-nav__about');
  const gallerySection = document.getElementById('gallery');
  const galleryNav = document.getElementById('side-nav__gallery');
  const lodgingsSection = document.getElementById('hotel');
  const lodgingsNav = document.getElementById('side-nav__hotel');

  //prettier-ignore
  const sectionsPositions = [
    { section: 'header', top: 1000, el: headerSection, nav: headerNav },
    { section: 'about', top: 1000, el: aboutSection, nav: aboutNav },
    { section: 'gallery', top: 1000, el: gallerySection, nav: galleryNav },
    { section: 'hotel', top: 1000, el: lodgingsSection, nav: lodgingsNav },
  ];
  let activeSectionIdx;

  function updateSectionPositions() {
    const tops = [];

    for (const sect of sectionsPositions) {
      sect.top = Math.trunc(sect.el.getBoundingClientRect().top);
      // I want to select the element which has the biggest top value,
      // if that top value is below 150px:
      sect.top > 150 ? tops.push(-Infinity) : tops.push(sect.top);
    }

    const currentIdx = tops.findIndex(num => num === Math.max(...tops));

    if (currentIdx !== activeSectionIdx) {
      activeSectionIdx = currentIdx;
      for (const [idx, sect] of sectionsPositions.entries()) {
        if (idx === activeSectionIdx) {
          sect.nav.classList.add('side-nav__item--active');
        } else {
          sect.nav.classList.remove('side-nav__item--active');
        }
      }
    }
  }

  document.addEventListener('scroll', updateSectionPositions);
  /////////////////////
}
