# Souhrudam (സൗഹൃദം) — Official Author Bookstore

Official bookstore website for author **Vimal Babu P. (വിമൽ ബാബു പി.)**, offering signed copies of his celebrated novels with an instant Google Pay / UPI checkout flow and direct WhatsApp order dispatching.

---

## 📚 Books Available

1. **സെൻട്രൽ ലൈബ്രറിയിലെ സുഹൃത്ത് (Central Libraryile Suhruth)**
   - Author: വിമൽ ബാബു പി. (Vimal Babu P.)
   - Price: ₹280
   - Featured Endorsement: **ബെന്യാമിൻ (Benyamin)** — *"ഈ അക്ഷരങ്ങളിലൂടെ കടന്നു പോകുമ്പോൾ ശരിക്കും ഞാൻ സ്ഥലജലഭ്രമത്തിൽ പെട്ടു പോയി. തുടങ്ങിയാൽ തീരാതെ നിങ്ങൾ ഇതിന്റെ വായന അവസാനിപ്പിക്കില്ല എന്നത് എന്റെ ഉറപ്പ്..."*

2. **അഷ്ടദളത്തിലെ സൗഹൃദങ്ങൾ (Ashtadalathile Sauhridhangal)**
   - Author: വിമൽ ബാബു പി. (Vimal Babu P.)
   - Price: ₹280
   - Featured Endorsement: **മധുപാൽ (Madhupal)** — *"കാഴ്ചകൾ കാണുന്ന ഒരു കാണിയായി അഷ്ടദളത്തിൽ ഇരിക്കുമ്പോൾ ജീവിതമെന്ന വിസ്മയം കാണും..."*

3. **Complete 2-Book Combo Set**
   - Price: ₹560 (Free Postal Delivery across India)
   - Hand-signed copies with personalized author dedication note.

---

## ⚡ Checkout & Payment Flow

1. **Cart & Selection:** Add single books (₹280) or the 2-book combo (₹560).
2. **Step 1 — Instant Google Pay QR:** Dynamic, client-side offline QR code generates exact payment amounts for UPI apps (Google Pay, PhonePe, Paytm). Mobile users can tap to launch GPay directly.
3. **Step 2 — Compact Delivery Form:** Small, clean inputs for Name, Phone, Delivery Address, PIN Code, and 12-digit UPI / GPay UTR reference number.
4. **Step 3 — Direct WhatsApp Dispatch:** Automatically formats and drafts all customer order details directly to the author's WhatsApp (`wa.me`) for instant confirmation and dispatch.

---

## 🛡️ Security & Performance Features

- **Content-Security-Policy (CSP):** Strict whitelist blocking unauthorized scripts, external iframes, and cross-site scripting (XSS).
- **Drive-by Malware & Trojan Protection:** `X-Content-Type-Options: nosniff` and `object-src 'none'`.
- **Anti-Clickjacking:** `X-Frame-Options: DENY` and `frame-ancestors 'none'`.
- **Safe External Navigation:** `rel="noopener noreferrer"` protection across all external URLs.
- **Path Traversal Shield:** Strict canonical directory resolution.
- **Mobile Optimized:** Fluid responsive design, iOS input auto-zoom prevention, bottom-sheet modal on smartphones, and touch-friendly hit targets.

---

## 🚀 Getting Started

To run the store locally:

```bash
# Start the secured Node.js static server
node server.js
```

Then visit:
👉 **`http://localhost:3000`**
