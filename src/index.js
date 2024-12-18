import _ from 'lodash';
import "./styles/styles.css";

//--------------------------------------------------------------------------------------------
// ShowPage function, controlls the switching of the pages through the navbar and buttons
//--------------------------------------------------------------------------------------------
function showPage(pageId, updateHistory = true) {
  // Hide all sections
  document.querySelectorAll("section").forEach(section => {
    section.classList.remove("active");
  });

  // If pageId is "Main", activate Main, Main2, and Contact sections
  if (pageId === "Main") {
    const sectionsToActivate = ["Main", "Main2", "contact"];
    sectionsToActivate.forEach(id => {
      document.getElementById(id).classList.add("active");
    });
  } else {
    // Otherwise, activate only the selected section
    document.getElementById(pageId).classList.add("active");
  }

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Update breadcrumbs
  updateBreadcrumbs(pageId);

  // Update the browser's history state
  if (updateHistory) {
    history.pushState({ pageId }, null, `#${pageId}`);
  }
}

//--------------------------------------------------------------------------------------------
// Function to dynamically update breadcrumbs
//--------------------------------------------------------------------------------------------
function updateBreadcrumbs(currentPage) {
  const breadcrumbContainer = document.querySelector(".breadcrumb");

  if (!breadcrumbContainer) return; // If there's no breadcrumb container, skip

  // Allowed previous pages
  const allowedPages = ["Main", "view-all", "preowned", "brandnew"];

  // Get the previous page from sessionStorage
  const previousPage = sessionStorage.getItem("previousPage");

  // Check if the current page is part of allowed pages to set as the previous page
  if (allowedPages.includes(currentPage)) {
    sessionStorage.setItem("previousPage", currentPage);
  }

  // Use the previousPage stored in sessionStorage or default to "Main"
  const validPreviousPage = previousPage && allowedPages.includes(previousPage) ? previousPage : "Main";

  // Format the breadcrumb HTML
  breadcrumbContainer.innerHTML = `
    <a href="#${validPreviousPage}" id="breadcrumbPrev">${formatBreadcrumbText(validPreviousPage)}</a>
    <span> &gt; </span>
    <span id="breadcrumbCurrent" class="current-page">${formatBreadcrumbText(currentPage)}</span>
  `;

  // Add event listener for the previous page link
  const breadcrumbPrev = document.getElementById("breadcrumbPrev");
  breadcrumbPrev.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(validPreviousPage, true);
  });
}

//--------------------------------------------------------------------------------------------
// Utility function to format breadcrumb text
//--------------------------------------------------------------------------------------------
function formatBreadcrumbText(pageId) {
  switch (pageId) {
    case "Main":
      return "Home";
    case "view-all":
      return "View All";
    case "preowned":
      return "Preowned";
    case "brandnew":
      return "Brand New";
    default:
      return pageId.charAt(0).toUpperCase() + pageId.slice(1);
  }
}

// Listen for the popstate event (back/forward button)
window.addEventListener("popstate", event => {
  const state = event.state;
  if (state && state.pageId) {
    showPage(state.pageId, false); // Update UI without modifying history
  } else {
    // Fallback to default page if no state is present
    showPage("Main", false);
  }
});

// On page load, check the URL hash or fallback to the default page
window.addEventListener("load", () => {
  const pageId = location.hash.substring(1) || "Main"; // Default to Main
  showPage(pageId, false); // Initialize without updating history
});

// Expose the function globally
window.showPage = showPage

function toggleDropdown() {
  const dropdown = document.getElementById("vehicleDropdown");
  dropdown.classList.toggle("active");
}

window.toggleDropdown = toggleDropdown

//--------------------------------------------------------------------------------------------
// Contact form submission handling
//--------------------------------------------------------------------------------------------
document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formMessage = document.getElementById("form-message");

  // Basic form validation
  if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
    formMessage.textContent = "All fields are required!";
    formMessage.style.color = "red";
    return;
  }

  // Simple email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.style.color = "red";
    return;
  }

  // Show the success message
  formMessage.textContent = "Thank you for your message!";
  formMessage.style.color = "green";

  // Clear the form and reset the size of the textarea
  this.reset();
  messageInput.style.height = ""; // Reset textarea height

  // Hide the message after 3 seconds
  setTimeout(() => {
    formMessage.textContent = "";
  }, 3000);
});

