/**
 * Souhrudam (സൗഹൃദം) — Official Bookstore
 * Author: Vimal Babu P. (വിമൽ ബാബു പി.)
 * 
 * Billing Flow:
 *  1. Scan QR and pay amount (₹280 if 1 book, ₹560 if both/2 books)
 *  2. Get details (Name, Ph No, Billing Address, Payment ID / UTR)
 *  3. Once user clicks Send -> Opens WhatsApp with prefilled order draft to the author
 * 
 * Default Language: Malayalam (ml) with English (en) toggle
 */

// 1. Author Configuration
const AUTHOR_WHATSAPP = "919876543210"; // Author WhatsApp number (replace with Vimal's WhatsApp)
const UPI_ID = "vimalbabup@okaxis";     // Author GPay UPI ID
let currentLang = "ml";                  // Default language: Malayalam

// 2. Books Catalog
const booksData = [
  {
    id: "book-1",
    titleMalayalam: "സെൻട്രൽ ലൈബ്രറിയിലെ സുഹൃത്ത്",
    titleEnglish: "Central Libraryile Suhruth",
    author: "വിമൽ ബാബു പി. (Vimal Babu P.)",
    price: 280,
    originalPrice: 350,
    badgeMl: "സോഷ്യൽ മീഡിയ ഏറ്റെടുത്ത പുസ്തകം",
    badgeEn: "Social Media Hit Novel",
    rating: 4.9,
    reviewsCount: 840,
    pages: 220,
    image: "assets/images/central-library.jpg",
    descMl: "സെൻട്രൽ ലൈബ്രറിയുടെ നിശബ്ദതയിൽ വിരിഞ്ഞ അസാധാരണമായ സൗഹൃദത്തിന്റെയും ആഴമേറിയ മനുഷ്യബന്ധങ്ങളുടെയും ഹൃദയസ്പർശിയായ നോവൽ. സോഷ്യൽ മീഡിയയിൽ ഏറെ ചർച്ച ചെയ്യപ്പെട്ട കൃതി.",
    descEn: "A touching novel of profound human bonding born in the quiet corridors of the Central Library. Celebrated widely across social media.",
    endorsement: {
      byMl: "ബെന്യാമിൻ (Benyamin)",
      byEn: "Benyamin",
      roleMl: "പ്രശസ്ത സാഹിത്യകാരൻ (ആടുജീവിതം രചയിതാവ്)",
      roleEn: "Acclaimed Author of Goat Days (Aadujeevitham)",
      quoteMl: "ഈ അക്ഷരങ്ങളിലൂടെ കടന്നു പോകുമ്പോൾ ശരിക്കും ഞാൻ സ്ഥലജലഭ്രമത്തിൽ പെട്ടു പോയി. തുടങ്ങിയാൽ തീരാതെ നിങ്ങൾ ഇതിന്റെ വായന അവസാനിപ്പിക്കില്ല എന്നത് എന്റെ ഉറപ്പ്..",
      quoteEn: "Passing through these words, I was genuinely captivated in wonder. I assure you that once begun, you will not put it down until the very end."
    }
  },
  {
    id: "book-2",
    titleMalayalam: "അഷ്ടദളത്തിലെ സൗഹൃദങ്ങൾ",
    titleEnglish: "Ashtadalathile Sauhridhangal",
    author: "വിമൽ ബാബു പി. (Vimal Babu P.)",
    price: 280,
    originalPrice: 350,
    badgeMl: "മധുപാൽ പ്രശംസിച്ച കൃതി",
    badgeEn: "Recommended by Madhupal",
    rating: 4.9,
    reviewsCount: 650,
    pages: 204,
    image: "assets/images/ashtadalam.jpg",
    descMl: "സൗഹൃദത്തിന്റെ എട്ട് ദളങ്ങളിലൂടെ ജീവിതത്തിന്റെ സങ്കീർണ്ണതകളും ആർദ്രതയും വരച്ചുകാട്ടുന്ന മനോഹരമായ നോവൽ. വായനക്കാരെ ജീവിതത്തിന്റെ വിസ്മയങ്ങളിലേക്ക് കൂട്ടിക്കൊണ്ടുപോകുന്ന രചന.",
    descEn: "A moving novel exploring the tender complexities of life through eight petals of friendship, guiding readers through the wonders of human existence.",
    endorsement: {
      byMl: "മധുപാൽ (Madhupal)",
      byEn: "Madhupal",
      roleMl: "സംവിധായകൻ, നടൻ, എഴുത്തുകാരൻ",
      roleEn: "Film Director, Actor & Author",
      quoteMl: "കാഴ്ചകൾ കാണുന്ന ഒരു കാണിയായി അഷ്ടദളത്തിൽ ഇരിക്കുമ്പോൾ ജീവിതമെന്ന വിസ്മയം കാണും..",
      quoteEn: "Sitting within Ashtadalam as an observant spectator, you will behold the sheer wonder of life."
    }
  }
];

