/* ============================================================
   REC — Configuration
   ------------------------------------------------------------
   PUBLIC Supabase URL + anon key are safe for the browser
   (protected by RLS). NEVER place the service-role key here.

   Option A (recommended for Vercel): supply these as build-time
   environment variables and inject at deploy time via a small
   build step that writes this file, OR use the inline values below.
   Option B: edit SUPABASE_URL / SUPABASE_ANON_KEY directly.
   ============================================================ */
(function (win) {
  "use strict";

  const REC = (win.REC = win.REC || {});

  // Injected at build time via Vercel env (optional).
  // Falls back to values edited in this file for local dev.
  REC.env = REC.env || {};

  REC.config = {
    supabaseUrl:
      (typeof process !== "undefined" && process.env.SUPABASE_URL) ||
      REC.env.SUPABASE_URL ||
      "https://iyyxbvfqrfvdatkfvtyx.supabase.co",
    supabaseAnonKey:
      (typeof process !== "undefined" && process.env.SUPABASE_ANON_KEY) ||
      REC.env.SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eXhidmZxcmZ2ZGF0a2Z2dHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNzQxNDQsImV4cCI6MjEwNTc1MDE0NH0.xBqeJY3QoRlSJYL6J8-EocvZGLn5eaMulMl97aO9nFY",

    appName: "REC Livestock & Agro Farms",
    motto: "Growing Excellence, Feeding the Future.",
    location: "Abia, Nigeria",
    phone: "+234 813 504 2997",
    phoneRaw: "+2348135042997",
    whatsapp: "+2347071850599",
    email: "reclivestockagrofarms@gmail.com",
    website: "",

    storageBucket: "rec-media",
    site: "reclivestock.ng",

    // Paystack (public key is safe in the browser; the SECRET key lives
    // in the Vercel serverless function api/verify-payment.js only).
    paystackKey:
      (typeof process !== "undefined" && process.env.PAYSTACK_PUBLIC_KEY) ||
      REC.env.PAYSTACK_PUBLIC_KEY ||
      "",
    paystackVerifyUrl: "/api/verify-payment",
  };

  REC.isSupabaseConfigured = function () {
    return (
      REC.config.supabaseUrl.indexOf("YOUR_SUPABASE") === -1 &&
      REC.config.supabaseAnonKey.indexOf("YOUR_SUPABASE") === -1
    );
  };

  /* ------------------------------------------------------------
     Path helpers
     ------------------------------------------------------------
     Every page sits at a different depth (index.html at the root,
     storefront pages in /pages, admin pages in /admin). Rather than
     juggling "../" in every template, this file resolves the site
     root once from its own script URL — js/core/config.js always
     loads from the same absolute location — and hands out absolute
     URLs from there.
     ------------------------------------------------------------ */
  REC.root = (function () {
    var src = document.currentScript && document.currentScript.src;
    if (!src) return "";
    try {
      // this file is always <root>/js/core/config.js
      return new URL("../../", src).href;
    } catch (e) {
      return "";
    }
  })();

  REC.PAGES = {
    index: "index.html",
    shop: "pages/shop.html",
    about: "pages/about.html",
    contact: "pages/contact.html",
    blog: "pages/blog.html",
    "blog-post": "pages/blog-post.html",
    product: "pages/product.html",
    cart: "pages/cart.html",
    checkout: "pages/checkout.html",
    "order-success": "pages/order-success.html",
    account: "pages/account.html",
    privacy: "pages/privacy.html",
    terms: "pages/terms.html",
    notFound: "pages/404.html",
  };

  /* REC.page("shop") builds the absolute URL for a page. An inline
     query string is preserved: REC.page("product?id=7"). */
  REC.page = function (path) {
    var key = String(path || "index");
    var query = "";
    var cut = key.search(/[?#]/);
    if (cut !== -1) {
      query = key.slice(cut);
      key = key.slice(0, cut);
    }
    return REC.root + (REC.PAGES[key] || key) + query;
  };

  /* REC.asset("images/hero.png") or REC.asset("assets/images/hero.png")
     Absolute URLs, data:, blob: and root-absolute paths pass through. */
  REC.asset = function (path) {
    var p = String(path || "");
    if (!p) return "";
    if (/^(https?:|data:|blob:|\/\/|\/)/i.test(p)) return p;
    return REC.root + "assets/" + p.replace(/^(\.\.\/|\.\/)*assets\//, "").replace(/^\/+/, "");
  };

  REC.sprite = function (iconId) {
    return REC.root + "assets/icons/sprite.svg#" + iconId;
  };
})(window);