//--------------------------------------------------------------------------------------------
// Email Updates submission and form validation handling 
//--------------------------------------------------------------------------------------------
document.getElementById("subscribeForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from submitting
  
  const emailInput = document.getElementById("subscribeEmail");
  const subscribeMessage = document.getElementById("subscribeMessage");
  const emailValue = emailInput.value.trim();
  
  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailValue)) {
    alert("Please enter a valid email address.");
    return;
  }
  
  // Show the success message
  subscribeMessage.classList.remove("hidden");
  subscribeMessage.textContent = "Thanks for subscribing!";
  
  // Clear the input field
  emailInput.value = "";
  
  // Hide the message after 3 seconds
  setTimeout(() => {
    subscribeMessage.classList.add("hidden");
  }, 3000);
});

//--------------------------------------------------------------------------------------------
// Maintenance Appointment form submission handling
//--------------------------------------------------------------------------------------------
document.getElementById("appointmentForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const appointmentConfirmation = document.getElementById("appointmentConfirmation");
  const optionalInput = document.getElementById("appointmentMessage");

  // Show confirmation message
  appointmentConfirmation.textContent = "Thank you for booking!";
  appointmentConfirmation.style.color = "green"; // Green color for success message
  appointmentConfirmation.classList.remove("hidden");

  // Clear the form inputs
  this.reset();
  optionalInput.style.height = ""; // Reset textarea height

  // Hide the confirmation message after 3 seconds
  setTimeout(() => {
    appointmentConfirmation.classList.add("hidden");
  }, 3000);

  // Ensure that the page stays in the Maintenance section after the form is submitted
  // document.getElementById("Maintenance").scrollIntoView({ behavior: "smooth" });
});

//--------------------------------------------------------------------------------------------
// Carousel and Filtering in ViewAll section 
//--------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel3D");
  const items = document.querySelectorAll(".carousel-item");
  const totalItems = items.length;
  let angle = 0;
  const angleIncrement = 360 / totalItems;

  // Position carousel items in a circle
  items.forEach((item, index) => {
      const rotationAngle = index * angleIncrement;
      item.style.transform = `rotateY(${rotationAngle}deg) translateZ(400px)`;
  });

  // Navigation buttons
  document.getElementById("prevButton").addEventListener("click", () => {
      angle -= angleIncrement;
      carousel.style.transform = `rotateY(${angle}deg)`;
  });

  document.getElementById("nextButton").addEventListener("click", () => {
      angle += angleIncrement;
      carousel.style.transform = `rotateY(${angle}deg)`;
  });
});

//--------------------------------------------------------------------------------------------
// TestDrive section 
//--------------------------------------------------------------------------------------------

document.getElementById('testDriveForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const message = document.createElement('p');
  message.textContent = 'Thank you for booking your test drive!';
  message.style.color = 'green';
  message.style.fontSize = '1.1rem';
  message.style.marginTop = '15px';
  this.appendChild(message);

  setTimeout(() => {
    message.remove(); // Remove the thank-you message after 3 seconds
    this.reset(); // Resets the form fields
  }, 3000);
});

//--------------------------------------------------------------------------------------------
// Compare section 
//--------------------------------------------------------------------------------------------

import teslaImage from './img/tesla3.avif';
import astonMartinImage from './img/astonmartin2.webp';
import cyberTruckImage from './img/cybertruck.avif';