// 3. UI Bilingual Dictionaries (Cart, GPay & Buttons strictly English)
const i18n = {
  ml: {
    navBooks: "പുസ്തകങ്ങൾ",
    navReviews: "അഭിപ്രായങ്ങൾ",
    navHow: "ഓർഡർ ചെയ്യുന്ന വിധം",
    cartTitle: "Your Cart",
    heroBadge: "✨ ഔദ്യോഗിക സൈറ്റ് • വിമൽ ബാബു പി. (Official Site)",
    heroTitle: "ജീവിതത്തിന്റെ വിസ്മയങ്ങളും <span class='highlight'>ഹൃദയസ്പർശിയായ സൗഹൃദങ്ങളും</span>.",
    heroSubtext: "വിമൽ ബാബു പി. രചിച്ച രണ്ട് ജനപ്രിയ നോവലുകൾ — 'സെൻട്രൽ ലൈബ്രറിയിലെ സുഹൃത്ത്', 'അഷ്ടദളത്തിലെ സൗഹൃദങ്ങൾ'. ഓരോ പുസ്തകത്തിനും ₹280 മാത്രം. രണ്ട് പുസ്തകങ്ങളും ഒരുമിച്ച് വാങ്ങുമ്പോൾ സൗജന്യ ഡെലിവറി (₹560).",
    btnViewBooks: "View Books",
    btnOrderCombo: "Order Both Books (₹560 Combo)",
    heroRating: "ബെന്യാമിൻ, മധുപാൽ എന്നിവരുടെ വിശിഷ്ട നിരൂപണം",
    stat1Label: "ഓരോ പുസ്തകത്തിനും",
    stat2Label: "യഥാർത്ഥ കോപ്പികൾ",
    stat3Label: "വായനക്കാരുടെ റേറ്റിംഗ്",
    stat4Label: "ഇൻസ്റ്റന്റ് ക്യൂആർ പേയ്മെന്റ്",
    comboTitle: "പ്രത്യേക കോംബോ ഓഫർ (Special Combo)",
    comboHeading: "രണ്ട് പുസ്തകങ്ങളും ഒരുമിച്ച് വാങ്ങാം — ₹560 (Free Shipping)",
    comboSub: "'സെൻട്രൽ ലൈബ്രറിയിലെ സുഹൃത്ത്' + 'അഷ്ടദളത്തിലെ സൗഹൃദങ്ങൾ'. നിങ്ങളുടെ വീട്ടിലേക്ക് നേരിട്ടെത്തും.",
    btnComboAdd: "Add Both Books (₹560)",
    catalogLabel: "THE BOOKS • പുസ്തകങ്ങൾ",
    catalogHeading: "വിമൽ ബാബു പി. യുടെ രചനകൾ",
    catalogSub: "ഓരോ പുസ്തകത്തിനും ₹280 മാത്രം. രണ്ട് പുസ്തകങ്ങൾ വാങ്ങുമ്പോൾ സൗജന്യ ഡെലിവറി.",
    btnAddToCart: "Add to Cart",
    cartSubtotal: "Subtotal",
    cartShipping: "Shipping",
    cartTotal: "Total Amount",
    btnCheckout: "Proceed to Checkout",
    freeShippingText: "FREE DELIVERY",
    // Checkout Modal Step 1 (Scan QR)
    modalTitle: "Checkout • Souhrudam",
    step1Chip: "Step 1 of 2",
    step1Title: "Scan QR Code to Pay",
    step1Sub: "Scan using Google Pay or any UPI app to pay the exact selected amount below.",
    payableLabel: "Total Payable Amount:",
    scanHint: "Google Pay • PhonePe • Paytm • Any UPI App",
    copyBtn: "Copy ID",
    mobileGpayBtn: "📱 On mobile? Tap here to open Google Pay directly",
    btnPaidProceed: "Payment Done, Enter Details →",
    // Checkout Modal Step 2 (Get Details)
    step2Chip: "Step 2 of 2",
    step2Title: "Delivery Details & Payment Verification",
    step2Sub: "Enter your contact info, postal address, and GPay Transaction UTR number.",
    btnBackToQr: "← Back to QR",
    labelName: "Full Name *",
    labelPhone: "WhatsApp / Phone Number *",
    labelAddress: "Billing & Postal Address *",
    labelPincode: "PIN Code *",
    labelUtr: "Payment ID / GPay Transaction UTR * (12 Digits)",
    utrHint: "Enter the 12-digit UPI reference ID found on your payment receipt.",
    labelDedication: "Special Note / Message (Optional)",
    btnSendWhatsapp: "Send Order to Author via WhatsApp",
    // Step 3 (Success)
    step3Title: "Order Drafted to WhatsApp!",
    step3Sub: "Thank you! Your order details have been drafted to the author's WhatsApp. Please send your message along with the payment screenshot.",
    btnOpenWaAgain: "Open WhatsApp Again"
  },
  en: {
    navBooks: "The Books",
    navReviews: "Endorsements",
    navHow: "How to Order",
    cartTitle: "Your Cart",
    heroBadge: "✨ Official Bookstore • Vimal Babu P.",
    heroTitle: "Stories of wonder and <span class='highlight'>heartfelt human connections</span>.",
    heroSubtext: "Two popular novels written by Vimal Babu P. — 'Central Libraryile Suhruth' & 'Ashtadalathile Sauhridhangal'. Just ₹280 per book. Free delivery when you order both books together (₹560).",
    btnViewBooks: "View Books",
    btnOrderCombo: "Order Both Books (₹560 Combo)",
    heroRating: "Celebrated by prominent authors Benyamin & Madhupal",
    stat1Label: "Per Book Price",
    stat2Label: "Direct from Author",
    stat3Label: "Reader Rating",
    stat4Label: "Instant QR Payment",
    comboTitle: "Special Combo Offer",
    comboHeading: "Get Both Books Together — ₹560 (Free Shipping)",
    comboSub: "'Central Libraryile Suhruth' + 'Ashtadalathile Sauhridhangal'. Delivered directly to your home.",
    btnComboAdd: "Add Both Books (₹560)",
    catalogLabel: "THE BOOKS",
    catalogHeading: "Novels by Vimal Babu P.",
    catalogSub: "₹280 per book. Order any 2 books to enjoy Free Postal Delivery.",
    btnAddToCart: "Add to Cart",
    cartSubtotal: "Subtotal",
    cartShipping: "Shipping",
    cartTotal: "Total Amount",
    btnCheckout: "Proceed to Checkout",
    freeShippingText: "FREE DELIVERY",
    // Checkout Modal Step 1 (Scan QR)
    modalTitle: "Checkout • Souhrudam",
    step1Chip: "Step 1 of 2",
    step1Title: "Scan QR Code to Pay",
    step1Sub: "Scan using Google Pay or any UPI app to pay the exact selected amount.",
    payableLabel: "Total Payable Amount:",
    scanHint: "Google Pay • PhonePe • Paytm • Any UPI App",
    copyBtn: "Copy ID",
    mobileGpayBtn: "📱 On mobile? Tap here to open Google Pay directly",
    btnPaidProceed: "Payment Done, Enter Details →",
    // Checkout Modal Step 2 (Get Details)
    step2Chip: "Step 2 of 2",
    step2Title: "Enter Delivery Details & Payment ID",
    step2Sub: "Please enter your name, contact phone, delivery address, and GPay Transaction ID.",
    btnBackToQr: "← Back to QR",
    labelName: "Full Name *",
    labelPhone: "WhatsApp / Phone Number *",
    labelAddress: "Billing & Postal Delivery Address *",
    labelPincode: "PIN Code *",
    labelUtr: "Payment ID / GPay Transaction UTR * (12 Digits)",
    utrHint: "Enter the 12-digit UPI reference ID found on your payment receipt.",
    labelDedication: "Special Note / Message for Author (Optional)",
    btnSendWhatsapp: "Send Order to Author via WhatsApp",
    // Step 3 (Success)
    step3Title: "Order Drafted to WhatsApp!",
    step3Sub: "Thank you! Your order details have been drafted to the author's WhatsApp. Please send your message along with the payment screenshot.",
    btnOpenWaAgain: "Open WhatsApp Again"
  }
};

