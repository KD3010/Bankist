'use strict';

///////////////////////////////////////
// Modal window
const loginBtn = document.querySelector('.btn--login');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

const header = document.querySelector('.header');
const message = document.createElement('div');

const buttonTopScroll = document.querySelector('.btn--scroll-to-top');

const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav__links');

const slides = document.querySelectorAll('.slide');
const buttonLeft = document.querySelector('.slider__btn--left');
const buttonRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const dotContainer = document.querySelector('.dots');
///////////////////////////////////////

// Login Page
loginBtn.addEventListener('click', function(){
  window.open("../Bankist-App/index.html", '_blank')
})


// Modal
const openModal = function (e) {
  // Preventing default
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

// Cookie message banner

message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got It!</button>`;
header.append(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());

message.style.backgroundColor = '#37383d';
message.style.width = '104.1%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// Smooth Scroll

buttonScrollTo.addEventListener('click', function (event) {
  event.preventDefault();

  // OLD SCHOOL WAY OF SMOOTH SCROLL
  /*
  const s1coord = section1.getBoundingClientRect();

  window.scrollTo({
    left : s1coord.left + window.pageXOffset,
    top : s1coord.top + window.pageYOffset,
    behavior : "smooth"
  });
  */

  section1.scrollIntoView({ behavior: 'smooth' });
});

buttonTopScroll.addEventListener('click', function (e) {
  e.preventDefault();

  header.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
// 1. Add event listener to common parent element
// 2. Determine the element where the event was originated

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Matching strategies
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;
  // Active Tag
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');

  // Acttive Content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(s => {
      if (s !== link) s.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation
// const initialTop = section1.getBoundingClientRect();

// window.addEventListener('scroll', function(e){
//   (this.scrollY > initialTop.top) ? nav.classList.add('sticky') : nav.classList.remove('sticky');
// });

// Sticky Navigation: Intersection Observer API

const headerSection = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(headerSection);

//  Reveal To The Top Button after Header Section

const revealTopScroll = function (entries) {
  const [entry] = entries;

  !entry.isIntersecting
    ? buttonTopScroll.classList.add('active')
    : buttonTopScroll.classList.remove('active');
};

const buttonObserver = new IntersectionObserver(revealTopScroll, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

buttonObserver.observe(header);

// Reveal Sections on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.3,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Images
const imageTarget = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageOvbserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
});

imageTarget.forEach(img => imageOvbserver.observe(img));

// Building Slider

// Functioning Methods
const slider = function () {
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots_dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots_dot')
      .forEach(dot => dot.classList.remove('dots_dot--active'));

    document
      .querySelector(`.dots_dot[data-slide="${slide}"]`)
      .classList.add(`dots_dot--active`);
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));
  activateDot(0);
  goToSlide(0);

  const nextSlide = function () {
    currentSlide !== slides.length - 1 ? currentSlide++ : (currentSlide = 0);
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    currentSlide !== 0 ? currentSlide-- : (currentSlide = 3);
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Event Handlers
  buttonRight.addEventListener('click', nextSlide);

  buttonLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
  });

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots_dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