const carData = {
  car1: {
    name: "Tesla Model 3",
    image: teslaImage,
    performance: "Range: 358 miles, Acceleration: 0-60 mph in 3.1 seconds",
    features: "Autopilot, 15-inch touchscreen, premium audio system",
    price: "$50,000"
  },
  car2: {
    name: "Aston Martin DBX",
    image: astonMartinImage,
    performance: "Range: 305 miles, Acceleration: 0-60 mph in 4.5 seconds",
    features: "Luxury interior, advanced safety systems, 10-inch display",
    price: "$190,000"
  },
  car3: {
    name: "Cyber Truck",
    image: cyberTruckImage,
    performance: "Range: 225 miles, Acceleration: 0-60 mph in 5.0 seconds",
    features: "Spacious cabin, 14-inch display, panoramic roof",
    price: "$60,000"
  }
};

function updateCompareDetails(carId, selectedCar) {
  const carDetails = carData[selectedCar];
  document.getElementById(`${carId}-name`).textContent = carDetails.name;
  document.getElementById(`compare-${carId}`).querySelector('img').src = carDetails.image;
  document.getElementById(`${carId}-performance`).textContent = carDetails.performance;
  document.getElementById(`${carId}-features`).textContent = carDetails.features;
  document.getElementById(`${carId}-price`).textContent = carDetails.price;
}

// Expose the function globally
window.updateCompareDetails = updateCompareDetails

//--------------------------------------------------------------------------------------------
// Checkout section 
//--------------------------------------------------------------------------------------------

//window.validateCheckoutForm = validateCheckoutForm

document.getElementById("checkoutForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const form = this;
  let isValid = true;
  
  // Validate finance options
  const finance = document.getElementById('finance');
  if (!finance || finance.value === "") {
      alert('Please select a finance option.');
      isValid = false;
  }

  // Validate color options
  const colors = document.querySelectorAll('input[name="color"]:checked');
  if (colors.length === 0) {
      alert('Please select a color.');
      isValid = false;
  }

  // Validate protection package
  const protection = document.getElementById('protection');
  if (!protection || protection.value === "") {
      alert('Please select a protection package.');
      isValid = false;
  }

  // Validate personal details
  const firstname = document.querySelector('input[name="firstname"]').value;
  const lastname = document.querySelector('input[name="lastname"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const phone = document.querySelector('input[name="phone"]').value;
  const address = document.querySelector('input[name="address"]').value;
  const address1 = document.querySelector('input[name="address2"]').value;
  const address2 = document.querySelector('input[name="address2"]').value;
  const address3 = document.querySelector('input[name="address3"]').value;
  const address4 = document.querySelector('input[name="address4"]').value;

  console.log('First Name:', firstname);  // Debugging line
  console.log('Last Name:', lastname);    // Debugging line
  console.log('Email:', email);            // Debugging line
  console.log('Phone:', phone);            // Debugging line
  console.log('Address:', address);   

  if (!firstname || !lastname || !phone) {
      alert('Please complete all personal details.');
      isValid = false;
  }

  // Validate payment method
  const payment = document.getElementById('payment');
  if (!payment || payment.value === "") {
      alert('Please select a payment method.');
      isValid = false;
  }

  if (isValid){
    const userConfirmed = confirm("Are you sure you want to place this order?");
    if (userConfirmed) {
        // Show the confirmation modal
        showThankYouModal();
        form.reset();
        document.getElementById("credit-card-fields").style.display = "none"; // Hide credit card fields
    } else {
        // Stay on the same page
        console.log("Order cancelled by user.");
        return false;
    }
  }

  return isValid; // Return the status of validity
});

//window.validateCheckoutForm = validateCheckoutForm

function showThankYouModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "block";
}

window.showThankYouModal = showThankYouModal;

function closeModal() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none";
  showPage('Main');
}

window.closeModal = closeModal;

function updateColorSelection(color) {
  document.getElementById('selectedColor').textContent = color;
}

window.updateColorSelection = updateColorSelection

import checkoutImage from './img/checkout-image.jpeg';
import checkoutImage2 from './img/checkout-image2.jpeg';
import checkoutImage3 from './img/checkout-image3.jpeg';
import checkoutImage4 from './img/checkout-image4.jpeg';
import checkoutImage5 from './img/checkout-image5.jpeg';

import redCheckout1 from './img/redTesla1.jpeg';
import redCheckout2 from './img/redTesla2.jpeg';
import redCheckout3 from './img/redTesla3.jpeg';
import redCheckout4 from './img/redTesla4.jpeg';

