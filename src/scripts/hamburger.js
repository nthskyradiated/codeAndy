const btn = document.getElementById('menu-btn');
const overlay = document.getElementById('overlay');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', navToggle);

document.addEventListener('astro:after-swap', () => {
  btn.classList.remove('open');
  overlay.classList.remove('overlay-show');
  document.body.classList.remove('stop-scrolling');
  menu.classList.remove('show-menu');
})

function navToggle() {
  btn.classList.toggle('open');
  overlay.classList.toggle('overlay-show');
  document.body.classList.toggle('stop-scrolling');
  menu.classList.toggle('show-menu');
}


//hamburger icon color transition on small s
const headerThreshold = 110; // Scroll threshold for changing the button color
const mediaQuery = window.matchMedia('(max-width: 768px)');
const hamburgerButton = document.querySelectorAll('.hbg'); // Replace with your actual button ID

// Function to handle scroll event
function handleScroll() {
  const scrollY = window.scrollY || window.pageYOffset;
  
  if (scrollY > headerThreshold) {
    // User scrolled past the header
    // Change button color
    hamburgerButton.forEach(span => span.style.backgroundColor = 'dimgray'); // Replace with your desired color
  } else {
    // User is back at the top
    // Revert button color to its original
    hamburgerButton.forEach(span => span.style.backgroundColor = 'whitesmoke'); // Replace with your original color
  }
}

// Function to enable or disable scroll event listener based on media query
function toggleScrollListener() {
  if (mediaQuery.matches) {
    // Screen size is 768px or less (mobile)
    window.addEventListener('scroll', handleScroll)
    hamburgerButton.forEach(span => span.style.backgroundColor = 'whitesmoke');
  } else {
    // Screen size is more than 768px (desktop)
    window.removeEventListener('scroll', handleScroll);
    // Revert button color to its original for desktop
    hamburgerButton.forEach(span => span.style.backgroundColor = 'whitesmoke'); // Replace with your original color
  }
}

// Function to initialize the behavior
function initializeBehavior() {
  // Add a listener to the media query changes
  mediaQuery.addEventListener('change', toggleScrollListener);

  // Initially, check the media query and set up the behavior
  toggleScrollListener();
}

// Call the initializeBehavior function to set up the initial behavior
initializeBehavior()