// 4. Shopping Cart State
let cart = [];
const FREE_SHIPPING_THRESHOLD = 0; // Free delivery on all author orders
const STANDARD_SHIPPING = 0;        // Flat rate: ₹280 for 1 book, ₹560 for both books

// 5. DOM Caching
const booksGridEl = document.getElementById("books-grid");
const cartBtnEl = document.getElementById("cart-btn");
const cartBadgeEl = document.getElementById("cart-badge");
const cartDrawerEl = document.getElementById("cart-drawer");
const drawerBackdropEl = document.getElementById("drawer-backdrop");
const closeDrawerBtnEl = document.getElementById("close-drawer-btn");
const cartItemsContainerEl = document.getElementById("cart-items-container");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartShippingEl = document.getElementById("cart-shipping");
const cartTotalEl = document.getElementById("cart-total");
const proceedCheckoutBtnEl = document.getElementById("proceed-checkout-btn");

// Checkout Modal
const modalBackdropEl = document.getElementById("modal-backdrop");
const closeModalBtnEl = document.getElementById("close-modal-btn");
const checkoutStep1El = document.getElementById("checkout-step-1");
const checkoutStep2El = document.getElementById("checkout-step-2");
const checkoutStep3El = document.getElementById("checkout-step-3");
const step1ProceedBtnEl = document.getElementById("step1-proceed-btn");
const backToQrBtnEl = document.getElementById("back-to-qr-btn");
const sendToWhatsappBtnEl = document.getElementById("send-to-whatsapp-btn");
const gpayAmountEl = document.getElementById("gpay-payable-amount");
const dynamicQrContainerEl = document.getElementById("dynamic-qr-container");
const qrItemsSummaryEl = document.getElementById("qr-items-summary");
const copyUpiBtnEl = document.getElementById("copy-upi-btn");
const upiDeepLinkEl = document.getElementById("upi-deep-link");
const toastContainerEl = document.getElementById("toast-container");