import blueCheckout1 from './img/blueTesla1.jpeg';
import blueCheckout2 from './img/blueTesla2.jpeg';
import blueCheckout3 from './img/blueTesla3.jpeg';
import blueCheckout4 from './img/blueTesla4.jpeg';

import whiteCheckout1 from './img/whiteTesla1.jpeg';
import whiteCheckout2 from './img/whiteTesla2.jpeg';
import whiteCheckout3 from './img/whiteTesla3.jpeg';
import whiteCheckout4 from './img/whiteTesla4.jpeg';


let blackCheckout = [checkoutImage, checkoutImage2, checkoutImage3, checkoutImage4, checkoutImage5];
let redCheckout = [redCheckout1, redCheckout2, redCheckout3, redCheckout4, checkoutImage5];
let blueCheckout = [blueCheckout1, blueCheckout2, blueCheckout3, blueCheckout4, checkoutImage5];
let whiteCheckout = [whiteCheckout1, whiteCheckout2, whiteCheckout3, whiteCheckout4, checkoutImage5];

let images = blackCheckout; // Default images are black
let currentIndex = 0; // Start with the first image

function changeImage(direction) {
    currentIndex += direction; // Increment or decrement index
    if (currentIndex >= images.length) {
        currentIndex = 0; // Loop back to first image
    } else if (currentIndex < 0) {
        currentIndex = images.length - 1; // Loop back to last image
    }
    document.getElementById('carImage').src = images[currentIndex]; // Update image source
}

// Function to switch images array while maintaining the same index
function updateSelection(color) {
  const selectedColorSpan = document.getElementById('selectedColor');
  selectedColorSpan.textContent = color; // Display selected color

  // Determine the new color array
  let newImages;
  switch (color.toLowerCase()) {
      case 'red':
          newImages = redCheckout;
          break;
      case 'blue':
          newImages = blueCheckout;
          break;
      case 'white':
          newImages = whiteCheckout;
          break;
      case 'black':
      default:
          newImages = blackCheckout; // Default to black
  }

  // Ensure `currentIndex` is within bounds of the new array
  if (currentIndex >= newImages.length) {
      currentIndex = newImages.length - 1; // Adjust if the new array is smaller
  }

  images = newImages; // Update the `images` array
  document.getElementById('carImage').src = images[currentIndex]; // Update the displayed image
}

window.changeImage = changeImage;
window.updateSelection = updateSelection;

function goBack() {
  //const referrer = document.referrer; // Get the URL of the previous page
  if (window.history.length > 1) {
    // Redirect to the referring page
    //window.location.href = referrer;
    window.history.back();
  } else {
    // If no referrer, redirect to a fallback page
    showPage("Main"); // Replace with your fallback URL
  }
}

window.goBack = goBack;

document.getElementById("payment").addEventListener("change", function () {
  const creditCardFields = document.getElementById("credit-card-fields");
  if (this.value === "credit") {
    creditCardFields.style.display = "block";
  } else {
    creditCardFields.style.display = "none";
  }
});

//--------------------------------------------------------------------------------------------
// View All section 
//--------------------------------------------------------------------------------------------
import featuredImage1 from './img/tesla3.avif';
import featuredImage2 from './img/astonmartin2.webp';
import featuredImage3 from './img/cybertruck.avif';

let featuredImages = [featuredImage1, featuredImage3, checkoutImage, checkoutImage2, checkoutImage3, checkoutImage4, checkoutImage5];
let featuredCurrentIndex = 0;

function changeFeaturedImage(direction) {
  featuredCurrentIndex += direction;
  if (featuredCurrentIndex >= featuredImages.length) {
    featuredCurrentIndex = 0;
  } else if (featuredCurrentIndex < 0) {
    featuredCurrentIndex = featuredImages.length - 1;
  }
  document.getElementById('featuredCarImage').src = featuredImages[featuredCurrentIndex];
}

