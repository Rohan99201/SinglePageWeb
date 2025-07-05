// GA4 Click Tracking for product actions
function trackClick(buttonOrLabel, eventName) {
  if (typeof buttonOrLabel === 'string' && !eventName) {
    alert("Clicked: " + buttonOrLabel);
    console.log("Clicked:", buttonOrLabel);
    return;
  }

  const button = buttonOrLabel;
  const productCard = button.closest('.product-card');
  if (!productCard) {
    alert("Clicked: " + eventName);
    console.log("Clicked:", eventName);
    return;
  }

  const item = {
    item_id: productCard.getAttribute('data-item-id'),
    item_name: productCard.getAttribute('data-item-name'),
    price: parseFloat(productCard.getAttribute('data-price')),
    item_category: productCard.getAttribute('data-item-category')
  };

  const ecommerceData = eventName === 'purchase'
    ? {
        transaction_id: 'T' + Date.now(),
        value: item.price,
        currency: 'USD',
        items: [item]
      }
    : { items: [item] };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ecommerce: ecommerceData
  });

  alert(`Clicked: ${eventName} - ${item.item_name}`);
  console.log('GA4 Event:', eventName, ecommerceData);
}

// Newsletter subscription handler + GA4 event
function submitNewsletter(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector("input[type='email']");
  const email = emailInput.value.trim();

  if (email) {
    alert("Subscribed with: " + email);
    console.log("Newsletter subscribed:", email);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'subscribe_newsletter',
      email: email
    });
  }

  emailInput.value = "";
}

// Login functionality with GA4 custom event
function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const userType = "standard"; // Or derive from logic later

  if (username) {
    localStorage.setItem("user", username);
    updateLoginState();

    // GA4 custom event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'user_login',
      userID: username,
      userType: userType
    });

    alert(`Logged in as ${username}`);
    console.log("User login event pushed:", { userID: username, userType });
  }
}

function logoutUser() {
  localStorage.removeItem("user");
  updateLoginState();
}

function updateLoginState() {
  const user = localStorage.getItem("user");
  const loginSection = document.getElementById("login-section");
  const greetingSection = document.getElementById("greeting-section");
  const welcomeMessage = document.getElementById("welcome-message");

  if (user) {
    loginSection.style.display = "none";
    greetingSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${user}!`;
  } else {
    loginSection.style.display = "block";
    greetingSection.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", updateLoginState);