// 6. Language Switcher
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });

  const t = i18n[lang];

  // Update navbar
  const navBooks = document.getElementById("nav-books");
  if (navBooks) navBooks.textContent = t.navBooks;
  const navReviews = document.getElementById("nav-reviews");
  if (navReviews) navReviews.textContent = t.navReviews;
  const navHow = document.getElementById("nav-how");
  if (navHow) navHow.textContent = t.navHow;

  // Update Hero
  const heroBadge = document.getElementById("hero-badge");
  if (heroBadge) heroBadge.textContent = t.heroBadge;
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle) heroTitle.innerHTML = t.heroTitle;
  const heroSubtext = document.getElementById("hero-subtext");
  if (heroSubtext) heroSubtext.textContent = t.heroSubtext;
  const btnHeroBooks = document.getElementById("btn-hero-books");
  if (btnHeroBooks) btnHeroBooks.innerHTML = `${t.btnViewBooks} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
  const btnHeroCombo = document.getElementById("btn-hero-combo");
  if (btnHeroCombo) btnHeroCombo.textContent = t.btnOrderCombo;

  // Update Combo Box
  const comboChip = document.getElementById("combo-chip");
  if (comboChip) comboChip.textContent = t.comboTitle;
  const comboHeading = document.getElementById("combo-heading");
  if (comboHeading) comboHeading.textContent = t.comboHeading;
  const comboSub = document.getElementById("combo-sub");
  if (comboSub) comboSub.textContent = t.comboSub;
  const btnComboAdd = document.getElementById("btn-combo-add");
  if (btnComboAdd) btnComboAdd.innerHTML = `${t.btnComboAdd} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;

  // Update Catalog Headings
  const catalogLabel = document.getElementById("catalog-label");
  if (catalogLabel) catalogLabel.textContent = t.catalogLabel;
  const catalogHeading = document.getElementById("catalog-heading");
  if (catalogHeading) catalogHeading.textContent = t.catalogHeading;
  const catalogSub = document.getElementById("catalog-sub");
  if (catalogSub) catalogSub.textContent = t.catalogSub;

  // Re-render book cards & cart
  renderBooks();
  updateCartUI();
}