// Auto-change image every 3 seconds
let autoChangeInterval = setInterval(() => {
  changeFeaturedImage(1); // Move to the next image
}, 3000); // 3000 milliseconds = 3 seconds

// Pause the auto-change when the cursor is over the image
document.getElementById('featuredCarImage').addEventListener('mouseenter', () => {
  clearInterval(autoChangeInterval);
});

// Resume the auto-change when the cursor leaves the image
document.getElementById('featuredCarImage').addEventListener('mouseleave', () => {
  autoChangeInterval = setInterval(() => {
    changeFeaturedImage(1);
  }, 3000);
});

window.changeFeaturedImage = changeFeaturedImage;

//--------------------------------------------------------------------------------------------
// Brand-new section 
//--------------------------------------------------------------------------------------------
import featuredImage4 from './img/slide-audi-A211426_web_2880.jpg';
import featuredImage5 from './img/slide-2016-Audi-S5-Sportback-Photo-by-Audi.jpg';
import featuredImage6 from './img/2017-Audi-A7-S.jpg';

let featuredImages2 = [featuredImage6, featuredImage5, featuredImage4, checkoutImage, checkoutImage2, checkoutImage3, checkoutImage4, checkoutImage5];
let featuredCurrentIndex2 = 0;

function changeFeaturedImage_brand_new(direction) {
  featuredCurrentIndex2 += direction;
  if (featuredCurrentIndex2 >= featuredImages2.length) {
    featuredCurrentIndex2 = 0;
  } else if (featuredCurrentIndex2 < 0) {
    featuredCurrentIndex2 = featuredImages2.length - 1;
  }
  document.getElementById('featuredCarImage2').src = featuredImages2[featuredCurrentIndex2];
}

// Auto-change image every 3 seconds
let autoChangeInterval2 = setInterval(() => {
  changeFeaturedImage_brand_new(1); // Move to the next image
}, 3000); // 3000 milliseconds = 3 seconds

// Pause the auto-change when the cursor is over the image
document.getElementById('featuredCarImage2').addEventListener('mouseenter', () => {
  clearInterval(autoChangeInterval2);
});

// Resume the auto-change when the cursor leaves the image
document.getElementById('featuredCarImage2').addEventListener('mouseleave', () => {
  autoChangeInterval2 = setInterval(() => {
    changeFeaturedImage_brand_new(1);
  }, 3000);
});

window.changeFeaturedImage_brand_new = changeFeaturedImage_brand_new;

//--------------------------------------------------------------------------------------------
// preowned section 
//--------------------------------------------------------------------------------------------
//import featuredImage4 from './img/slide-audi-A211426_web_2880.jpg';
//import featuredImage5 from './img/slide-2016-Audi-S5-Sportback-Photo-by-Audi.jpg';
//import featuredImage6 from './img/2017-Audi-A7-S.jpg';

let featuredImages3 = [featuredImage6, featuredImage5, featuredImage4, checkoutImage, checkoutImage2, checkoutImage3, checkoutImage4, checkoutImage5];
let featuredCurrentIndex3 = 0;

function changeFeaturedImage_preowned(direction) {
  featuredCurrentIndex3 += direction;
  if (featuredCurrentIndex3 >= featuredImages3.length) {
    featuredCurrentIndex3 = 0;
  } else if (featuredCurrentIndex3 < 0) {
    featuredCurrentIndex3 = featuredImages3.length - 1;
  }
  document.getElementById('featuredCarImage3').src = featuredImages3[featuredCurrentIndex3];
}

// Auto-change image every 3 seconds
let autoChangeInterval3 = setInterval(() => {
  changeFeaturedImage_preowned(1); // Move to the next image
}, 3000); // 3000 milliseconds = 3 seconds

// Pause the auto-change when the cursor is over the image
document.getElementById('featuredCarImage3').addEventListener('mouseenter', () => {
  clearInterval(autoChangeInterval3);
});

// Resume the auto-change when the cursor leaves the image
document.getElementById('featuredCarImage3').addEventListener('mouseleave', () => {
  autoChangeInterval3 = setInterval(() => {
    changeFeaturedImage_preowned(1);
  }, 3000);
});

