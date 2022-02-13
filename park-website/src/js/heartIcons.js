///// HEART icons & order based on HEARTS

const heartIcons = document.querySelectorAll('.icon-heart');
const homeCardEls = document.querySelectorAll('.card');
const hotelEls = document.querySelectorAll('.hotel');
const numberOfSections = 3;
const numberOfHotels = heartIcons.length / numberOfSections;

function toggleMatchingHeartIcons(idx) {
  const clickedOnInput = heartIcons[idx].tagName === 'INPUT';
  let position = idx % numberOfHotels;

  // user.favoriteHotels[position] = !user.favoriteHotels[position];
  for (let i = 0; i < numberOfSections; i++) {
    heartIcons[position].classList.toggle('icon-heart--active');
    if (!clickedOnInput && heartIcons[position].tagName === 'INPUT') {
      heartIcons[position].checked = !heartIcons[position].checked;
    }
    position += numberOfHotels;
  }
}

function sortCards(idx) {
  const position = idx % numberOfHotels;

  if (heartIcons[position].classList.contains('icon-heart--active')) {
    homeCardEls[position].style.order = '2';
    hotelEls[position].style.order = '2';
  } else {
    homeCardEls[position].style.order = '3';
    hotelEls[position].style.order = '3';
  }
}

// function loadHearts() {
//   user.favoriteHotels.forEach((hot, idx) => {
//     if (
//       (hot && !heartIcons[idx].classList.contains('icon-heart--active')) ||
//       (!hot && heartIcons[idx].classList.contains('icon-heart--active'))
//     ) {
//       heartIcons[idx].click();
//     }
//   });
// }

export function initHeartIcons() {
  heartIcons.forEach((icon, idx) => {
    icon.addEventListener('click', () => {
      toggleMatchingHeartIcons(idx);
      sortCards(idx);
      // iconToast(icon);
      // updateUsersDB();
    });
  });
}
