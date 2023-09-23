const btn = document.getElementById('menu-btn');
const overlay = document.getElementById('overlay');
const menu = document.getElementById('mobile-menu');
const burgerColor = document.getElementById('menu-btn');

btn.addEventListener('click', navToggle);
burgerColor.addEventListener('scroll', navToggle);



function navToggle() {
  btn.classList.toggle('open');
  overlay.classList.toggle('overlay-show');
  document.body.classList.toggle('stop-scrolling');
  menu.classList.toggle('show-menu');
}