// 7. Render Books Cards
function renderBooks() {
  if (!booksGridEl) return;
  booksGridEl.innerHTML = "";

  const isMl = currentLang === "ml";
  const t = i18n[currentLang];

  booksData.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";

    const title = isMl ? book.titleMalayalam : book.titleEnglish;
    const desc = isMl ? book.descMl : book.descEn;
    const badge = isMl ? book.badgeMl : book.badgeEn;
    const endorsementBy = isMl ? book.endorsement.byMl : book.endorsement.byEn;
    const endorsementRole = isMl ? book.endorsement.roleMl : book.endorsement.roleEn;
    const endorsementQuote = isMl ? book.endorsement.quoteMl : book.endorsement.quoteEn;

    card.innerHTML = `
      <div class="book-card-cover">
        <img 
          src="${book.image}" 
          alt="${title} by Vimal Babu P." 
          class="book-real-image" 
          loading="lazy"
        />
      </div>

      <div class="book-card-body">
        <div class="book-card-tags">
          <span class="chip ${book.id === 'book-1' ? 'chip-mint' : 'chip-lavender'}">
            ${badge}
          </span>
          <span class="chip chip-lavender">⭐ ${book.rating} (${book.reviewsCount})</span>
        </div>

        <h3 class="book-card-title ${isMl ? 'malayalam-font' : ''}">${title}</h3>
        <p class="book-card-subtitle">വിമൽ ബാബു പി. &bull; ${book.pages} pp</p>
        <p class="book-card-desc ${isMl ? 'malayalam-font' : ''}">${desc}</p>

        <!-- Celebrity Endorsement Quote Box -->
        <div class="endorsement-quote-box">
          <div class="endorsement-text ${isMl ? 'malayalam-font' : ''}">"${endorsementQuote}"</div>
          <div class="endorsement-author">&mdash; ${endorsementBy} <span style="opacity: 0.7; font-weight: 400;">(${endorsementRole})</span></div>
        </div>

        <div class="book-card-footer">
          <div class="book-pricing">
            <div class="book-price">₹${book.price}</div>
            <div class="book-original-price">₹${book.originalPrice}</div>
          </div>
          <div class="book-actions">
            <button class="btn-primary add-to-cart-btn" data-id="${book.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              ${t.btnAddToCart}
            </button>
          </div>
        </div>
      </div>
    `;

    booksGridEl.appendChild(card);
  });

  // Attach button events
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const bookId = btn.getAttribute("data-id");
      addToCart(bookId);
    });
  });
}

// 8. Add to Cart & Cart Operations
function addToCart(bookId) {
  const book = booksData.find(b => b.id === bookId);
  if (!book) return;

  const existing = cart.find(i => i.id === bookId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: book.id,
      titleMalayalam: book.titleMalayalam,
      titleEnglish: book.titleEnglish,
      price: book.price,
      image: book.image,
      quantity: 1
    });
  }

  updateCartUI();
  const bookName = currentLang === "ml" ? book.titleMalayalam : book.titleEnglish;
  showToast(`"${bookName}" added to cart`);
  openCartDrawer();
}

function addComboToCart() {
  booksData.forEach(book => {
    const existing = cart.find(i => i.id === book.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: book.id,
        titleMalayalam: book.titleMalayalam,
        titleEnglish: book.titleEnglish,
        price: book.price,
        image: book.image,
        quantity: 1
      });
    }
  });

  updateCartUI();
  const comboName = currentLang === "ml" ? "രണ്ട് പുസ്തകങ്ങളുടെ കോംബോ" : "Both Books Combo";
  showToast(`"${comboName}" added to cart`);
  openCartDrawer();
}

function updateQuantity(bookId, delta) {
  const index = cart.findIndex(i => i.id === bookId);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (cartBadgeEl) cartBadgeEl.textContent = totalCount;

  if (!cartItemsContainerEl) return;
  const isMl = currentLang === "ml";
  const t = i18n[currentLang];

  if (cart.length === 0) {
    cartItemsContainerEl.innerHTML = `
      <div style="text-align: center; padding: 48px 0; color: var(--color-pencil);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 12px auto; opacity: 0.5;">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        <p style="font-weight: 600; font-size: 16px; margin-bottom: 4px; color: var(--color-ink);">
          Your cart is empty
        </p>
        <p style="font-size: 14px;">
          Select a book to place an order.
        </p>
        <button onclick="addComboToCart()" class="btn-outline" style="margin-top: 16px;">
          Add Both Books (₹560 Combo)
        </button>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = "₹0";
    if (cartShippingEl) cartShippingEl.textContent = "FREE";
    if (cartTotalEl) cartTotalEl.textContent = "₹0";
    if (proceedCheckoutBtnEl) proceedCheckoutBtnEl.disabled = true;
    return;
  }

  if (proceedCheckoutBtnEl) proceedCheckoutBtnEl.disabled = false;

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING;
  const grandTotal = subtotal + shipping;

  cartItemsContainerEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.titleMalayalam}" class="cart-item-thumb-img" />
      <div class="cart-item-info">
        <div>
          <h4 class="cart-item-title malayalam-font">
            ${item.titleMalayalam}
          </h4>
          <span class="cart-item-format">₹${item.price} each &bull; Direct from Author</span>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-stepper">
            <button class="stepper-btn" onclick="updateQuantity('${item.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="stepper-value">${item.quantity}</span>
            <button class="stepper-btn" onclick="updateQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <div style="font-weight: 600; font-size: 16px; color: var(--color-carbon);">
            ₹${item.price * item.quantity}
          </div>
        </div>
      </div>
    </div>
  `).join("");

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
  if (cartShippingEl) {
    cartShippingEl.innerHTML = `<span style="color: var(--color-mint-text); font-weight: 600;">FREE</span>`;
  }
  if (cartTotalEl) cartTotalEl.textContent = `₹${grandTotal}`;
}

