// Track any button click with GA4 ecommerce events
function trackClick(buttonOrLabel, eventName) {
    // If only label string is passed, fallback to original alert + log
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
  
    const itemId = productCard.getAttribute('data-item-id');
    const itemName = productCard.getAttribute('data-item-name');
    const price = parseFloat(productCard.getAttribute('data-price'));
    const category = productCard.getAttribute('data-item-category');
  
    const item = {
      item_id: itemId,
      item_name: itemName,
      price: price,
      item_category: category,
    };
  
    switch(eventName) {
      case 'view_item':
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: { items: [item] }
        });
        break;
  
      case 'add_to_cart':
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: { items: [item] }
        });
        break;
  
      case 'purchase':
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: 'T' + new Date().getTime(),
            value: price,
            currency: 'USD',
            items: [item]
          }
        });
        break;
  
      case 'select_item':
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'select_item',
          ecommerce: { items: [item] }
        });
        break;
  
      default:
        alert("Clicked: " + eventName);
        console.log("Clicked:", eventName);
        return;
    }
  
    alert("Clicked: " + eventName + " - " + itemName);
    console.log('GA4 event pushed:', eventName, item);
  }
  
  // Handle newsletter form submission
  function submitNewsletter(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector("input[type='email']");
    const email = emailInput.value;
    alert("Subscribed with: " + email);
    console.log("Newsletter subscribed:", email);
    emailInput.value = "";
  }
  