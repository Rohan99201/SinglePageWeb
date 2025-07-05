// Utility: SHA-256 hashing for email/user ID
async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// GA4 ecommerce click tracking
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

// Newsletter subscription handler with SHA-256
async function submitNewsletter(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector("input[type='email']");
  const email = emailInput.value.trim().toLowerCase();

  if (!email) return;

  const hashedEmail = await sha256(email);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'subscribe_newsletter',
    email_sha256: hashedEmail
  });

  alert("Subscribed with email (hashed): " + hashedEmail);
  console.log("Newsletter subscribed (hashed):", hashedEmail);

  emailInput.value = "";
}

// Login with SHA-256 and user_type
async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim().toLowerCase();

  if (!username) return;

  const hashedUserID = await sha256(username);
  const userType = "standard"; // Or derive based on logic

  localStorage.setItem("user", username);
  updateLoginState();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'user_login',
    userID_sha256: hashedUserID,
    userType: userType
  });

  alert(`Logged in as ${username}`);
  console.log("User login event pushed:", { userID_sha256: hashedUserID, userType });
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
