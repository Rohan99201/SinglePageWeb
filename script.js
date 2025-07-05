// Utility: SHA-256 hashing for email/user ID
async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function trackClick(buttonOrLabel, eventName) {
  const button = buttonOrLabel;
  const productCard = button.closest('.product-card');
  if (!productCard) return;

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

  // Mixpanel
  // mixpanel.track(eventName, item);

  if (eventName === 'purchase') {
    mixpanel.track('purchase', {
      ...item,
      transaction_id: 'T' + Date.now(),
      value: item.price,
      currency: 'USD'
    });
  } else {
    mixpanel.track(eventName, item);
  }  

  alert(`Clicked: ${eventName} - ${item.item_name}`);
  console.log('GA4 + Mixpanel Event:', eventName, ecommerceData);
}

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

async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim().toLowerCase();
  if (!username) return;
  const hashedUserID = await sha256(username);
  const userType = "standard";

  localStorage.setItem("user", username);
  updateLoginState();
  document.getElementById("login-modal").style.display = "none";

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'user_login',
    userID_sha256: hashedUserID,
    userType: userType,
    userStatus: 'logged_in'
  });

  // Mixpanel login tracking
  mixpanel.identify(hashedUserID);
  mixpanel.people.set({
    $name: username,
    user_type: userType
  });
  mixpanel.track("user_login");

  alert(`Logged in as ${username}`);
  console.log("User login:", hashedUserID);
}

async function logoutUser() {
  const username = localStorage.getItem("user");
  const hashedUserID = username ? await sha256(username.toLowerCase()) : null;

  if (hashedUserID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'user_logout',
      userID_sha256: hashedUserID,
      userStatus: 'logged_out'
    });

    mixpanel.track("user_logout");
    mixpanel.reset();
  }

  localStorage.removeItem("user");
  updateLoginState();
}

function updateLoginState() {
  const user = localStorage.getItem("user");
  const greetingSection = document.getElementById("greeting-section");
  const welcomeMessage = document.getElementById("welcome-message");

  if (user) {
    greetingSection.style.display = "block";
    welcomeMessage.textContent = `Welcome, ${user}!`;
  } else {
    greetingSection.style.display = "none";
  }
}

function handleNavClick(label) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "navigation_click",
    nav_item: label
  });

  // mixpanel.track("navigation_click", {
  //   nav_item: label
  // });

  // console.log("navigation_click:", label);
}

function toggleLoginModal() {
  const modal = document.getElementById("login-modal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", updateLoginState);