window.changeFeaturedImage_preowned = changeFeaturedImage_preowned;

//--------------------------------------------------------------------------------------------
// Accessories and cart section 
//--------------------------------------------------------------------------------------------
// Accessories Data
import phoneHolderImage from './img/phone-holder.webp';
import gearsImage from './img/gears.jpg';
import chargingImage from './img/a1.webp';

import exteriorToyImage from './img/toys.webp';
import tire1 from './img/tires/tires1.jpg';
import winterTires from './img/tires/winter-tires.jpg';
import allseason from './img/tires/allseason.jpg';

import interiorDecorImage from './img/a3.webp';

const accessoriesData = [
  { id: 1, category: 'interior', img: phoneHolderImage, alt: 'Phone Holder', name: 'Phone Holder', price: 25 },
  { id: 2, category: 'exterior', img: gearsImage, alt: 'Gears', name: 'Car Gears Set', price: 40 },
  { id: 3, category: 'charging', img: chargingImage, alt: 'Charging Accessory', name: 'Charging Dock', price: 35 },
  { id: 4, category: 'tires', img: allseason, alt: 'All-Season Tires', name: 'All-Season Tires', price: 120 },
  { id: 5, category: 'interior', img: interiorDecorImage, alt: 'Interior Decor', name: 'Interior Decor', price: 15 },
  { id: 6, category: 'exterior', img: exteriorToyImage, alt: 'Exterior Toy', name: 'Exterior Toy', price: 10 },
  { id: 1, category: 'interior', img: phoneHolderImage, alt: 'Phone Holder', name: 'Phone Holder', price: 25 },
  { id: 2, category: 'exterior', img: gearsImage, alt: 'Gears', name: 'Car Gears Set', price: 40 },
  { id: 3, category: 'charging', img: chargingImage, alt: 'Charging Accessory', name: 'Charging Dock', price: 35 },
  { id: 4, category: 'tires', img: winterTires, alt: 'Winter Tires', name: 'Winter Tires', price: 120 },
  { id: 5, category: 'interior', img: interiorDecorImage, alt: 'Interior Decor', name: 'Interior Decor', price: 15 },
  { id: 6, category: 'exterior', img: exteriorToyImage, alt: 'Exterior Toy', name: 'Exterior Toy', price: 10 },
  { id: 1, category: 'interior', img: phoneHolderImage, alt: 'Phone Holder', name: 'Phone Holder', price: 25 },
  { id: 2, category: 'exterior', img: gearsImage, alt: 'Gears', name: 'Car Gears Set', price: 40 },
  { id: 3, category: 'charging', img: chargingImage, alt: 'Charging Accessory', name: 'Charging Dock', price: 35 },
  { id: 4, category: 'tires', img: tire1, alt: 'All-Season Tires', name: 'All-Season Tires', price: 120 },
  { id: 5, category: 'interior', img: interiorDecorImage, alt: 'Interior Decor', name: 'Interior Decor', price: 15 },
  { id: 6, category: 'exterior', img: exteriorToyImage, alt: 'Exterior Toy', name: 'Exterior Toy', price: 10 },
];

// Populate Accessories Grid
function populateAccessories(category) {
  const accessoriesGrid = document.getElementById('accessoriesGrid');
  accessoriesGrid.innerHTML = ''; // Clear existing items

  const filteredAccessories = category === 'all' ? accessoriesData : accessoriesData.filter(item => item.category === category);

  filteredAccessories.forEach(item => {
    const accessoryItem = `
      <div class="accessory-item-grid">
        <img src="${item.img}" alt="${item.alt}">
        <h3>${item.alt}</h3>
        <p>$${item.price}</p>
        <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
      </div>`;
    accessoriesGrid.innerHTML += accessoryItem;
  });
}

// Initial Population
populateAccessories('all');

// Filter Accessories by Category
function filterAccessories(category) {
  populateAccessories(category);
}

window.filterAccessories = filterAccessories;

