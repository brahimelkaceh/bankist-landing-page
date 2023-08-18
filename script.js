'use strict';
// ! 17/09/2022
// ! Selecting
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const scrollBtn = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const allSections = document.querySelectorAll('.section');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');
const lazyImage = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// ! Creating Elements :

// * first : Creating The Element :
const myCookie = document.createElement('div');

// * Second : Add The Class List :
myCookie.classList.add('cookie-message');

// * Third : Inserting Content To The Element :

myCookie.innerHTML = `We Used Cookies To Improved Functionality and Analitycs <button class = 'btn btn--close-cookie'> Got It ! </button> `;

// !Removing Elemnts :

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // myCookie.remove();
//     myCookie.parentElement.removeChild(myCookie);
//   });

// !Smooth Scrolling

scrollBtn.addEventListener('click', function (e) {
  const scrollingTo = section1.getBoundingClientRect();

  // ? Old Method
  // window.scrollTo({
  //   left: scrollingTo.left + window.pageXOffset,
  //   top: scrollingTo.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // ? Modern Method
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// ! Page Navigation :

// document.querySelectorAll('.nav__link').forEach(function (elem) {
//   elem.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// ? Matching Strategy
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// ! Building a Tabbed Component

// * Selecting

// * Add Event Listener To The Tab Container
tabContainer.addEventListener('click', function (e) {
  e.preventDefault();

  // * Create The  Clicked Element Variable :
  const clicked = e.target.closest('.operations__tab');

  // ? if Not Clicked Exit !!
  if (!clicked) return;

  // * Loop Over The Tabs And Remove The Active Class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // * Add Active Class To The Clicked Element
  clicked.classList.add('operations__tab--active');

  // * Loop Over The Content And Remove The Active One
  tabsContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );
  // * Select The Content That We Want To Active & Active it
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ! Hovering in Nav Bar Links
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
// ! THIS
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// ! INSTEAD OF THIS
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// ! Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// ! Modern Navigation Using Intersection Observer API
const navHieght = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHieght}px`,
});
headerObs.observe(header);

const sectionNavigation = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  sections.unobserve(entry.target);
};

const sections = new IntersectionObserver(sectionNavigation, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(interSec => {
  // interSec.classList.add('section--hidden');
  sections.observe(interSec);
});

// ! Loading Lazy Images
const loadImg = function (entries, imgs) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  imgs.unobserve(entry.target);
};
const imgs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.4,
});
lazyImage.forEach(img => {
  imgs.observe(img);
});

// ! Slider Compopnent :
const mySlider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;

  // ? We Can Find slides Lenght cuz slides is a nodelist;
  let maxSlide = slides.length - 1;

  // * Functions
  // ! Create Dots Function
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  // ! Activate Dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((sl, i) => {
      sl.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // ! How To Move To Next Slide
  const nextSlide = function () {
    if (maxSlide === curSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
    // curSlide = 0 : 0% , 100% , 200% , 300%
    // curSlide = 1 : -100% , 0% , 100% , 200%
  };

  // ! How To Move To Previous Slid
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // ! The initialization function :
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // * Event Handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // ! KeyBoard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // ! Slides With Dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
mySlider();
// /////////////////////////////////////////////
// ! The Intersection Observer API
// ? Callback Function
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// // ? Observer Options Object :

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observers = new IntersectionObserver(obsCallback, obsOptions);
// observers.observe(section1);
/*
// ! Selecting Elements

// * getElementsbyname :
const btnNames = document.getElementsByTagName('button');
// console.log(btnNames);

// * querySelector :
const header = document.querySelector('.header');
// console.log(header);

// * querySelectorAll :
const allSelector = document.querySelectorAll('.nav__link');
// console.log(allSelector);

// * getElementById
const getById = document.getElementById('section--1');
// console.log(getById);

// * getElementsByClassName
const byClassName = document.getElementsByClassName('section');
// console.log(byClassName);

// ! Creating Elements ⏫

// ! Showing Elements :
// header.prepend(myCookie);
header.append(myCookie);
// header.append(myCookie.cloneNode(true));

// header.before(myCookie);
// header.after(myCookie);

// !Removing Elemnts ⏫:

// ! Working With Styles

myCookie.style.backgroundColor = '#37383d';
myCookie.style.width = '104%';

myCookie.style.height =
  Number.parseFloat(getComputedStyle(myCookie).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');
*/
// ! 24/09/2022