// 9. Drawer Open / Close
function openCartDrawer() {
  if (cartDrawerEl && drawerBackdropEl) {
    cartDrawerEl.classList.add("open");
    drawerBackdropEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  if (cartDrawerEl && drawerBackdropEl) {
    cartDrawerEl.classList.remove("open");
    drawerBackdropEl.classList.remove("open");
    document.body.style.overflow = "";
  }
}

if (cartBtnEl) cartBtnEl.addEventListener("click", openCartDrawer);
if (closeDrawerBtnEl) closeDrawerBtnEl.addEventListener("click", closeCartDrawer);
if (drawerBackdropEl) drawerBackdropEl.addEventListener("click", closeCartDrawer);

// =========================================================================
// 10. BILLING STRUCTURE UPON CHECKOUT
//    Step 1: Scan QR Code & Pay Amount (₹280 for 1 book, ₹560 for 2/both)
//    Step 2: Get details (Name, Ph No, Billing Address, Payment ID)
//    Step 3: Once clicks Send -> draft to Author WhatsApp
// =========================================================================

function generateUPIQRCode(amount, note) {
  if (!dynamicQrContainerEl) return;

  // Format UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("Vimal Babu P")}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  try {
    // Check if qrcode library is available
    if (typeof qrcode !== "undefined") {
      const qr = qrcode(0, 'M');
      qr.addData(upiUri);
      qr.make();
      // Generate SVG tag with 5px cell size
      dynamicQrContainerEl.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 4 });
    } else {
      // Direct SVG fallback
      dynamicQrContainerEl.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}" 
             alt="Scan to pay ₹${amount}" style="width: 200px; height: 200px; display: block;" />
      `;
    }
  } catch (err) {
    console.error("QR Code generation error:", err);
  }

  // Update deep-link for mobile users
  if (upiDeepLinkEl) {
    upiDeepLinkEl.setAttribute("href", upiUri);
  }
}

function openCheckoutModal() {
  closeCartDrawer();
  if (cart.length === 0) {
    showToast(currentLang === "ml" ? "ദയവായി പുസ്തകം തെരഞ്ഞെടുക്കുക" : "Please add a book to cart first.");
    return;
  }

  if (modalBackdropEl) {
    modalBackdropEl.classList.add("open");
    document.body.style.overflow = "hidden";
    showCheckoutStep(1);
  }
}

function closeCheckoutModal() {
  if (modalBackdropEl) {
    modalBackdropEl.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function calculateCurrentTotal() {
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING;
  return subtotal + shipping;
}

function showCheckoutStep(stepNumber) {
  if (checkoutStep1El) checkoutStep1El.style.display = stepNumber === 1 ? "flex" : "none";
  if (checkoutStep2El) checkoutStep2El.style.display = stepNumber === 2 ? "flex" : "none";
  if (checkoutStep3El) checkoutStep3El.style.display = stepNumber === 3 ? "flex" : "none";

  const isMl = currentLang === "ml";
  const totalAmount = calculateCurrentTotal();
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // STEP 1: SCAN QR CODE FIRST
  if (stepNumber === 1) {
    if (gpayAmountEl) gpayAmountEl.textContent = `₹${totalAmount}`;

    // Item selection note: Book name in Malayalam, count/descriptor in English
    let itemsHtml = "";
    let upiNote = "";
    if (itemCount === 1) {
      const b = cart[0];
      itemsHtml = `<span class="malayalam-font" style="font-weight: 600;">${b.titleMalayalam}</span> <span style="color: var(--color-pencil); font-size: 13px; margin-left: 6px;">(1 Book)</span>`;
      upiNote = `${b.titleEnglish} 1 Book`;
    } else if (itemCount === 2 && cart.length === 2) {
      itemsHtml = `<span class="malayalam-font" style="font-weight: 600;">${cart[0].titleMalayalam} + ${cart[1].titleMalayalam}</span> <span style="color: var(--color-pencil); font-size: 13px; margin-left: 6px;">(2 Books Combo)</span>`;
      upiNote = `2 Books Combo`;
    } else if (cart.length === 1 && itemCount > 1) {
      itemsHtml = `<span class="malayalam-font" style="font-weight: 600;">${cart[0].titleMalayalam}</span> <span style="color: var(--color-pencil); font-size: 13px; margin-left: 6px;">(${itemCount} Copies)</span>`;
      upiNote = `${cart[0].titleEnglish} ${itemCount} Copies`;
    } else {
      const names = cart.map(i => i.titleMalayalam + (i.quantity > 1 ? ` (${i.quantity})` : "")).join(" + ");
      itemsHtml = `<span class="malayalam-font" style="font-weight: 600;">${names}</span> <span style="color: var(--color-pencil); font-size: 13px; margin-left: 6px;">(${itemCount} Books)</span>`;
      upiNote = `${itemCount} Books`;
    }

    if (qrItemsSummaryEl) {
      qrItemsSummaryEl.innerHTML = `
        <div style="display: flex; align-items: baseline; flex-wrap: wrap;">
          ${itemsHtml}
        </div>
        <strong style="color: var(--color-signal-blue); font-size: 15px; margin-left: 12px; white-space: nowrap;">₹${totalAmount}</strong>
      `;
    }

    // Generate dynamic QR code according to selection: ₹280 or ₹560
    generateUPIQRCode(totalAmount, `Souhrudam Order ${upiNote}`);
  }

  // STEP 2: SUMMARY CONFIRMATION
  if (stepNumber === 2) {
    const amountBadge = document.getElementById("details-step-amount-badge");
    if (amountBadge) {
      amountBadge.textContent = `Amount Paid: ₹${totalAmount}`;
    }
  }
}

// Event: Step 1 Proceed -> Move to Step 2 Details Form
if (step1ProceedBtnEl) {
  step1ProceedBtnEl.addEventListener("click", () => {
    showCheckoutStep(2);
  });
}

// Event: Step 2 Back -> Return to QR Code
if (backToQrBtnEl) {
  backToQrBtnEl.addEventListener("click", () => {
    showCheckoutStep(1);
  });
}

// Security helper: Input sanitizer to prevent XSS and payload injections
function sanitizeText(str, maxLength = 250) {
  if (!str || typeof str !== 'string') return '';
  // Strip null bytes, unprintable control characters, and trim length
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

// Event: Step 2 Submit -> Save Details & Draft to Author WhatsApp
let lastOrderPayload = {};

if (sendToWhatsappBtnEl) {
  sendToWhatsappBtnEl.addEventListener("click", (e) => {
    e.preventDefault();

    const rawName = document.getElementById("cust-name")?.value || "";
    const rawPhone = document.getElementById("cust-phone")?.value || "";
    const rawAddress = document.getElementById("cust-address")?.value || "";
    const rawPincode = document.getElementById("cust-pincode")?.value || "";
    const rawUtr = document.getElementById("gpay-utr")?.value || "";
    const rawDedication = document.getElementById("cust-dedication")?.value || "";

    const name = sanitizeText(rawName, 60);
    const phone = sanitizeText(rawPhone, 20);
    const address = sanitizeText(rawAddress, 250);
    const pincode = sanitizeText(rawPincode, 10);
    const utr = sanitizeText(rawUtr, 24);
    const dedication = sanitizeText(rawDedication, 200);

    // Form validation
    if (!name || name.length < 2) {
      alert("Please enter a valid Full Name.");
      document.getElementById("cust-name")?.focus();
      return;
    }

    const digitsOnlyPhone = phone.replace(/\D/g, '');
    if (!digitsOnlyPhone || digitsOnlyPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp or Phone Number.");
      document.getElementById("cust-phone")?.focus();
      return;
    }

    if (!address || address.length < 5) {
      alert("Please enter a complete Postal & Delivery Address.");
      document.getElementById("cust-address")?.focus();
      return;
    }

    if (!utr || utr.length < 6) {
      alert("Please enter the GPay Transaction ID / UPI Ref UTR number.");
      document.getElementById("gpay-utr")?.focus();
      return;
    }

    const totalAmount = calculateCurrentTotal();
    const orderId = "SHR-" + Math.floor(100000 + Math.random() * 900000);

    const itemsSummary = cart.map(i => `• ${i.titleMalayalam} (Qty: ${i.quantity})`).join("\n");

    // Formatted WhatsApp message draft to author
    const waMessageText = 
      `*📚 സൗഹൃദം (Souhrudam) - പുതിയ പുസ്തക ഓർഡർ*\n` +
      `--------------------------------\n` +
      `📦 *Order ID:* ${orderId}\n` +
      `📖 *പുസ്തകങ്ങൾ:*\n${itemsSummary}\n` +
      `💰 *അടച്ച തുക:* ₹${totalAmount} (Paid via Google Pay)\n` +
      `🔢 *Payment ID / UTR:* ${utr}\n` +
      `--------------------------------\n` +
      `👤 *പേര്:* ${name}\n` +
      `📞 *ഫോൺ:* ${phone}\n` +
      `🏠 *ഡെലിവറി വിലാസം:*\n${address}\n` +
      `📍 *PIN Code:* ${pincode || 'N/A'}\n` +
      (dedication ? `✍️ *കുറിപ്പ് / സന്ദേശം:* "${dedication}"\n` : '') +
      `--------------------------------\n` +
      `_(ഗൂഗിൾ പേ പേയ്‌മെന്റ് സ്ക്രീൻഷോട്ട് ഇതിനോടൊപ്പം അറ്റാച്ച് ചെയ്യുന്നു)_`;

    const waUrl = `https://wa.me/${AUTHOR_WHATSAPP}?text=${encodeURIComponent(waMessageText)}`;

    // Store payload for retry button
    lastOrderPayload = { orderId, waUrl, totalAmount };

    // Update Step 3 elements safely
    const orderRefEl = document.getElementById("order-reference-id");
    if (orderRefEl) orderRefEl.textContent = orderId;

    const waRetryBtn = document.getElementById("whatsapp-open-btn");
    if (waRetryBtn) {
      waRetryBtn.setAttribute("href", waUrl);
      waRetryBtn.setAttribute("rel", "noopener noreferrer");
    }

    // Clear cart and switch to confirmation step
    cart = [];
    updateCartUI();
    showCheckoutStep(3);

    // Open WhatsApp securely (prevent reverse tabnabbing)
    window.open(waUrl, "_blank", "noopener,noreferrer");
    showToast(currentLang === "ml" ? "വാട്സാപ്പ് തുറക്കുന്നു..." : "Opening WhatsApp with your order draft...");
  });
}