// Function to update cart count
function updateCartCount() {
  const cartButton = document.querySelector('.cart-button i');
  
  // Calculate the total quantity of items in the cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Update the cart button display
  cartButton.textContent = ` (${totalItems})`;
}

function addToCart(itemName, itemPrice, itemImg, itemAlt) {
  // Check if the item already exists in the cart
  const existingItem = cart.find(item => item.name === itemName);

  if (existingItem) {
    // If the item exists, increment its quantity
    existingItem.quantity += 1;
  } else {
    // If the item doesn't exist, add it as a new entry
    cart.push({
      name: itemName,
      price: parseFloat(itemPrice),
      quantity: 1, // Default quantity is 1
      img: itemImg, // Add the image
      alt: itemAlt, // Add the alt text for the image
    });
  }

  // Update the cart count display
  updateCartCount();

  // Show a toast message
  showToast(`${itemName} has been added to the cart!`);
}

// Update the Event Listener for "Add to Cart" Buttons
document.getElementById('accessoriesGrid').addEventListener('click', (event) => {
  if (event.target.classList.contains('add-to-cart-btn')) {
    const itemName = event.target.getAttribute('data-name');
    const itemPrice = event.target.getAttribute('data-price');
    const itemImg = event.target.parentElement.querySelector('img').src; // Get the image source
    const itemAlt = event.target.parentElement.querySelector('img').alt; // Get the alt text

    // Call the updated addToCart function with all details
    addToCart(itemName, itemPrice, itemImg, itemAlt);
  }
});
// Function to show a toast message
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  // Add the toast to the document
  document.body.appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}


// CART SECTION
// State: Cart array
let cart = [];

// Function to update and display cart items dynamically
function displayCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = ''; // Clear existing items

  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty!</p>`;
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <img src="${item.img}" alt="${item.alt}" class="cart-item-image">
          <div>
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="cart-item-actions">
          <label for="quantity-${index}">Qty:</label>
          <input type="number" id="quantity-${index}" min="1" value="${item.quantity}" data-index="${index}" class="cart-item-quantity">
          <button class="remove-item-btn" data-index="${index}">Remove</button>
        </div>
      `;

      cartItemsContainer.appendChild(cartItem);
      subtotal += item.price * item.quantity;
    });
  }

  // Update subtotal in the order summary
  document.getElementById('cartSubtotal').textContent = subtotal.toFixed(2);
}

function handleQuantityChange(event) {
  if (event.target.classList.contains('cart-item-quantity')) {
    const index = parseInt(event.target.getAttribute('data-index'));
    const newQuantity = parseInt(event.target.value);

    if (newQuantity > 0) {
      cart[index].quantity = newQuantity;
    } else {
      cart[index].quantity = 1; // Prevent quantity from being zero or negative
      event.target.value = 1;
    }

    displayCartItems(); // Re-render cart items
  }
}

// Function to remove an item from the cart
function removeCartItem(event) {
  if (event.target.classList.contains('remove-item-btn')) {
    const index = parseInt(event.target.getAttribute('data-index'));

    cart.splice(index, 1); // Remove item from cart array
    displayCartItems(); // Re-render cart items
    updateCartCount();// Update the cart count display
  }
}

// Show the Cart Checkout page
function showCartPage() {
  // Hide all sections
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));

  // Show the cart checkout section
  document.getElementById('cartCheckout').classList.add('active');

  // Populate the cart with items
  displayCartItems();
}

// Navigate back to Accessories page
function showAccessoriesPage() {
  // Hide all sections
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));

  // Show Accessories section
  document.getElementById('Accessories').classList.add('active');
}

// Event Listeners
document.getElementById('cartItems').addEventListener('input', handleQuantityChange);
document.getElementById('cartItems').addEventListener('click', removeCartItem);

// Expose navigation functions globally
window.showCartPage = showCartPage;
window.showAccessoriesPage = showAccessoriesPage;
window.addToCart = addToCart;