// Copy UPI ID button
if (copyUpiBtnEl) {
  copyUpiBtnEl.addEventListener("click", () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      showToast(currentLang === "ml" 
        ? `UPI ID "${UPI_ID}" കോപ്പി ചെയ്തു!` 
        : `UPI ID "${UPI_ID}" copied to clipboard!`);
    }).catch(() => {
      showToast(`UPI ID: ${UPI_ID}`);
    });
  });
}

// Interactive QR Code Click & Hover handling
if (dynamicQrContainerEl) {
  dynamicQrContainerEl.setAttribute("title", "Scan using Google Pay, PhonePe, Paytm, or any UPI app");
  dynamicQrContainerEl.addEventListener("click", () => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const upiLink = upiDeepLinkEl ? upiDeepLinkEl.getAttribute("href") : "";
      if (upiLink && upiLink !== "#") {
        window.location.href = upiLink;
        return;
      }
    }
    navigator.clipboard.writeText(UPI_ID).then(() => {
      showToast(`UPI ID "${UPI_ID}" copied! Scan QR to complete payment.`);
    }).catch(() => {
      showToast("Scan QR with Google Pay or any UPI app.");
    });
  });
}

// Toast notification (Centered in bottom middle)
function showToast(message) {
  if (!toastContainerEl) return;
  // Clear any existing toast so the active notification stays clean and focused in the bottom center
  toastContainerEl.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a91f0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;
  toastContainerEl.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(16px) scale(0.96)";
    toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    setTimeout(() => toast.remove(), 260);
  }, 2800);
}

// Expose functions globally for inline HTML event handlers
window.setLanguage = setLanguage;
window.addToCart = addToCart;
window.addComboToCart = addComboToCart;
window.updateQuantity = updateQuantity;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
  updateCartUI();

  // Language buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  if (proceedCheckoutBtnEl) {
    proceedCheckoutBtnEl.addEventListener("click", openCheckoutModal);
  }
  if (closeModalBtnEl) {
    closeModalBtnEl.addEventListener("click", closeCheckoutModal);
  }
});