// Form validation for accessories checkout
document.getElementById("cartCheckoutForm").addEventListener("submit", function (event) {
  event.preventDefault();

  if (cart.length === 0) {
    // Alert the user if the cart is empty
    alert("Your cart is empty! Please add items to the cart before checking out.");
    return; // Stop the form submission
  }

  const form = this;
  const name = form.querySelector('input[name="name"]');
  const email = form.querySelector('input[name="email"]');
  const address = form.querySelector('input[name="address"]');
  const city = form.querySelector('input[name="city"]');
  const province = form.querySelector('input[name="province"]');
  const postalCode = form.querySelector('input[name="postalCode"]');
  const country = form.querySelector('input[name="country"]');
  const paymentMethod = form.querySelector('#paymentMethod');
  const creditCardFields = document.getElementById("creditCardFields");

  let isValid = true;

  // Validate text fields
  [name, email, address, city, province, postalCode, country].forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = "red"; // Highlight invalid field
    } else {
      field.style.borderColor = ""; // Reset field border
    }
  });

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    isValid = false;
    email.style.borderColor = "red";
  }

  // Validate postal code (basic validation)
  const postalCodePattern = /^[A-Za-z0-9\s-]{3,10}$/;
  if (!postalCodePattern.test(postalCode.value)) {
    isValid = false;
    postalCode.style.borderColor = "red";
  }

  // Validate payment method
  if (!paymentMethod.value) {
    isValid = false;
    paymentMethod.style.borderColor = "red";
  } else {
    paymentMethod.style.borderColor = "";
  }

  // If Credit Card is selected, validate card details
  if (paymentMethod.value === "credit") {
    const creditCardNumber = form.querySelector("#creditCardNumber");
    const expiryDate = form.querySelector("#expiryDate");
    const cvc = form.querySelector("#cvc");

    // Validate credit card number
    const cardPattern = /^\d{16}$/;
    if (!cardPattern.test(creditCardNumber.value)) {
      isValid = false;
      creditCardNumber.style.borderColor = "red";
    }

    // Validate expiry date (MM/YY)
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryPattern.test(expiryDate.value)) {
      isValid = false;
      expiryDate.style.borderColor = "red";
    }

    // Validate CVC (3 digits)
    const cvcPattern = /^\d{3}$/;
    if (!cvcPattern.test(cvc.value)) {
      isValid = false;
      cvc.style.borderColor = "red";
    }
  }

  if (isValid) {
    const userConfirmed = confirm("Are you sure you want to place this order?");
    if (userConfirmed) {
      // Calculate subtotal
      const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

      // Generate receipt details
      const receiptItems = cart.map(
        (item) =>
          `<p><strong>${item.name}</strong> - ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}</p>`
      ).join("");

      // Populate modal with receipt details
      document.getElementById("modalTotal").textContent = subtotal;
      document.getElementById("modalReceiptItems").innerHTML = receiptItems;

      // Update modal with details
      document.getElementById("modalTotal").textContent = subtotal;

      // Show the modal
      showModal();

      // Clear the cart
      cart = []; // Empty the cart array
      displayCartItems(); // Update the cart display
      updateCartCount(); // Reset the cart button count

      // Reset the form
      form.reset();
      document.getElementById("creditCardFields").style.display = "none"; // Hide credit card fields
    } else {
      alert("Please correct the highlighted fields.");
    }
  } else {
    // Stay on the same page
    console.log("Order cancelled by user.");
    return false;
  }
 
});

// Function to show the modal

function showModal() {
  const modal = document.getElementById("cartCheckoutModal");
  modal.style.display = "block";
}

// Function to close the modal
function closeTheModal() {
  const modal = document.getElementById("cartCheckoutModal");
  modal.style.display = "none";

  // Optionally redirect to a specific page (e.g., home or accessories)
  showPage("Accessories");
}

window.closeTheModal = closeTheModal;

// Show/Hide Credit Card Fields
document.getElementById("paymentMethod").addEventListener("change", function () {
  const creditCardFields = document.getElementById("creditCardFields");
  if (this.value === "credit") {
    creditCardFields.style.display = "block";
  } else {
    creditCardFields.style.display = "none";
  }
});

//--------------------------------------------------------------------------------------------
// View more details section 
//--------------------------------------------------------------------------------------------






