// REC Consolidated
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
     root once from its own script URL — js/app.js always
     loads from the same absolute location — and hands out absolute
     URLs from there.
     ------------------------------------------------------------ */
  REC.root = (function () {
    var src = document.currentScript && document.currentScript.src;
    if (!src) return "";
    try {
      // this file is always <root>/js/app.js, so one level up is the site root
      return new URL("../", src).href;
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

  /* REC.admin("products") builds an absolute /rule/ page URL. Admin
     pages can be served at "/rule" (rewritten to index.html with the
     URL unchanged), so relative hrefs like "orders.html" resolve to the
     wrong path there. Absolute URLs fix navigation from any admin URL. */
  REC.admin = function (path) {
    return REC.root + "rule/" + String(path || "index.html");
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
/* ============================================================
   REC — UI helpers (icons, toast, format, whatsapp, reveal)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});

  const UI = {
    icon(id, cls) {
      const c = cls ? ' class="' + cls + '"' : "";
      return (
        '<svg' + c + ' aria-hidden="true"><use href="' + REC.sprite(id) + '"></use></svg>'
      );
    },

    money(n) {
      const v = Number(n || 0);
      return (
        "\u20A6" +
        v.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      );
    },

    esc(str) {
      return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]);
    },

    formatDate(iso, withTime) {
      if (!iso) return "—";
      const d = new Date(iso);
      if (isNaN(d)) return "—";
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      });
    },

    /** Toast notifications */
    toast(message, type) {
      let root = document.querySelector(".toast-root");
      if (!root) {
        root = document.createElement("div");
        root.className = "toast-root";
        root.setAttribute("aria-live", "polite");
        document.body.appendChild(root);
      }
      const icons = {
        success: "i-check-circle",
        error: "i-alert",
        warning: "i-info",
        info: "i-info",
      };
      const el = document.createElement("div");
      el.className = "toast " + (type || "info");
      el.setAttribute("role", "status");
      el.innerHTML =
        '<span class="t-icon">' +
        UI.icon(icons[type] || "i-info") +
        "</span><span></span>";
      el.querySelector("span:last-child").textContent = message;
      root.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateY(-8px)";
        setTimeout(() => el.remove(), 300);
      }, 4200);
    },

    /** Reveal-on-scroll */
    initReveal() {
      const items = document.querySelectorAll(".reveal:not(.in)");
      if (!items.length) return;
      if (win.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        items.forEach((el) => el.classList.add("in"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      items.forEach((el) => io.observe(el));
    },

    /** WhatsApp deep links (business number from config) */
    waLink(message) {
      const base =
        REC.config.phoneRaw || REC.config.phone.replace(/\D/g, "");
      const text = encodeURIComponent((message || "").replace(/\n/g, " "));
      return "https://wa.me/" + base + (text ? "?text=" + text : "");
    },

    waProductMessage(productName) {
      return (
        "Hello REC Livestock & Agro Farms,\n" +
        "I am interested in " +
        (productName || "your products") +
        ".\nPlease provide more information."
      );
    },

    initWhatsApp() {
      document.querySelectorAll("[data-wa-general]").forEach((a) => {
        a.href = UI.waLink("Hello REC Livestock & Agro Farms, I would like to make an enquiry.");
      });
      document.querySelectorAll("[data-wa-product]").forEach((a) => {
        const p = a.getAttribute("data-wa-product");
        a.href = UI.waLink(UI.waProductMessage(p));
      });
      const float = document.getElementById("wa-float");
      if (float) {
        const pulse = document.createElement("span");
        pulse.className = "pulse";
        float.appendChild(pulse);
        const personal = String(REC.config.phone || REC.config.phoneRaw).replace(/\D/g, "");
        const msg = "Hello REC Livestock & Agro Farms, I would like to make an enquiry.";
        float.href = "https://wa.me/" + personal + "?text=" + encodeURIComponent(msg);
      }
    },

    /** Skeleton grid for product loading */
    skeletonGrid(count, type) {
      const n = count || 6;
      let out = "";
      for (let i = 0; i < n; i++) {
        if (type === "product") {
          out +=
            '<div class="product-card" aria-hidden="true">' +
            '<div class="p-media"><div class="skeleton" style="width:100%;height:100%"></div></div>' +
            '<div class="p-body">' +
            '<div class="skeleton" style="height:12px;width:40%"></div>' +
            '<div class="skeleton" style="height:18px;width:75%;margin-top:8px"></div>' +
            '<div class="skeleton" style="height:14px;width:55%;margin-top:8px"></div>' +
            '<div class="skeleton" style="height:16px;width:50%;margin-top:14px"></div>' +
            "</div>" +
            "</div>";
        } else if (type === "category") {
          out +=
            '<div class="category-card" aria-hidden="true">' +
            '<div class="cat-media"><div class="skeleton" style="width:100%;height:100%"></div></div>' +
            '<div class="cat-body">' +
            '<div class="skeleton" style="height:16px;width:55%"></div>' +
            '<div class="skeleton" style="height:12px;width:80%;margin-top:8px"></div>' +
            "</div>" +
            "</div>";
        }
      }
      return out;
    },

    emptyState(title, message, actionHtml) {
      return (
        '<div class="empty-state">' +
        '<div class="e-icon">' + UI.icon("i-store") + "</div>" +
        "<h4>" + UI.esc(title) + "</h4>" +
        "<p>" + UI.esc(message) + "</p>" +
        (actionHtml || "") +
        "</div>"
      );
    },

    /** Avatar initials */
    initials(name) {
      return String(name || "R")
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    },

    qs(params) {
      return new URLSearchParams(window.location.search);
    },
  };

  /* Show/hide password toggles (buttons with .pw-toggle[data-target]) */
  win.addEventListener("click", function (e) {
    const btn = e.target.closest(".pw-toggle");
    if (!btn) return;
    const input = document.getElementById(btn.getAttribute("data-target"));
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-pressed", show ? "true" : "false");
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    const use = btn.querySelector("use");
    if (use) {
      const base = (use.getAttribute("href") || "").split("#")[0];
      use.setAttribute("href", base + "#" + (show ? "i-eye-off" : "i-eye"));
    }
    input.focus();
  });

  REC.ui = UI;
  win.REC = REC;
})(window);
/* ============================================================
   REC — Supabase client (anon key only)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});

  REC.supabaseClient = null;

  REC.initSupabase = function () {
    if (REC.supabaseClient) return REC.supabaseClient;
    if (!REC.isSupabaseConfigured()) {
      // Graceful dev mode: pages still render with demo/offline data.
      return null;
    }
    if (!win.supabase || !win.supabase.createClient) {
      // The supabase-js UMD bundle has not been loaded.
      return null;
    }
    REC.supabaseClient = win.supabase.createClient(
      REC.config.supabaseUrl,
      REC.config.supabaseAnonKey
    );
    return REC.supabaseClient;
  };
})(window);
/* ============================================================
   REC — Products / categories data layer
   Reads from Supabase when configured; falls back to bundled
   demo catalogue so the UI is fully browsable during development.
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;
  const sb = () => REC.supabaseClient;

  /* ---------- Offline/demo data (clearly sample, replaced by admin) ---------- */
  const DEMO_CATEGORIES = [
    { id: 1, slug: "poultry", name: "Poultry", image: "assets/images/roosters.jpg", description: "Broilers, layers, cockerels, day-old chicks, turkeys, ducks & more." },
    { id: 2, slug: "eggs", name: "Eggs", image: "assets/images/eggs.jpg", description: "Table eggs, fertile eggs and hatching eggs." },
    { id: 3, slug: "livestock", name: "Livestock", image: "assets/images/goat.png", description: "Goats, rams, sheep, cattle and pigs." },
    { id: 4, slug: "fish", name: "Fish", image: "assets/images/category-fish.svg", description: "Catfish, tilapia and fingerlings." },
    { id: 5, slug: "farm-supplies", name: "Farm Supplies", image: "assets/images/category-supplies.svg", description: "Feed, vitamins and farm equipment." },
  ];

  const PLACEHOLDER = "assets/images/placeholder-product.svg";

  const DEMO_PRODUCTS = [
    { id: "d1", category_id: 1, category_slug: "poultry", name: "Day-old Broiler Chicks", description: "Healthy, fast-growing day-old broiler chicks from well-managed parent stock. Ideal for commercial and backyard broiler production.", price: 42500, unit: "per 50 chicks", image: "assets/images/day-old-chicks.jpg", stock_quantity: 24, minimum_order_quantity: 1, online_orderable: true, featured: true, active: true, breed: "Broiler (Cobb/Arbor Acres)", age: "Day-old", sex: "Straight run", delivery_info: "Carefully packed for nationwide delivery." },
    { id: "d2", category_id: 1, category_slug: "poultry", name: "Day-old Layer Chicks", description: "High-yield layer chicks raised for excellent egg production and strong liveability.", price: 40000, unit: "per 50 chicks", image: "assets/images/poultry-barn.jpg", stock_quantity: 18, minimum_order_quantity: 1, online_orderable: true, featured: true, active: true, breed: "Layer (Isa Brown)", age: "Day-old", sex: "Female", delivery_info: "Available for nationwide delivery." },
    { id: "d3", category_id: 5, category_slug: "farm-supplies", name: "Poultry Feed (Top Feed)", description: "Balanced, high-quality poultry feed for broilers and layers at every growth stage.", price: 12500, unit: "per 25kg bag", image: "assets/images/category-supplies.svg", stock_quantity: 220, minimum_order_quantity: 1, online_orderable: true, featured: true, active: true },
    { id: "d4", category_id: 4, category_slug: "fish", name: "Fresh Tilapia", description: "Freshly harvested tilapia from clean, well-managed ponds.", price: 2500, unit: "per kg", image: "assets/images/category-fish.svg", stock_quantity: 0, minimum_order_quantity: 2, online_orderable: true, featured: true, active: true },
    { id: "d5", category_id: 3, category_slug: "livestock", name: "Goat (Red Sokoto)", description: "Healthy goats for breeding or household use.", price: 85000, unit: "per goat", image: "assets/images/goat.png", stock_quantity: 14, minimum_order_quantity: 1, online_orderable: true, featured: true, active: true, breed: "Red Sokoto", age: "6–12 months", sex: "Mixed", weight: "15–25 kg", delivery_info: "Farm pickup or arranged delivery." },
    { id: "d6", category_id: 2, category_slug: "eggs", name: "Table Eggs – Large (Crate)", description: "Large-size fresh table eggs collected daily from healthy layers. 30 eggs per crate.", price: 6500, unit: "per crate (30)", image: "assets/images/eggs.jpg", stock_quantity: 60, minimum_order_quantity: 1, online_orderable: true, featured: true, active: true, size: "Large" },
    { id: "d6m", category_id: 2, category_slug: "eggs", name: "Table Eggs – Medium (Crate)", description: "Medium-size fresh table eggs collected daily from healthy layers. 30 eggs per crate.", price: 6000, unit: "per crate (30)", image: "assets/images/eggs.jpg", stock_quantity: 40, minimum_order_quantity: 1, online_orderable: true, featured: false, active: true, size: "Medium" },
    { id: "d6s", category_id: 2, category_slug: "eggs", name: "Table Eggs – Small (Crate)", description: "Small-size fresh table eggs collected daily from healthy layers. 30 eggs per crate.", price: 5500, unit: "per crate (30)", image: "assets/images/eggs.jpg", stock_quantity: 40, minimum_order_quantity: 1, online_orderable: true, featured: false, active: true, size: "Small" },
    { id: "d7", category_id: 2, category_slug: "eggs", name: "Hatching Eggs", description: "Fertile eggs for incubation from proven parent stock.", price: 950, unit: "per egg", image: "assets/images/eggs.jpg", stock_quantity: 0, minimum_order_quantity: 30, online_orderable: true, active: false },
    { id: "d8", category_id: 1, category_slug: "poultry", name: "Broilers Meat (Visit Farm)", description: "Fresh broiler meat — currently available for purchase directly at the farm location.", price: 7500, unit: "per bird", image: "assets/images/fowl-local.png", stock_quantity: 40, minimum_order_quantity: 1, online_orderable: false, featured: false, active: true, delivery_info: "Visit the farm to purchase." },
    { id: "d9", category_id: 3, category_slug: "livestock", name: "Pigs (Visit Farm)", description: "Healthy pigs — currently available for purchase directly at the farm location.", price: 65000, unit: "per pig", image: "assets/images/pigs.jpg", stock_quantity: 8, minimum_order_quantity: 1, online_orderable: false, featured: false, active: true, delivery_info: "Visit the farm to purchase." },
    { id: "d10", category_id: 4, category_slug: "fish", name: "Catfish (Live)", description: "Live, healthy catfish ready for delivery or pickup.", price: 3200, unit: "per kg", image: "assets/images/category-fish.svg", stock_quantity: 150, minimum_order_quantity: 2, online_orderable: true, featured: false, active: true },
    { id: "d11", category_id: 5, category_slug: "farm-supplies", name: "Fish Feed", description: "Quality floating fish feed for growth and health.", price: 16500, unit: "per 15kg bag", image: "assets/images/category-supplies.svg", stock_quantity: 80, minimum_order_quantity: 1, online_orderable: true, active: true },
    { id: "d13", category_id: 1, category_slug: "poultry", name: "Turkey (Live)", description: "Healthy, well-fed turkeys for rearing, slaughter or festive seasons. Order ahead to reserve yours.", price: 45000, unit: "per turkey", image: "assets/images/turkeys.jpg", stock_quantity: 25, minimum_order_quantity: 1, online_orderable: true, featured: false, active: true, breed: "Turkey (Broad-breasted White)", age: "Mature", delivery_info: "Available for nationwide delivery." },
    { id: "d14", category_id: 1, category_slug: "poultry", name: "Israel Fowl (Live)", description: "Strong, fast-growing Israel fowls for meat or breeding. Raised with proper feeding and care.", price: 25000, unit: "per fowl", image: "assets/images/fowl-israel.png", stock_quantity: 30, minimum_order_quantity: 1, online_orderable: true, featured: false, active: true, breed: "Israel Fowl", age: "Mature", sex: "Mixed", delivery_info: "Available for nationwide delivery." },
    { id: "d15", category_id: 1, category_slug: "poultry", name: "Local Fowl (Free-range)", description: "Free-range local fowls raised on the farm — hardy birds, great for traditional recipes.", price: 15000, unit: "per fowl", image: "assets/images/fowl-local.png", stock_quantity: 40, minimum_order_quantity: 1, online_orderable: true, featured: false, active: true, breed: "Local (Free-range)", age: "Mature", sex: "Mixed", delivery_info: "Available for nationwide delivery." },
  ];

  const DEMO_BLOG = [
    { id: "b1", slug: "starting-a-poultry-farm-in-nigeria", title: "Starting a Poultry Farm in Nigeria: A Practical Guide", excerpt: "What you need to know about housing, feeding, day-old chicks and the first 8 weeks on a broiler farm.", image: "assets/images/broiler-chick.jpg", date: "2026-08-12", author: "REC Farm Team", category: "Poultry" },
    { id: "b2", slug: "feeding-your-layers-for-more-eggs", title: "Feeding Your Layers for Maximum Egg Production", excerpt: "A breakdown of layer nutrition and simple management tips that keep your hens laying consistently.", image: "assets/images/eggs.jpg", date: "2026-07-28", author: "REC Farm Team", category: "Poultry" },
    { id: "b3", slug: "catfish-farming-essentials", title: "Catfish Farming Essentials for Beginners", excerpt: "Pond setup, stocking rates, feeding and water quality basics for a successful catfish venture.", image: "assets/images/category-fish.svg", date: "2026-06-15", author: "REC Farm Team", category: "Fish" },
  ];

  const DEMO_SETTINGS = {
    business_name: "REC Livestock & Agro Farms Enterprises",
    motto: "Growing Excellence, Feeding the Future.",
    phone: "+234 813 504 2997",
    whatsapp: "+2347071850599",
    email: "reclivestockagrofarms@gmail.com",
    address: "Abia, Nigeria",
    delivery_note: "We deliver across all 36 states of Nigeria and the FCT.",
    website: "",
    logo_url: "",
    hero_image: "assets/images/hero.png",
    about_image: "assets/images/company-reg.jpeg",
    social_whatsapp: "",
    social_facebook: "https://www.facebook.com/share/1D56jsdGSk/",
    social_instagram: "https://www.instagram.com/recfarms1864",
    social_tiktok: "https://www.tiktok.com/@rec.livestock.agr",
    social_youtube: "",
    social_telegram: "",
    whatsapp_channel: "https://whatsapp.com/channel/0029VbEHZXE7YScuHR7ebE1W",
    whatsapp_group: "https://chat.whatsapp.com/Gmhomh6VOHtAoaYpx6TlQC?s=cl&p=a&mlu=4&ilr=4",
    telegram_channel: "https://t.me/recfarms/yourchannel",
    telegram_group: "",
  };

  const NIGERIA_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
    "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  ];

  /* Official 774 Local Government Areas grouped by state */
  const LGAS = {
    Abia: ["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"],
    Adamawa: ["Demsa","Fufure","Ganye","Gayuk","Gombi","Grie","Hong","Jada","Lamurde","Madagali","Maiha","Mayo Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"],
    "Akwa Ibom": ["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono-Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat-Enin","Nsit-Atai","Nsit-Ibom","Nsit-Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Udung-Uko","Ukanafun","Uruan","Urue-Offong/Oruko","Uyo"],
    Anambra: ["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
    Bauchi: ["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"],
    Bayelsa: ["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"],
    Benue: ["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Ushongo","Vandeikya"],
    Borno: ["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
    "Cross River": ["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakurr","Yala"],
    Delta: ["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South West"],
    Ebonyi: ["Abakaliki","Afikpo North","Afikpo South","Ebonyi","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"],
    Edo: ["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Oredo","Orhionmwon","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],
    Ekiti: ["Ado Ekiti","Efon","Ekiti East","Ekiti South-West","Ekiti West","Emure","Gbonyin","Ido Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"],
    Enugu: ["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo-Uwani"],
    "FCT - Abuja": ["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
    Gombe: ["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shongom","Yamaltu/Deba"],
    Imo: ["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Onuimo","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West","Onuimo"],
    Jigawa: ["Auyo","Babura","Biriniwa","Birnin Kudu","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Mallammadori","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"],
    Kaduna: ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
    Kano: ["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
    Katsina: ["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dan Musa","Dandume","Danja","Daura","Dutsi","Dutsin Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"],
    Kebbi: ["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"],
    Kogi: ["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela Odolu","Ijumu","Kabba/Bunu","Koton Karfe","Lokoja","Mopa Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"],
    Kwara: ["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],
    Lagos: ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
    Nasarawa: ["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Egon","Obi","Toto","Wamba"],
    Niger: ["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Munya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],
    Ogun: ["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Sagamu"],
    Ondo: ["Akoko North-East","Akoko North-West","Akoko South-East","Akoko South-West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"],
    Osun: ["Aiyedade","Aiyedire","Atakumosa East","Atakumosa West","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ife Central","Ife East","Ife North","Ife South","Ifedayo","Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"],
    Oyo: ["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Isokan","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
    Plateau: ["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],
    Rivers: ["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emuoha","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"],
    Sokoto: ["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamako","Wurno","Yabo"],
    Taraba: ["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"],
    Yobe: ["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"],
    Zamfara: ["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Tsafe","Zurmi"],
  };

  /* ---------- Categories ---------- */
  async function getCategories() {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length) return data.map(normaliseCategory);
      if (error) console.warn("Categories fetch failed, using demo:", error.message);
    }
    return DEMO_CATEGORIES.map(normaliseCategory);
  }

  function normaliseCategory(c) {
    return { ...c, image: REC.asset(c.image || PLACEHOLDER) };
  }

  /* ---------- Products ---------- */
  async function getProducts(opts) {
    opts = opts || {};
    const client = sb();
    if (client) {
      let q = client.from("products").select("*, categories(name, slug)");
      if (opts.active !== false) q = q.eq("active", true);
      if (opts.featured) q = q.eq("featured", true);
      if (opts.categoryId) q = q.eq("category_id", opts.categoryId);
      if (opts.onlineOnly) q = q.eq("online_orderable", true);
      if (opts.search) q = q.ilike("name", "%" + opts.search + "%");
      if (opts.limit) q = q.limit(opts.limit);
      if (opts.order) {
        const [col, dir] = opts.order.split(":");
        q = q.order(col, { ascending: (dir || "asc") !== "desc" });
      }
      const { data, error } = await q;
      if (!error && data) {
        return data.map(normaliseProduct);
      }
      if (error) console.warn("Products fetch failed, using demo:", error.message);
    }
    let list = DEMO_PRODUCTS.filter((p) => (opts.active === false ? true : p.active));
    if (opts.featured) list = list.filter((p) => p.featured);
    if (opts.categoryId) list = list.filter((p) => String(p.category_id) === String(opts.categoryId));
    if (opts.onlineOnly) list = list.filter((p) => p.online_orderable !== false);
    if (opts.search) {
      const s = opts.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || (p.description || "").toLowerCase().includes(s));
    }
    if (opts.limit) list = list.slice(0, opts.limit);
    if (opts.order) {
      const [col, dir] = opts.order.split(":");
      const d = dir === "desc" ? -1 : 1;
      list.sort((a, b) => {
        if (col === "price") return (a.price - b.price) * d;
        return d * String(a.name).localeCompare(b.name);
      });
    }
    return list.map(normaliseProduct);
  }

  async function getFeatured(limit) {
    return getProducts({ featured: true, limit });
  }

  async function getProduct(id) {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("products")
        .select("*, categories(name, slug)")
        .eq("id", id)
        .maybeSingle();
      if (data && !error) return normaliseProduct(data);
      if (error) console.warn("Product fetch failed, using demo:", error.message);
    }
    const p = DEMO_PRODUCTS.find((x) => String(x.id) === String(id));
    return p ? normaliseProduct(p) : null;
  }

  async function getRelated(product, limit) {
    const list = await getProducts({ active: true, limit: 12 });
    const out = list.filter(
      (p) => String(p.id) !== String(product.id) && p.category_id === product.category_id
    );
    const pool = out.length >= (limit || 4) ? out : list.filter((p) => String(p.id) !== String(product.id));
    return pool.slice(0, limit || 4);
  }

  function normaliseProduct(p) {
    const cat = p.categories || {};
    const image = pickImage(p);
    return {
      ...p,
      id: p.id,
      category_slug: cat.slug || devCategorySlug(p.category_id),
      category_name: cat.name || devCategoryName(p.category_id),
      image,
      gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery.map(REC.asset) : [image],
      price: Number(p.price || 0),
      stock_quantity: p.stock_quantity != null ? Number(p.stock_quantity) : null,
      minimum_order_quantity: Number(p.minimum_order_quantity || 1),
      online_orderable: p.online_orderable !== false,
      active: p.active !== false,
      featured: !!p.featured,
      in_stock: p.stock_quantity == null || Number(p.stock_quantity) > 0,
      low_stock: p.stock_quantity != null && Number(p.stock_quantity) > 0 && Number(p.stock_quantity) <= 10,
    };
  }

  function pickImage(p) {
    // Demo products use `image`; the products table column is `image_url`.
    const src = p.image || p.image_url;
    if (src && src !== PLACEHOLDER) return REC.asset(src);
    const m = devImage(p.category_slug || devCategorySlug(p.category_id));
    return m || REC.asset(PLACEHOLDER);
  }

  function devCategorySlug(id) {
    const c = DEMO_CATEGORIES.find((c) => String(c.id) === String(id));
    return c ? c.slug : "farm-supplies";
  }
  function devCategoryName(id) {
    const c = DEMO_CATEGORIES.find((c) => String(c.id) === String(id));
    return c ? c.name : "Farm Supplies";
  }
  function devImage(slug) {
    const map = {
      poultry: "images/broiler-chick.jpg",
      eggs: "images/eggs.jpg",
      livestock: "images/goat.png",
      fish: "images/category-fish.svg",
      "farm-supplies": "images/category-supplies.svg",
    };
    return map[slug] ? REC.asset(map[slug]) : null;
  }

  /* ---------- Testimonials ---------- */
  async function getTestimonials() {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (!error && data && data.length) return data;
      if (error) console.warn("Testimonials fetch failed:", error.message);
    }
    return [];
  }

  /* ---------- Blog ---------- */
  async function getBlogPosts() {
    const client = sb();
    let posts = null;
    if (client) {
      const { data, error } = await client
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (!error && data && data.length) posts = data;
      else if (error) console.warn("Blog fetch failed, using demo:", error.message);
    }
    if (!posts) posts = DEMO_BLOG;
    return posts.map((b) => ({ ...b, image: REC.asset(b.image) }));
  }

  async function getBlogPost(slug) {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (data && !error) return { ...data, image: REC.asset(data.image) };
    }
    const demo = DEMO_BLOG.find((b) => b.slug === slug);
    const post =
      demo ||
      DEMO_BLOG[0] || {
        title: "REC Blog",
        content: "This post will be published from the REC admin panel.",
      };
    return { ...post, image: REC.asset(post.image) };
  }

  /* ---------- Site settings ---------- */
  async function getSettings() {
    const client = sb();
    let s = null;
    if (client) {
      const { data, error } = await client.from("site_settings").select("*").maybeSingle();
      if (data && !error) {
        s = data;
        REC.config.appName = data.business_name || REC.config.appName;
        REC.config.phone = data.phone || REC.config.phone;
        REC.config.email = data.email || REC.config.email;
        if (data.whatsapp) REC.config.phoneRaw = String(data.whatsapp).replace(/\D/g, "");
      }
    }
    if (!s) s = DEMO_SETTINGS;
    return {
      ...s,
      hero_image: REC.asset(s.hero_image),
      about_image: REC.asset(s.about_image),
      logo_url: REC.asset(s.logo_url),
    };
  }

  /* ---------- Delivery zones ---------- */
  async function getDeliveryZones(state) {
    const client = sb();
    if (client) {
      let q = client.from("delivery_zones").select("*").eq("active", true);
      if (state) q = q.eq("state", state);
      const { data, error } = await q.order("state", { ascending: true });
      if (!error && data) return data;
    }
    return null; // caller falls back to default nationwide fee
  }

  /* ---------- Pickup stations ---------- */
  async function getPickupStations() {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("pickup_stations")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (!error && data) return data;
    }
    return [];
  }

  /* ---------- Favorites ---------- */
  const FAV_KEY = "rec_favorites";
  REC.favorites = {
    list() {
      try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
      } catch (e) {
        return [];
      }
    },
    toggle(productId) {
      let list = REC.favorites.list();
      const s = String(productId);
      if (list.includes(s)) list = list.filter((x) => x !== s);
      else list.push(s);
      localStorage.setItem(FAV_KEY, JSON.stringify(list));
      return list;
    },
    has(productId) {
      return REC.favorites.list().includes(String(productId));
    },
  };

  REC.products = {
    getCategories,
    getProducts,
    getFeatured,
    getProduct,
    getRelated,
    getTestimonials,
    getBlogPosts,
    getBlogPost,
    getSettings,
    getDeliveryZones,
    getPickupStations,
    STATES: NIGERIA_STATES,
    LGAS: LGAS,
    DEMO_PRODUCTS,
    PLACEHOLDER: REC.asset(PLACEHOLDER),
    money: UI.money,
  };

  win.REC = REC;
})(window);
/* ============================================================
   REC — Cart (localStorage-based, synced with guest/customer)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;
  const KEY = "rec_cart";

  /* A product with a null/undefined stock_quantity is untracked and is
     never capped; otherwise the quantity can never exceed what is in stock. */
  function capQty(qty, stock) {
    const q = Math.max(1, Math.floor(Number(qty) || 1));
    const s = stock == null ? NaN : Number(stock);
    if (isNaN(s)) return q;
    return Math.max(0, Math.min(q, s));
  }

  const Cart = {
    items() {
      try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    save(list) {
      localStorage.setItem(KEY, JSON.stringify(list));
      // Dispatch on document (bubbles to window) so listeners on BOTH
      // document and window receive it. Events dispatched directly on
      // window never reach document listeners, which left the cart UI stale.
      document.dispatchEvent(new CustomEvent("rec:cartchange", { detail: { items: list }, bubbles: true }));
    },

    count() {
      return Cart.items().reduce((s, i) => s + i.quantity, 0);
    },

    find(productId) {
      return Cart.items().find((i) => String(i.product_id) === String(productId));
    },

    add(item) {
      const stock = item.stock_quantity != null ? Number(item.stock_quantity) : null;
      if (stock != null && stock <= 0) {
        UI.toast("This product is out of stock", "warning");
        return;
      }
      const list = Cart.items();
      const existing = list.find((i) => String(i.product_id) === String(item.product_id));
      const qty = Math.max(1, Number(item.quantity || 1));
      if (existing) {
        existing.quantity = capQty(existing.quantity + qty, stock);
      } else {
        list.push({
          product_id: String(item.product_id),
          name: item.name,
          price: Number(item.price),
          unit: item.unit || "",
          image: item.image || "",
          stock_quantity: stock,
          quantity: capQty(qty, stock),
        });
      }
      Cart.save(list);
      UI.toast("Added to cart · " + item.name, "success");
    },

    updateQty(productId, qty) {
      if (qty <= 0) {
        Cart.remove(productId);
        return;
      }
      const list = Cart.items();
      const target = list.find((i) => String(i.product_id) === String(productId));
      if (!target) return;
      const capped = capQty(qty, target.stock_quantity);
      if (capped <= 0) {
        Cart.remove(productId);
        UI.toast("Out of stock · removed from cart", "warning");
        return;
      }
      if (capped < qty) UI.toast("Only " + capped + " in stock", "warning");
      Cart.save(list.map((i) => (String(i.product_id) === String(productId) ? { ...i, quantity: capped } : i)));
    },

    remove(productId) {
      Cart.save(Cart.items().filter((i) => String(i.product_id) !== String(productId)));
    },

    clear() {
      Cart.save([]);
    },

    subtotal() {
      return Cart.items().reduce((s, i) => s + i.price * i.quantity, 0);
    },

    total(deliveryFee) {
      return Cart.subtotal() + (Number(deliveryFee) || 0);
    },
  };

  REC.cart = Cart;
  win.REC = REC;
})(window);
/* ============================================================
   REC — Auth helpers
   Supabase Auth + admin role checks (role is enforced server-side).
   ============================================================ */
(function (win) {
  "use strict";
  const REC = win.REC || {};
  const UI = REC.ui;

  const AUTH_KEY = "rec_user";
  const SESSION_KEY = "rec_session";

  REC.auth = {
    get supabase() {
      return REC.supabaseClient;
    },

    async signUp(email, password, meta) {
      const { data, error } = await REC.supabaseClient.auth.signUp({
        email,
        password,
        options: { data: meta || {} },
      });
      if (error) throw error;
      return data;
    },

    async signIn(email, password) {
      const { data, error } = await REC.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const user = data.user;
      const profile = await REC.auth.getProfile(user.id);
      REC.auth.cacheUser(user, profile);
      return { user, profile };
    },

    /** Send a password-reset link to the owner of the email. */
    async resetPassword(email) {
      const redirectTo = REC.page("account");
      const { error } = await REC.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    },

    /** Set a new password (used after opening a recovery link). */
    async updatePassword(newPassword) {
      const { error } = await REC.supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },

    async signOut() {
      const { error } = await REC.supabaseClient.auth.signOut();
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(SESSION_KEY);
      if (error && !error.message.includes("No session")) throw error;
    },

    async getProfile(userId) {
      const { data, error } = await REC.supabaseClient
        .from("profiles")
        .select("id, full_name, phone, avatar_url, role, created_at")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    },

    async getSession() {
      return REC.supabaseClient.auth.getSession();
    },

    cacheUser(user, profile) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user, profile }));
      localStorage.setItem(SESSION_KEY, String(Date.now()));
    },

    currentUser() {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    isAdmin() {
      const cur = REC.auth.currentUser();
      return !!(cur && cur.profile && cur.profile.role === "admin");
    },

    async refreshProfile() {
      const cur = REC.auth.currentUser();
      if (!cur || !cur.user) return cur;
      const profile = await REC.auth.getProfile(cur.user.id);
      REC.auth.cacheUser(cur.user, profile);
      return { user: cur.user, profile };
    },

    /** Guard an admin page: redirect to login if not authorized. */
    requireAdmin(redirectTo) {
      const cur = REC.auth.currentUser();
      const target = REC.admin(redirectTo || "login.html");
      if (!cur || !cur.user) {
        location.href = target;
        return false;
      }
      return true;
    },
  };

  win.REC = REC;
})(window);
/* ============================================================
   REC — Orders (create order + order reference generation)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  REC.orders = {
    sb() {
      return REC.supabaseClient;
    },

    /** REC-2026-000001 style reference */
    generateReference() {
      const year = new Date().getFullYear();
      const seq = Math.floor(Math.random() * 900000 + 100000);
      return "REC-" + year + "-" + String(seq).padStart(6, "0");
    },

    /**
     * Creates an order in Supabase. Falls back gracefully with a
     * documented integration point when Supabase is not configured.
     */
    async create(orderPayload) {
      const client = REC.orders.sb();
      const reference = orderPayload.order_number || REC.orders.generateReference();

      if (!client) {
        // ---- INTEGRATION POINT ----
        // Supabase is not configured yet (add keys in js/app.js).
        // Simulate a successful order so the flow can be tested end-to-end.
        const stored = {
          ...orderPayload,
          order_number: reference,
          status: "pending",
          payment_status: "unpaid",
          created_at: new Date().toISOString(),
        };
        const history = JSON.parse(localStorage.getItem("rec_orders") || "[]");
        history.unshift(stored);
        localStorage.setItem("rec_orders", JSON.stringify(history.slice(0, 50)));
        return stored;
      }

      const basePayload = {
        customer_id: orderPayload.customer_id || null,
        full_name: orderPayload.full_name,
        phone: orderPayload.phone,
        email: orderPayload.email || null,
        state: orderPayload.state || null,
        lga: orderPayload.lga || null,
        delivery_address: orderPayload.delivery_address || null,
        notes: orderPayload.notes || null,
        subtotal: orderPayload.subtotal,
        delivery_fee: orderPayload.delivery_fee,
        total: orderPayload.total,
        status: "pending",
        payment_status: "unpaid",
        items: (orderPayload.items || []).map((it) => ({
          product_id: it.product_id,
          name: it.name,
          quantity: it.quantity,
          unit_price: it.price,
          subtotal: it.quantity * it.price,
        })),
      };

      const pickupPayload = {
        fulfillment_method: orderPayload.fulfillment_method || "delivery",
        pickup_station_id: orderPayload.pickup_station_id || null,
        pickup_station_name: orderPayload.pickup_station_name || null,
        pickup_station_address: orderPayload.pickup_station_address || null,
      };

      let result = await client
        .from("orders")
        .insert({ ...basePayload, ...pickupPayload })
        .select()
        .single();

      // Resilient degradation: an un-migrated database (supabase/schema.sql
      // not re-run since pickup stations were added) rejects the pickup
      // columns. Retry once without them so checkout never hard-fails.
      if (result.error && REC.orders.isPickupSchemaMismatch(result.error)) {
        console.warn(
          "orders table is missing pickup columns — re-run supabase/schema.sql. Retrying without pickup fields."
        );
        result = await client.from("orders").insert(basePayload).select().single();
      }

      const { data, error } = result;

      if (error) {
        // Fall back to local record if write fails (network / RLS) so nobody
        // loses their order silently — but surface the issue in console.
        console.error("Order insert failed:", error.message);
        const stored = { ...orderPayload, order_number: reference, status: "pending", payment_status: "unpaid", created_at: new Date().toISOString() };
        const history = JSON.parse(localStorage.getItem("rec_orders") || "[]");
        history.unshift(stored);
        localStorage.setItem("rec_orders", JSON.stringify(history.slice(0, 50)));
        throw new Error(
          "We could not save your order online right now. Your order reference is " +
            reference +
            ". Please send it to us on WhatsApp so we can confirm manually."
        );
      }
      // The trigger-assigned reference comes back from RETURNING; only fall
      // back to the random one if the trigger is absent.
      if (!data) throw new Error("We could not save your order online right now.");
      if (!data.order_number) data.order_number = reference;
      return data;
    },

    /**
     * True when the insert failed because the live DB is missing the pickup
     * columns added in supabase/schema.sql (Pre-42703 undefined column /
     * PostgREST PGRST204 schema-cache miss).
     */
    isPickupSchemaMismatch(error) {
      if (!error) return false;
      const msg = String(error.message || "");
      const pickupColumns = [
        "fulfillment_method",
        "pickup_station_id",
        "pickup_station_name",
        "pickup_station_address",
      ];
      if (!pickupColumns.some((c) => msg.indexOf(c) !== -1)) return false;
      return (
        error.code === "42703" ||
        error.code === "PGRST204" ||
        /does not exist/i.test(msg) ||
        /schema[- ]cache/i.test(msg) ||
        /column/i.test(msg)
      );
    },

    async track(reference) {
      const client = REC.orders.sb();
      if (client) {
        try {
          const { data, error } = await client
            .rpc("track_order", { p_reference: reference });
          if (!error && data && data.length) return data[0];
        } catch (e) {}
      }
      const list = JSON.parse(localStorage.getItem("rec_orders") || "[]");
      return list.find((o) => o.order_number === reference) || null;
    },

    ORDER_STATUSES: [
      "pending",
      "confirmed",
      "processing",
      "ready",
      "out for delivery",
      "completed",
      "cancelled",
    ],
  };
})(window);
/* ============================================================
   REC — Shared renderers (product cards, category cards, etc.)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;
  const icon = UI.icon;
  const esc = UI.esc;

  const stockLabel = (p) => {
    if (!p.in_stock) return { text: "Out of stock", cls: "out" };
    if (p.low_stock) return { text: "Low stock", cls: "low" };
    return { text: "In stock", cls: "" };
  };

  const R = {
    productCard(p) {
      const st = stockLabel(p);
      const fav = REC.favorites && REC.favorites.has(p.id);
      const cat = p.category_name || p.categories?.name || "";
      const price = UI.money(p.price);
      const canOrder = p.online_orderable !== false && p.in_stock;
      const waHref = UI.waLink(UI.waProductMessage(p.name));
      return (
        '<article class="product-card reveal" data-id="' + esc(p.id) + '">' +
        '<div class="p-media">' +
        '<button type="button" class="p-fav' + (fav ? " active" : "") +
        '" data-fav="' + esc(p.id) + '" aria-label="Add to favourites" aria-pressed="' + (fav ? "true" : "false") + '">' +
        icon("i-heart") +
        "</button>" +
        '<a href="' + REC.page("product") + '?id=' + encodeURIComponent(p.id) + '">' +
        '<img src="' + esc(p.image || REC.products.PLACEHOLDER) + '" alt="' + esc(p.name) + '" width="400" height="300" loading="lazy"/>' +
        "</a>" +
        "</div>" +
        '<div class="p-body">' +
        '<span class="p-cat">' + esc(cat) + "</span>" +
        '<a href="' + REC.page("product") + '?id=' + encodeURIComponent(p.id) + '" class="p-name">' + esc(p.name) + "</a>" +
        '<div class="p-rating" data-rating-for="' + esc(p.id) + '" aria-label="No ratings yet"></div>' +
        '<div class="p-meta">' +
        '<span class="p-stock"><span class="dot ' + st.cls + '"></span>' + st.text + "</span>" +
        '<span>· ' + esc(p.unit || "") + "</span>" +
        "</div>" +
        '<div class="p-foot">' +
        '<div class="p-price">' + price + " <small>" + esc(p.unit || "") + "</small></div>" +
        '<div class="p-actions">' +
        '<a class="btn btn-sm btn-outline" href="' + REC.page("product") + '?id=' + encodeURIComponent(p.id) + '">Details</a>' +
        (canOrder
          ? '<button type="button" class="btn btn-sm btn-primary" data-add="' + esc(p.id) + '">' + icon("i-cart") + "Add</button>"
          : '<a class="btn btn-sm btn-gold" href="' + waHref + '" target="_blank" rel="noopener">' + icon("i-whatsapp") + "Enquire</a>") +
        "</div>" +
        "</div>" +
        "</div>" +
        "</article>"
      );
    },

    categoryCard(c) {
      const img = c.image || REC.products.PLACEHOLDER;
      return (
        '<a class="category-card reveal" href="' + REC.page("shop") + '?category=' + encodeURIComponent(c.slug || c.id) + '">' +
        '<div class="cat-media"><img src="' + esc(img) + '" alt="' + esc(c.name) + '" width="400" height="300" loading="lazy"/></div>' +
        '<div class="cat-body">' +
        '<span class="cat-title">' + esc(c.name) + "</span>" +
        '<p class="cat-desc">' + esc(c.description || "") + "</p>" +
        '<span class="cat-arrow">Explore ' + icon("i-arrow-right") + "</span>" +
        "</div>" +
        "</a>"
      );
    },

    testimonial(t) {
      const rating = Number(t.rating || 5);
      const stars = Array.from({ length: 5 }, (_, i) =>
        icon("i-star").replace('aria-hidden="true"', i < rating ? 'aria-hidden="true" style="opacity:1"' : 'aria-hidden="true" style="opacity:.25"')
      ).join("");
      return (
        '<div class="testimonial-card reveal">' +
        '<div class="t-head">' +
        '<div class="t-avatar">' + esc(UI.initials(t.name || "REC")) + "</div>" +
        "<div><div class=\"t-name\">" + esc(t.name || "Customer") + "</div>" +
        '<div class="t-loc">' + esc(t.location || "") + "</div></div>" +
        (t.sample === true ? '<span class="t-sample">Sample testimonial</span>' : "") +
        "</div>" +
        '<blockquote>&ldquo;' + esc(t.message || "") + '&rdquo;</blockquote>' +
        '<div class="rating"><span class="stars">' + stars + "</span></div>" +
        "</div>"
      );
    },

    cartItemRow(i, index) {
      const total = UI.money(i.price * i.quantity);
      return (
        '<div class="cart-item" data-cart-row="' + esc(i.product_id) + '">' +
        '<a class="ci-img" href="' + REC.page("product") + '?id=' + encodeURIComponent(i.product_id) + '">' +
        '<img src="' + esc(i.image || REC.products.PLACEHOLDER) + '" alt="' + esc(i.name) + '" width="92" height="92" loading="lazy"/>' +
        "</a>" +
        "<div>" +
        '<a class="ci-name" href="' + REC.page("product") + '?id=' + encodeURIComponent(i.product_id) + '">' + esc(i.name) + "</a>" +
        '<div class="ci-meta">' + esc(i.unit || "") + " · " + UI.money(i.price) + " each</div>" +
        "</div>" +
        '<div class="ci-right">' +
        '<span class="ci-price">' + total + "</span>" +
        '<div class="qty-stepper" data-qty-for="' + esc(i.product_id) + '">' +
        '<button type="button" data-dec="' + esc(i.product_id) + '" aria-label="Decrease quantity">&minus;</button>' +
        '<input type="number" min="1" value="' + i.quantity + '" data-qty="' + esc(i.product_id) + '" aria-label="Quantity"/>' +
        '<button type="button" data-inc="' + esc(i.product_id) + '" aria-label="Increase quantity">+</button>' +
        "</div>" +
        '<button type="button" class="ci-remove" data-remove="' + esc(i.product_id) + '">' + icon("i-trash") + "Remove</button>" +
        "</div>" +
        "</div>"
      );
    },
  };

  /* Wiring delegated actions used by any page (bound once) */
  R.bindCommonActions = function (productResolver) {
    if (productResolver) R._resolver = productResolver;
    if (R._bound) return;
    R._bound = true;
    document.addEventListener("click", async (e) => {
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.getAttribute("data-add");
        const p = await R._resolver(id);
        if (!p) return UI.toast("Product not found", "error");
        const stock = p.stock_quantity;
        if (stock != null && stock <= 0) return UI.toast("This product is out of stock", "warning");
        REC.cart.add({
          product_id: id,
          name: p.name,
          price: p.price,
          unit: p.unit,
          image: p.image,
          stock_quantity: stock,
          quantity: Math.max(1, Number(p.minimum_order_quantity || 1)),
        });
        return;
      }
      const favBtn = e.target.closest("[data-fav]");
      if (favBtn) {
        e.preventDefault();
        const id = favBtn.getAttribute("data-fav");
        const list = REC.favorites.toggle(id);
        const on = list.includes(String(id));
        favBtn.classList.toggle("active", on);
        favBtn.setAttribute("aria-pressed", on ? "true" : "false");
        UI.toast(on ? "Saved to favourites" : "Removed from favourites", "info");
      }
    });
  };

  REC.render = R;
  win.REC = REC;
})(window);
/* ============================================================
   REC — Navigation (header, mobile drawer, search, cart count)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  const NAV_LINKS = [
    { href: REC.page("index"), label: "Home" },
    { href: REC.page("shop"), label: "Shop" },
    { href: REC.page("about"), label: "About Us" },
    { href: REC.page("contact"), label: "Our Farms" },
    { href: REC.page("blog"), label: "Blog" },
    { href: REC.page("contact"), label: "Contact" },
  ];

  const ICON = (id) => UI.icon(id);

  function brandHtml() {
    return (
      '<a class="brand" href="' + REC.page("index") + '" aria-label="REC Livestock & Agro Farms home">' +
      '<img src="' + REC.asset("logo/rec-logo.jpg") + '" alt="REC Livestock & Agro Farms logo"/>' +
      '<span class="b-text">REC<br/><span>Livestock &amp; Agro</span></span>' +
      "</a>"
    );
  }

  function highlightActive() {
    // Nav hrefs are absolute (REC.page), so compare file names, not URLs.
    const current = (window.location.pathname.split("/").pop() || REC.PAGES.index).split("?")[0];
    document.querySelectorAll(".main-nav a, .mm-nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const file = href.split("/").pop().split("?")[0].split("#")[0];
      a.classList.toggle("active", file === current);
    });
  }

  function setCartCount() {
    const items = REC.cart ? REC.cart.items() : [];
    const n = items.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = n;
      el.style.display = "grid";
    });
  }

  REC.navigation = {
    renderHeader() {
      const header = document.getElementById("site-header");
      if (!header) return;
      header.innerHTML =
        '<div class="container header-inner">' +
        brandHtml() +
        '<nav class="main-nav" aria-label="Primary">' +
        "<ul>" +
        NAV_LINKS.map(
          (l) => '<li><a href="' + l.href + '">' + l.label + "</a></li>"
        ).join("") +
        "</ul>" +
        "</nav>" +
        '<div class="header-actions">' +
        '<button type="button" class="icon-btn mobile-search-toggle" data-open-search aria-label="Search">' +
        ICON("i-search") +
        "</button>" +
        '<a class="icon-btn ic-search" href="' + REC.page("shop") + '" aria-label="Search products" title="Search products">' +
        ICON("i-search") +
        "</a>" +
        '<a class="icon-btn ic-cart" href="' + REC.page("cart") + '" aria-label="Cart">' +
        ICON("i-cart") +
        '<span class="count cart-count">0</span>' +
        "</a>" +
        '<a class="icon-btn ic-user" href="' + REC.page("account") + '" aria-label="Account" title="Account">' +
        ICON("i-user") +
        "</a>" +
        '<a class="btn btn-primary header-cta" href="' + REC.page("shop") + '">Shop Now</a>' +
        '<button type="button" class="hamburger" data-menu-toggle aria-label="Open menu" aria-expanded="false">' +
        "<span></span><span></span><span></span>" +
        "</button>" +
        "</div>" +
        "</div>";
    },

    renderMobileMenu() {
      const host = document.getElementById("mobile-menu");
      if (!host) return;
      host.innerHTML =
        '<div class="mm-backdrop" data-menu-close></div>' +
        '<div class="mm-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">' +
        '<div class="mm-head">' +
        '<a class="brand" href="' + REC.page("index") + '">' +
        '<img src="' + REC.asset("logo/rec-logo.jpg") + '" alt="REC logo"/>' +
        "</a>" +
        '<button type="button" class="mm-close" data-menu-close aria-label="Close menu">' +
        ICON("i-close") +
        "</button>" +
        "</div>" +
        '<div class="mm-search">' +
        '<form class="mm-search-form" data-mm-search>' +
        '<div class="field" style="margin-bottom:0">' +
        '<label class="sr-only" for="mm-q">Search products</label>' +
        '<input class="input" id="mm-q" type="search" placeholder="Search products..."/>' +
        "</div>" +
        "</form>" +
        "</div>" +
        '<nav class="mm-nav" aria-label="Mobile">' +
        NAV_LINKS.map(
          (l) =>
            '<a href="' +
            l.href +
            '">' +
            l.label +
            ICON("i-chevron-right") +
            "</a>"
        ).join("") +
        '<a href="' + REC.page("cart") + '">Cart<span class="count cart-count">0</span>' + ICON("i-chevron-right") + "</a>" +
        '<a href="' + REC.page("account") + '">My Account' + ICON("i-chevron-right") + "</a>" +
        "</nav>" +
        '<div class="mm-foot">' +
        '<a class="btn btn-primary btn-block" href="' + REC.page("shop") + '">Shop Now</a>' +
        '<a class="btn btn-whatsapp btn-block" href="#" data-wa-general target="_blank" rel="noopener">' +
        ICON("i-whatsapp") +
        "Chat With Us</a>" +
        '<p class="text-center" style="font-size:.78rem;color:var(--muted)">' +
        REC.config.phone +
        "</p>" +
        "</div>" +
        "</div>";
    },
  };

  function initMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!menu || !toggle) return;
    const open = () => {
      menu.classList.add("open");
      toggle.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      menu.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", () =>
      menu.classList.contains("open") ? close() : open()
    );
    menu.querySelectorAll("[data-menu-close]").forEach((el) =>
      el.addEventListener("click", close)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initSearch() {
    const mmForm = document.querySelector("[data-mm-search]");
    if (mmForm) {
      mmForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = (mmForm.querySelector("input").value || "").trim();
        location.href = REC.page("shop") + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    }
    document.querySelectorAll("[data-open-search]").forEach((btn) => {
      btn.addEventListener("click", () => {
        location.href = REC.page("shop");
      });
    });
  }

  function initScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    REC.navigation.renderHeader();
    REC.navigation.renderMobileMenu();
    initMobileMenu();
    initSearch();
    initScroll();
    highlightActive();
    if (REC.cart) {
      setCartCount();
      document.addEventListener("rec:cartchange", setCartCount);
      window.addEventListener("storage", (e) => {
        if (e.key === "rec_cart") setCartCount();
      });
    }
    REC.ui.initWhatsApp();
    REC.ui.initReveal();
  });

  win.REC = REC;
})(window);
/* ============================================================
   REC — Footer (single source, rendered on every page)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;
  const icon = UI.icon;

  REC.renderer = REC.renderer || {};

  REC.renderer.footer = function () {
    const host = document.getElementById("site-footer");
    if (!host) return;
    const cfg = REC.config;
    const year = new Date().getFullYear();
    const s = REC.siteData || {};

    const personalBase = String(cfg.phone || cfg.phoneRaw).replace(/\D/g, "");
    const waPersonal =
      s.social_whatsapp ||
      "https://wa.me/" + personalBase + "?text=" + encodeURIComponent("Hello REC Livestock & Agro Farms, I would like to make an enquiry.");
    const socials = [
      { href: waPersonal, icon: "i-whatsapp", label: "WhatsApp" },
      { href: s.whatsapp_group, icon: "i-whatsapp", label: "WhatsApp Group" },
      { href: s.social_facebook, icon: "i-facebook", label: "Facebook" },
      { href: s.social_instagram, icon: "i-instagram", label: "Instagram" },
      { href: s.social_tiktok, icon: "i-tiktok", label: "TikTok" },
      { href: s.social_youtube, icon: "i-youtube", label: "YouTube" },
      { href: s.social_telegram || s.telegram_channel, icon: "i-telegram", label: "Telegram" },
    ].filter((x) => !!x.href);

    const websiteHref = s.website || cfg.website;

    host.innerHTML =
      '<div class="container">' +
      '<div class="footer-top">' +
      '<div class="footer-brand">' +
      '<img src="' + REC.asset("logo/rec-logo.jpg") + '" alt="REC Livestock & Agro Farms logo"/>' +
      '<div class="fb-name">' + UI.esc(cfg.appName) + "</div>" +
      "<p>" +
      UI.esc(cfg.motto) +
      "</p>" +
      "<p>We produce and supply quality poultry, livestock, eggs, fish and farm supplies across Nigeria.</p>" +
      '<div class="social-links">' +
      socials
        .map((x) =>
          '<a href="' + UI.esc(x.href) + '" aria-label="' + UI.esc(x.label) + '" target="_blank" rel="noopener">' + icon(x.icon) + "</a>"
        )
        .join("") +
      "</div>" +
      "</div>" +
      '<div class="footer-col"><h4>Quick Links</h4><ul>' +
      [
        ["Home", REC.page("index")],
        ["Shop", REC.page("shop")],
        ["About Us", REC.page("about")],
        ["Our Farms", REC.page("contact")],
        ["Blog", REC.page("blog")],
        ["Contact", REC.page("contact")],
      ]
        .map(([l, h]) => '<li><a href="' + h + '">' + l + "</a></li>")
        .join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>Our Products</h4><ul>' +
      [
        "Poultry",
        "Eggs",
        "Livestock",
        "Fish",
        "Farm Supplies",
      ]
        .map((c) => '<li><a href="' + REC.page("shop") + '?category=' + encodeURIComponent(c.toLowerCase().replace(/\s+/g, "-")) + '">' + c + "</a></li>")
        .join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>Account</h4><ul>' +
      [
        ["My Cart", REC.page("cart")],
        ["Track Order", REC.page("account")],
        ["My Account", REC.page("account")],
      ]
        .map(([l, h]) => '<li><a href="' + h + '">' + l + "</a></li>")
        .join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>Contact Us</h4><ul class="footer-contact">' +
      "<li>" + icon("i-map-pin") + "<span>" + UI.esc(cfg.location) + "</span></li>" +
      "<li>" + icon("i-truck") + "<span>Delivery nationwide</span></li>" +
      "<li>" + icon("i-phone") + '<a href="tel:' + UI.esc(cfg.phoneRaw) + '">' + UI.esc(cfg.phone) + "</a></li>" +
      "<li>" + icon("i-mail") + '<a href="mailto:' + UI.esc(cfg.email) + '">' + UI.esc(cfg.email) + "</a></li>" +
      (websiteHref
        ? "<li>" + icon("i-globe") + '<a href="' + UI.esc(websiteHref) + '" target="_blank" rel="noopener">' + UI.esc(websiteHref.replace(/^https?:\/\/(www\.)?/, "")) + "</a></li>"
        : "") +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom container">' +
      "<span>&copy; " + year + " " + UI.esc(cfg.appName) + ". All rights reserved.</span>" +
      '<div class="footer-legal">' +
      '<a href="' + REC.page("privacy") + '">Privacy Policy</a>' +
      '<a href="' + REC.page("terms") + '">Terms &amp; Conditions</a>' +
      "</div>" +
      "</div>" +
      "</div>";
  };

  document.addEventListener("DOMContentLoaded", () => {
    REC.renderer.footer();
    if (REC.siteData) return;
    REC.products
      .getSettings()
      .then((s) => {
        if (s && JSON.stringify(s) !== JSON.stringify(REC.siteData || {})) {
          REC.siteData = s;
          REC.renderer.footer();
        }
      })
      .catch(() => {});
  });
})(window);
/* ============================================================
   REC — WhatsApp helpers (business links, product enquiries)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});

  REC.whatsapp = {
    general(message) {
      const msg =
        message ||
        "Hello REC Livestock & Agro Farms, I would like to make an enquiry.";
      const base = String(REC.config.whatsapp || REC.config.phoneRaw || REC.config.phone).replace(/\D/g, "");
      return "https://wa.me/" + base + "?text=" + encodeURIComponent(msg);
    },
    product(name, extras) {
      let msg =
        "Hello REC Livestock & Agro Farms,\nI am interested in " +
        name +
        ".\nPlease provide more information.";
      if (extras) msg += "\n" + extras;
      return REC.whatsapp.general(msg);
    },
    order(reference, items) {
      let msg =
        "Hello REC Livestock & Agro Farms,\nI just placed order " +
        reference +
        ".";
      if (items && items.length) {
        msg += "\nItems:\n" + items.map((i) => "- " + i.name + " x" + i.quantity).join("\n");
      }
      msg += "\nPlease confirm, thank you.";
      return REC.whatsapp.general(msg);
    },
    open(url) {
      win.open(url || REC.whatsapp.general(), "_blank", "noopener");
    },
  };
})(window);
/* ============================================================
   REC — Homepage data loading
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  async function init() {
    REC.initSupabase();

    const setText = async () => {
      const s = await REC.products.getSettings();
      REC.siteData = s;
      if (s && s.hero_image) {
        const img = document.querySelector("[data-hero-img]");
        if (img) img.src = s.hero_image;
      }
      if (s && s.business_name) {
        document.querySelectorAll("[data-company]").forEach((el) => (el.textContent = s.business_name));
      }
      if (s && s.motto) {
        document.querySelectorAll("[data-motto]").forEach((el) => (el.textContent = s.motto));
      }
    };
    setText();

    loadCategories();
    loadFeatured();
    loadTestimonials();
  }

  async function loadCategories() {
    const host = document.getElementById("shop-categories");
    if (!host) return;
    host.innerHTML = REC.ui.skeletonGrid(6, "category");
    const cats = await REC.products.getCategories();
    host.innerHTML = cats.map((c) => REC.render.categoryCard(c)).join("");
    REC.ui.initReveal();
  }

  async function loadFeatured() {
    const host = document.getElementById("featured-products");
    if (!host) return;
    host.innerHTML = REC.ui.skeletonGrid(6, "product");
    const products = await REC.products.getFeatured(6);
    if (!products.length) {
      host.innerHTML = REC.ui.emptyState(
        "Featured products coming soon",
        "The REC team is stocking the farm shop. Check back shortly."
      );
      return;
    }
    host.innerHTML = products.map((p) => REC.render.productCard(p)).join("");
    REC.ui.initReveal();
    REC.render.bindCommonActions(REC.products.getProduct);
    REC.reviews.hydrateCards(host);
  }

  async function loadTestimonials() {
    const host = document.getElementById("testimonials-grid");
    if (!host) return;
    const items = await REC.products.getTestimonials();
    if (!items.length) {
      host.innerHTML = '<p class="text-center" style="color:var(--muted)">Testimonials will appear here soon.</p>';
      return;
    }
    host.innerHTML = items.map((t) => REC.render.testimonial(t)).join("");
    REC.ui.initReveal();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
/* ============================================================
   REC — Shop page (search, filters, sort, load more)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  const PAGE_SIZE = 9;
  let allProducts = [];
  let cats = [];
  let filtered = [];
  let shown = PAGE_SIZE;
  let activeFilters = {
    category: null,
    availability: "all", // all | in | out
    priceMax: null,
    featured: false,
    search: "",
    sort: "newest",
  };

  function $(s, r) {
    return (r || document).querySelector(s);
  }

  async function init() {
    REC.initSupabase();
    const params = UI.qs();
    activeFilters.search = params.get("q") || "";
    activeFilters.featured = params.get("featured") === "1";
    const cref = params.get("category");
    if (cref) activeFilters.category = cref;

    const qEl = $("#shop_search");
    if (qEl) qEl.value = activeFilters.search;
    const count = $("#results_count");

    const [products, categories] = await Promise.all([
      REC.products.getProducts({ active: true }),
      REC.products.getCategories(),
    ]);
    allProducts = products;
    cats = categories;
    buildCategoryFilters();
    applyFilters();
  }

  function buildCategoryFilters() {
    const hosts = [$("#filter_categories"), $("#filter_categories_mobile")].filter(Boolean);
    const paramCatSlug = activeFilters.category;
    // Match slug or name
    const currentCat = cats.find(
      (c) => c.slug === paramCatSlug || String(c.id) === paramCatSlug || c.name === paramCatSlug
    );
    if (currentCat) activeFilters.category = currentCat.slug;
    const allBtn = categoryBtn(null, "All Categories");
    const btns = [allBtn].concat(cats.map((c) => categoryBtn(c.slug, c.name)));
    hosts.forEach((host) => {
      host.innerHTML = btns.join("");
      host.querySelectorAll("[data-sel]").forEach((el) => {
        el.addEventListener("click", () => {
          const slug = el.getAttribute("data-sel");
          activeFilters.category = slug === "" ? null : slug;
          applyFilters();
          setActiveCatBtn();
          if (win.innerWidth <= 1024) closeFilters();
        });
      });
    });
    setActiveCatBtn();
  }

  function categoryBtn(slug, name) {
    return (
      '<button type="button" class="btn-link" data-sel="' + (slug || "") + '" style="width:100%;justify-content:space-between;padding:.45rem .2rem;color:var(--ink-2)">' +
      '<span>' + UI.esc(name) + "</span>" +
      UI.icon("i-chevron-right").replace('<svg', '<svg width="14" height="14"') +
      "</button>"
    );
  }

  function setActiveCatBtn() {
    const host = $("#filter_categories");
    if (!host) return;
    host.querySelectorAll("[data-sel]").forEach((el) => {
      const on = el.getAttribute("data-sel") === (activeFilters.category || "");
      el.style.color = on ? "var(--rec-green)" : "var(--ink-2)";
      el.style.fontWeight = on ? "800" : "700";
    });
  }

  function applyFilters() {
    let list = allProducts.slice();
    if (activeFilters.search) {
      const s = activeFilters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          (p.description || "").toLowerCase().includes(s)
      );
    }
    if (activeFilters.category) {
      list = list.filter(
        (p) =>
          p.category_slug === activeFilters.category ||
          String(p.category_id) === activeFilters.category
      );
    }
    if (activeFilters.availability === "in") list = list.filter((p) => p.in_stock);
    if (activeFilters.availability === "out") list = list.filter((p) => !p.in_stock);
    if (activeFilters.featured) list = list.filter((p) => p.featured);
    if (activeFilters.priceMax != null) list = list.filter((p) => p.price <= activeFilters.priceMax);

    switch (activeFilters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
    }

    filtered = list;
    shown = PAGE_SIZE;
    const count = $("#results_count");
    if (count) count.textContent = list.length;
    renderGrid();
  }

  function renderGrid() {
    const grid = $("#shop_grid");
    if (!grid) return;
    if (!filtered.length) {
      grid.innerHTML = UI.emptyState(
        "No products match your filters",
        "Try adjusting the search or filter options.",
        '<a class="btn btn-primary" style="margin-top:1rem" href="' + REC.page("shop") + '">Clear Filters</a>'
      );
      $("#load_more").style.display = "none";
      return;
    }
    grid.innerHTML = filtered
      .slice(0, shown)
      .map((p) => REC.render.productCard(p))
      .join("");
    UI.initReveal();
    REC.render.bindCommonActions(REC.products.getProduct);
    REC.reviews.hydrateCards(grid);

    const btn = $("#load_more");
    if (shown >= filtered.length) {
      btn.style.display = "none";
    } else {
      btn.style.display = "inline-flex";
    }
  }

  function bindEvents() {
    const form = $("#shop_search_form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        activeFilters.search = ($("#shop_search").value || "").trim();
        applyFilters();
      });
    }
    $("#sort_select") &&
      $("#sort_select").addEventListener("change", (e) => {
        activeFilters.sort = e.target.value;
        applyFilters();
      });

    const priceInput = $("#price_max");
    const priceLabel = $("#price_max_label");
    if (priceInput) {
      priceInput.addEventListener("input", () => {
        activeFilters.priceMax = null;
        if (priceLabel) priceLabel.textContent = UI.money(priceInput.value) + " +";
        if (Number(priceInput.value) > 0) activeFilters.priceMax = Number(priceInput.value);
        applyFilters();
      });
    }
    ["availability_in", "availability_out", "only_featured"].forEach((id) => {
      const el = $("#" + id);
      if (el) {
        el.addEventListener("change", () => {
          activeFilters.availability = $("#availability_in").checked
            ? "in"
            : $("#availability_out").checked
            ? "out"
            : "all";
          activeFilters.featured = $("#only_featured").checked;
          applyFilters();
        });
      }
    });
    $("#filter_reset") &&
      $("#filter_reset").addEventListener("click", (e) => {
        e.preventDefault();
        activeFilters = {
          category: null, availability: "all", priceMax: null,
          featured: false, search: "", sort: activeFilters.sort,
        };
        $("#price_max") && ($("#price_max").value = 0);
        $("#shop_search").value = "";
        $("#sort_select") && ($("#sort_select").value = "newest");
        ["availability_in", "availability_out", "only_featured"].forEach((id) => {
          const el = $("#" + id);
          if (el) el.checked = false;
        });
        applyFilters();
        setActiveCatBtn();
      });
    $("#load_more") &&
      $("#load_more").addEventListener("click", () => {
        shown += PAGE_SIZE;
        renderGrid();
      });

    $("#shop_filters_btn") &&
      $("#shop_filters_btn").addEventListener("click", openFilters);
    $("#fd_close") && $("#fd_close").addEventListener("click", closeFilters);
    $("#fd_backdrop") && $("#fd_backdrop").addEventListener("click", closeFilters);

    // Mobile drawer sync
    const mPrice = $("#price_max_m");
    const mIn = $("#availability_in_m");
    const mOut = $("#availability_out_m");
    const setDesktopAvailability = () => {
      if ($("#availability_in")) $("#availability_in").checked = activeFilters.availability === "in";
      if ($("#availability_out")) $("#availability_out").checked = activeFilters.availability === "out";
    };
    const syncMobile = () => {
      if (mPrice) mPrice.value = activeFilters.priceMax || 0;
      if (mIn) mIn.checked = activeFilters.availability === "in";
      if (mOut) mOut.checked = activeFilters.availability === "out";
    };
    setDesktopAvailability();
    syncMobile();
    if (mPrice) {
      mPrice.addEventListener("input", () => {
        activeFilters.priceMax = Number(mPrice.value) > 0 ? Number(mPrice.value) : null;
        const desktop = $("#price_max");
        if (desktop && Number(mPrice.value) > 0) desktop.value = mPrice.value;
      });
    }
    if (mIn || mOut) {
      const handler = () => {
        activeFilters.availability = mIn.checked ? "in" : mOut.checked ? "out" : "all";
        setDesktopAvailability();
      };
      if (mIn) mIn.addEventListener("change", handler);
      if (mOut) mOut.addEventListener("change", handler);
    }
    $("#fd_apply") &&
      $("#fd_apply").addEventListener("click", () => {
        applyFilters();
        closeFilters();
      });
  }

  function openFilters() {
    const drawer = $("#filters_drawer");
    if (drawer) drawer.classList.add("open");
  }
  function closeFilters() {
    const drawer = $("#filters_drawer");
    if (drawer) drawer.classList.remove("open");
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();
    bindEvents();
  });
})(window);
/* ============================================================
   REC — Product detail page
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  function $(s, r) {
    return (r || document).querySelector(s);
  }

  async function init() {
    REC.initSupabase();
    const id = UI.qs().get("id");
    if (!id) {
      $("#pd_missing") && ($("#pd_missing").style.display = "flex");
      return;
    }
    const product = await REC.products.getProduct(id);
    if (!product) {
      $("#pd_missing") && ($("#pd_missing").style.display = "flex");
      return;
    }
    DOCUMENT_TITLE(product);
    render(product);
    renderRelated(product);
    bindQty();
    bindActions(product);
    initReviews(product);
    UI.initReveal();
  }

  function DOCUMENT_TITLE(p) {
    document.title = p.name + " | REC Livestock & Agro Farms";
    setMeta("og:title", p.name + " | REC Livestock & Agro Farms");
    setMeta("twitter:title", p.name + " | REC Livestock & Agro Farms");
    setMeta("og:description", (p.description || "Buy " + p.name + " from REC Livestock & Agro Farms.").slice(0, 200));
    setMeta("twitter:description", (p.description || "Buy " + p.name + " from REC Livestock & Agro Farms.").slice(0, 200));
    setMeta("og:image", toAbs(p.image || REC.products.PLACEHOLDER));
    setMeta("twitter:image", toAbs(p.image || REC.products.PLACEHOLDER));
    setMetaNode("og:url", window.location.href);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = window.location.href;

    injectProductJsonLd(p);
  }

  function setMeta(prop, content) {
    let el = document.querySelector('meta[property="' + prop + '"], meta[name="' + prop + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(prop.indexOf("og:") === 0 ? "property" : "name", prop);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setMetaNode(prop, content) {
    const el = document.querySelector('meta[property="' + prop + '"]');
    if (el) el.setAttribute("content", content);
  }

  function toAbs(src) {
    if (!src) return REC.asset("images/placeholder-product.svg");
    return REC.asset(src);
  }

  function injectProductJsonLd(p) {
    const prev = document.getElementById("pd_jsonld");
    if (prev) prev.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      image: toAbs(p.image || REC.products.PLACEHOLDER),
      description: p.description || "",
      sku: p.id,
      category: p.category_name || "Farm Product",
      brand: { "@type": "Brand", name: "REC Livestock & Agro Farms" },
      offers: {
        "@type": "Offer",
        url: window.location.href,
        priceCurrency: "NGN",
        price: String(Number(p.price) || 0),
        availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };
    if (p.reviews_stats && p.reviews_stats.avg && p.reviews_stats.count) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: String(Number(p.reviews_stats.avg).toFixed(1)),
        reviewCount: String(p.reviews_stats.count),
      };
    }
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "pd_jsonld";
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
  }

  function render(p) {
    const mainImg = $("#pd_main_img");
    if (mainImg) {
      mainImg.src = p.image || REC.products.PLACEHOLDER;
      mainImg.alt = p.name;
    }

    $("#pd_cat").textContent = p.category_name || "Farm Product";
    $("#pd_name").textContent = p.name;
    $("#pd_price").textContent = UI.money(p.price);
    $("#pd_unit").textContent = p.unit || "";
    $("#pd_desc").textContent = p.description || "";
    $("#pd_meta_min").textContent = "Minimum order: " + p.minimum_order_quantity + (p.unit ? " " + p.unit : "");
    $("#pd_meta_delivery").textContent = p.delivery_info || "Delivery across Nigeria (fee per location).";

    // Stock badge
    const stockEl = $("#pd_stock");
    if (stockEl) {
      if (p.in_stock) {
        stockEl.className = "badge badge-green";
        stockEl.textContent = p.low_stock ? "Low stock — order soon" : "In stock";
      } else {
        stockEl.className = "badge badge-red";
        stockEl.textContent = "Out of stock";
      }
    }

    // Attributes (livestock: breed, age, sex, weight)
    const attrs = [];
    if (p.breed) attrs.push(["Breed / Type", p.breed]);
    if (p.age) attrs.push(["Age", p.age]);
    if (p.sex) attrs.push(["Sex", p.sex]);
    if (p.weight) attrs.push(["Weight", p.weight]);
    if (p.size) attrs.push(["Size", p.size]);
    if (attrs.length) {
      const host = $("#pd_attributes");
      host.innerHTML = attrs
        .map(
          ([k, v]) =>
            '<div class="pd-meta">' +
            UI.icon("i-tag").replace('<svg', '<svg width="18" height="18"') +
            "<div><strong>" + UI.esc(k) + "</strong>" + UI.esc(v) + "</div></div>"
        )
        .join("");
    }

    // Gallery
    const thumbs = $("#pd_thumbs");
    if (thumbs) {
      const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image || REC.products.PLACEHOLDER];
      thumbs.innerHTML = gallery
        .slice(0, 4)
        .map(
          (g, i) =>
            '<button type="button" class="' + (i === 0 ? "active" : "") + '" data-thumb>' +
            '<img src="' + UI.esc(g) + '" alt="' + UI.esc(p.name) + " view " + (i + 1) + '" width="80" height="80" loading="lazy"/>' +
            "</button>"
        )
        .join("");
      thumbs.querySelectorAll("[data-thumb]").forEach((btn) => {
        btn.addEventListener("click", () => {
          thumbs.querySelectorAll("[data-thumb]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          if (mainImg) mainImg.src = btn.querySelector("img").src;
        });
      });
    }

    // WhatsApp enquiry
    const waEnquiry = $("#pd_wa_enquiry");
    if (waEnquiry) waEnquiry.href = REC.whatsapp.product(p.name);
    const waShare = $("#pd_wa_share");
    if (waShare) waShare.href = REC.whatsapp.general("Check out " + p.name + " on the REC website: " + window.location.href);

    // Order controls depend on policy
    if (p.online_orderable === false) {
      $("#pd_order_on").style.display = "none";
      $("#pd_order_off").style.display = "block";
      $("#pd_qty_wrap").style.display = "none";
    } else {
      $("#pd_order_on").style.display = "block";
      $("#pd_order_off").style.display = "none";
      if (p.in_stock) {
        $("#pd_add_cart").disabled = false;
        $("#pd_buy_now").disabled = false;
      } else {
        $("#pd_add_cart").disabled = true;
        $("#pd_buy_now").disabled = true;
      }
      const moq = Math.max(1, Number(p.minimum_order_quantity || 1));
      $("#pd_qty").value = moq;
      $("#pd_qty").min = moq;
      $("#pd_qty").max = p.stock_quantity || 99999;
      $("#pd_add_cart").dataset.product = JSON.stringify({
        product_id: p.id, name: p.name, price: p.price, unit: p.unit, image: p.image,
        stock_quantity: p.stock_quantity,
      });
    }

    // Meta tags
    const meta = $("#pd_rd_link");
    if (meta) meta.value = window.location.href;
  }

  function bindQty() {
    const dec = $("#pd_qty_dec");
    const inc = $("#pd_qty_inc");
    const input = $("#pd_qty");
    if (!input) return;
    const step = (d) => {
      let v = Number(input.value || 1) + d;
      const min = Number(input.min || 1);
      const max = Number(input.max || 99999);
      if (v < min) v = min;
      if (v > max) v = max;
      input.value = v;
    };
    if (dec) dec.addEventListener("click", () => step(-1));
    if (inc) inc.addEventListener("click", () => step(1));
    input.addEventListener("change", () => {
      let v = Number(input.value || 1);
      const min = Number(input.min || 1);
      const max = Number(input.max || 99999);
      if (v < min) v = min;
      if (v > max) v = max;
      input.value = v;
    });
  }

  function bindActions(p) {
    const addBtn = $("#pd_add_cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const item = JSON.parse(addBtn.dataset.product);
        item.quantity = Number($("#pd_qty").value || 1);
        REC.cart.add(item);
      });
    }
    const buyBtn = $("#pd_buy_now");
    if (buyBtn) {
      buyBtn.addEventListener("click", () => {
        const item = JSON.parse(addBtn.dataset.product);
        item.quantity = Number($("#pd_qty").value || 1);
        REC.cart.add(item);
        setTimeout(() => (window.location.href = REC.page("cart")), 400);
      });
    }
  }

  async function renderRelated(p) {
    const host = $("#related_products");
    if (!host) return;
    const items = await REC.products.getRelated(p, 4);
    host.innerHTML = items.map((x) => REC.render.productCard(x)).join("");
    UI.initReveal();
    REC.render.bindCommonActions(REC.products.getProduct);
    REC.reviews.hydrateCards(host);
  }

  /* ---------- Reviews ---------- */
  async function initReviews(p) {
    const host = $("#rv_list");
    const sumEl = $("#rv_summary");
    const distEl = $("#rv_dist");
    const formEl = $("#rv_form_panel");
    if (!host && !formEl) return;

    const client = REC.supabaseClient;
    const supabaseOn = !!(REC.isSupabaseConfigured() && client);

    // Summary + distribution + list
    if (sumEl) sumEl.innerHTML = REC.reviews.summary(await REC.reviews.getStats(p.id));
    if (distEl) distEl.innerHTML = REC.reviews.distributionHTML(await REC.reviews.getDistribution(p.id));
    if (host) {
      const list = client
        ? await REC.reviews.getReviews(p.id)
        : REC.reviews.DEMO_REVIEWS.map((r) => ({ ...r, product_id: p.id }));
      host.innerHTML = list.length ? list.map((r) => REC.reviews.card(r)).join("") : REC.reviews.empty();
    }

    // Form panel
    if (!formEl) return;
    const user = client ? REC.auth.currentUser() : null;
    if (!user || !user.user) {
      formEl.innerHTML = supabaseOn ? REC.reviews.formPanel({ unauth: true }) : REC.reviews.formPanel({ error: "Reviews go live once Supabase accounts are connected. For now, contact us on WhatsApp with your feedback." });
      return;
    }
    if (!supabaseOn) {
      formEl.innerHTML = REC.reviews.formPanel({ error: "Reviews go live once Supabase accounts are connected." });
      return;
    }
    const mine = await REC.reviews.myReview(p.id);
    renderReviewPanel(formEl, p.id, mine);
  }

  /** Re-fetch summary, distribution and list after a review change. */
  async function refreshReviews(productId) {
    const sumEl = $("#rv_summary");
    if (sumEl) sumEl.innerHTML = REC.reviews.summary(await REC.reviews.getStats(productId));
    const distEl = $("#rv_dist");
    if (distEl) distEl.innerHTML = REC.reviews.distributionHTML(await REC.reviews.getDistribution(productId));
    const host = $("#rv_list");
    if (host) {
      const list = REC.supabaseClient
        ? await REC.reviews.getReviews(productId)
        : REC.reviews.DEMO_REVIEWS.map((r) => ({ ...r, product_id: productId }));
      host.innerHTML = list.length ? list.map((r) => REC.reviews.card(r)).join("") : REC.reviews.empty();
    }
  }

  /**
   * Render the review form for this visitor.
   * With `mine` set the form is pre-filled for editing (with delete);
   * without it, it is a fresh "Write a Review" form.
   */
  function renderReviewPanel(formEl, productId, mine) {
    formEl.innerHTML = REC.reviews.formPanel(mine ? { edit: mine } : {});
    const del = $("#review_delete");
    if (del && mine) {
      del.addEventListener("click", async () => {
        if (!confirm("Delete your review for this product?")) return;
        try {
          await REC.reviews.remove(mine.id);
          UI.toast("Review deleted", "success");
          renderReviewPanel(formEl, productId, null);
          await refreshReviews(productId);
        } catch (err) {
          UI.toast(err.message || "Delete failed", "error");
        }
      });
    }
    bindReviewForm(productId, mine);
  }

  function bindReviewForm(productId, mine) {
    const input = $("#review_rating");
    const box = $("#rate_input");
    if (box) {
      const applyRating = (v) => {
        if (input) input.value = v;
        box.querySelectorAll("[data-rate]").forEach((b) => {
          const on = Number(b.getAttribute("data-rate")) <= v;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.querySelectorAll("svg").forEach((sv) => {
            sv.style.opacity = on ? "1" : ".22";
          });
        });
      };
      box.querySelectorAll("[data-rate]").forEach((btn) => {
        btn.addEventListener("click", () => applyRating(Number(btn.getAttribute("data-rate"))));
      });
      // keyboard support: arrow keys move the rating (radiogroup pattern)
      box.addEventListener("keydown", (e) => {
        const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const cur = Number((input && input.value) || 0) || 0;
        const next = Math.max(1, Math.min(5, (cur || (step > 0 ? 0 : 6)) + step));
        const target = box.querySelector('[data-rate="' + next + '"]');
        if (target) {
          target.focus();
          target.click();
        }
      });
    }

    const submitBtn = $("#review_submit");
    if (!submitBtn) return;
    submitBtn.addEventListener("click", async () => {
      const rating = Number((input && input.value) || 0);
      const commentEl = $("#review_comment");
      const comment = ((commentEl && commentEl.value) || "").trim();
      if (!rating) return UI.toast("Please select a star rating", "warning");
      if (comment.length < 10) return UI.toast("Your review comment is a little short", "warning");
      const btn = $("#review_submit");
      const isEdit = !!mine;
      btn.disabled = true;
      btn.textContent = isEdit ? "Saving…" : "Submitting…";
      try {
        const review = await REC.reviews.submit(productId, rating, comment, mine);
        UI.toast(
          isEdit
            ? "Review updated — our team will re-check it before publishing again."
            : "Review submitted! It will appear after approval.",
          "success"
        );
        renderReviewPanel($("#rv_form_panel"), productId, review);
        await refreshReviews(productId);
      } catch (err) {
        UI.toast(err.message || "Could not submit your review", "error");
        btn.disabled = false;
        btn.textContent = isEdit ? "Update Review" : "Submit Review";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
/* ============================================================
   REC — Product reviews (ratings & comments)
   Reads approved reviews from Supabase; falls back to a small
   demo set so the UI is browseable in development.
   Submitting a review requires a signed-in customer.
   Reviews are NOT published until an admin approves them.
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;
  const sb = () => REC.supabaseClient;

  const DEMO_REVIEWS = [
    {
      id: "rv1",
      product_id: "demo",
      author_name: "Adaeze O.",
      rating: 5,
      comment:
        "Sample review — the birds arrived healthy and on time. Great service from start to finish.",
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      sample: true,
    },
    {
      id: "rv2",
      product_id: "demo",
      author_name: "Chinedu E.",
      rating: 4,
      comment:
        "Sample review — good quality and fair pricing. Delivery took a little longer than expected.",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      sample: true,
    },
    {
      id: "rv3",
      product_id: "demo",
      author_name: "Fatima B.",
      rating: 5,
      comment:
        "Sample review — recommended. Fresh products and easy WhatsApp contact.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      sample: true,
    },
  ];

  function stars(rating, opts) {
    opts = opts || {};
    const n = Math.max(0, Math.min(5, Number(rating) || 0));
    return Array.from({ length: 5 }, (_, i) => {
      const style = [];
      if (opts.size) style.push("width:" + opts.size + "px;height:" + opts.size + "px");
      if (i < n) style.push("opacity:1");
      else if (opts.dimEmpty) style.push("opacity:.22");
      else style.push("opacity:1;color:var(--line-dark)");
      return UI.icon("i-star").replace("<svg", '<svg style="' + style.join(";") + '"');
    }).join("");
  }

  function starsRow(rating, opts) {
    opts = opts || {};
    return (
      '<span class="stars' +
      (opts.cls ? " " + opts.cls : "") +
      '" aria-label="Rated ' +
      rating +
      " out of 5\">" +
      stars(rating, opts) +
      "</span>"
    );
  }

  function demoReviews(productId) {
    return DEMO_REVIEWS.map((r) => ({ ...r, product_id: productId }));
  }

  async function getReviews(productId) {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("approved", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) return data;
      if (error) console.warn("Reviews fetch failed:", error.message);
      return [];
    }
    return demoReviews(productId);
  }

  async function getStats(productId) {
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("product_rating_stats")
        .select("review_count, average_rating")
        .eq("product_id", productId)
        .maybeSingle();
      if (!error && data) {
        return {
          review_count: Number(data.review_count || 0),
          average_rating: Number(data.average_rating || 0),
        };
      }
    }
    // Demo / fallback: compute from fetched reviews
    const list = await getReviews(productId);
    if (!list.length) return { review_count: 0, average_rating: 0 };
    const avg = list.reduce((s, r) => s + Number(r.rating || 0), 0) / list.length;
    return { review_count: list.length, average_rating: Math.round(avg * 10) / 10 };
  }

  function currentSession() {
    if (!REC.supabaseClient) return null;
    const cur = REC.auth && REC.auth.currentUser();
    return cur && cur.user ? cur.user : null;
  }

  async function myReview(productId) {
    const user = currentSession();
    if (!user) return null;
    const { data, error } = await sb()
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) return null;
    return data || null;
  }

  async function submit(productId, rating, comment, existing) {
    const user = currentSession();
    if (!user) throw new Error("Please sign in to rate this product.");
    const r = Math.floor(Number(rating));
    if (!(r >= 1 && r <= 5)) throw new Error("Please select a rating between 1 and 5 stars.");
    const text = String(comment || "").trim();
    if (text.length < 10) throw new Error("Your review comment is a little short (10 characters minimum).");
    const cur = REC.auth.currentUser();
    const name = (cur && cur.profile && cur.profile.full_name) || "REC Customer";

    const mine = existing || (await myReview(productId));
    if (mine) {
      // One review per customer per product: update instead of duplicating.
      // approved/featured are reset so an edited review re-enters moderation.
      const { data, error } = await sb()
        .from("product_reviews")
        .update({
          rating: r,
          comment: text,
          author_name: name,
          approved: false,
          featured: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", mine.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const { data, error } = await sb()
      .from("product_reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        author_name: name,
        rating: r,
        comment: text,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function remove(reviewId) {
    const { error } = await sb().from("product_reviews").delete().eq("id", reviewId);
    if (error) throw error;
  }

  /** Rating distribution (5 → 1) from approved reviews; demo data when offline. */
  async function getDistribution(productId) {
    const client = sb();
    let ratings = [];
    if (client) {
      const { data, error } = await client
        .from("product_reviews")
        .select("rating")
        .eq("product_id", productId)
        .eq("approved", true);
      if (error) console.warn("Rating distribution fetch failed:", error.message);
      ratings = (data || []).map((r) => Number(r.rating));
    } else {
      ratings = demoReviews(productId).map((r) => Number(r.rating));
    }
    const counts = [0, 0, 0, 0, 0];
    ratings.forEach((v) => {
      if (v >= 1 && v <= 5) counts[v - 1] += 1;
    });
    return { counts, total: counts.reduce((s, c) => s + c, 0) };
  }

  /** Hydrate product cards with real average ratings. */
  async function hydrateCards(root) {
    const scope = root || document;
    const nodes = Array.prototype.slice.call(scope.querySelectorAll("[data-rating-for]"));
    if (!nodes.length) return;
    const ids = [];
    nodes.forEach((n) => {
      const id = n.getAttribute("data-rating-for");
      if (id && ids.indexOf(id) === -1) ids.push(id);
    });
    const stats = {};
    const client = sb();
    if (client) {
      const { data, error } = await client
        .from("product_rating_stats")
        .select("product_id, review_count, average_rating")
        .in("product_id", ids);
      if (error) console.warn("Card rating stats failed:", error.message);
      (data || []).forEach((row) => {
        stats[row.product_id] = row;
      });
    }
    nodes.forEach((n) => {
      const s = stats[n.getAttribute("data-rating-for")];
      const count = s ? Number(s.review_count || 0) : 0;
      if (!count) {
        n.innerHTML = '<span class="pr-none">No ratings yet</span>';
        return;
      }
      const avg = Number(s.average_rating || 0);
      n.innerHTML =
        starsRow(avg, { dimEmpty: true, size: 13, cls: "pr-stars" }) +
        '<span class="pr-avg">' +
        avg.toFixed(1) +
        "</span>" +
        '<span class="pr-count">(' +
        count +
        " review" +
        (count === 1 ? "" : "s") +
        ")</span>";
      n.setAttribute(
        "aria-label",
        "Rated " + avg.toFixed(1) + " out of 5 from " + count + " review" + (count === 1 ? "" : "s")
      );
    });
  }

  /* ---------- Render helpers ---------- */

  function summary(stats) {
    const avg = Number((stats && stats.average_rating) || 0);
    const count = Number((stats && stats.review_count) || 0);
    if (!count) {
      return (
        '<span class="rv-summary-avg">No ratings yet</span>' +
        '<span class="rv-summary-count">Be the first to review this product.</span>'
      );
    }
    return (
      '<span class="rv-summary-avg">' +
      avg.toFixed(1) +
      "</span>" +
      starsRow(avg, { cls: "rv-summary-stars", size: 16 }) +
      '<span class="rv-summary-count">Based on ' +
      count +
      " review" +
      (count === 1 ? "" : "s") +
      "</span>"
    );
  }

  /** Bars for the per-star rating breakdown (Step: rating distribution). */
  function distributionHTML(d) {
    const total = d ? Number(d.total || 0) : 0;
    if (!total) return "";
    const counts = (d && d.counts) || [0, 0, 0, 0, 0];
    const avg = counts.reduce((s, c, i) => s + c * (i + 1), 0) / total;
    const rows = [5, 4, 3, 2, 1]
      .map((star) => {
        const c = counts[star - 1];
        const pct = Math.round((c / total) * 100);
        return (
          '<div class="rv-dist-row">' +
          '<span class="rv-dist-star">' +
          star +
          " star" +
          (star === 1 ? "" : "s") +
          "</span>" +
          '<span class="rv-dist-track"><span class="rv-dist-fill" style="width:' +
          pct +
          '%"></span></span>' +
          '<span class="rv-dist-count">' +
          c +
          "</span>" +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="rv-dist" role="group" aria-label="Rating distribution: ' +
      avg.toFixed(1) +
      " out of 5 from " +
      total +
      ' review' +
      (total === 1 ? "" : "s") +
      '">' +
      rows +
      "</div>"
    );
  }

  function card(r) {
    return (
      '<div class="review-card' +
      (r.sample ? " sample" : "") +
      (r.featured ? " featured" : "") +
      '">' +
      '<div class="rv-user">' +
      '<span class="rv-avatar">' + UI.esc(UI.initials(r.author_name || "R")) + "</span>" +
      '<div class="rv-user-meta">' +
      '<strong>' + UI.esc(r.author_name || "Customer") + "</strong>" +
      '<span class="rv-date">' + UI.formatDate(r.created_at) + "</span>" +
      "</div>" +
      (r.featured ? '<span class="badge badge-gold">Featured</span>' : "") +
      (r.sample ? '<span class="badge badge-green">Sample</span>' : "") +
      "</div>" +
      '<div class="rv-stars-row">' + starsRow(r.rating, { dimEmpty: true, size: 15 }) + "</div>" +
      '<p class="rv-comment">' + UI.esc(r.comment || "") + "</p>" +
      "</div>"
    );
  }

  function empty() {
    return (
      '<div class="empty-state">' +
      '<div class="e-icon">' + UI.icon("i-quote") + "</div>" +
      "<h4>No reviews yet</h4>" +
      "<p>No customer reviews for this product yet. Be the first to share your experience.</p>" +
      "</div>"
    );
  }

  function formPanel(state) {
    if (state && state.error) {
      return (
        '<div class="rv-form-box">' +
        "<strong>Write a Review</strong>" +
        '<p style="font-size:.9rem;color:var(--muted);margin-top:.4rem">' + UI.esc(state.error) + "</p>" +
        "</div>"
      );
    }
    if (state && state.unauth) {
      return (
        '<div class="rv-form-box">' +
        "<strong>Write a Review</strong>" +
        '<p style="font-size:.9rem;color:var(--muted);margin-top:.4rem">Please sign in to rate this product and share your experience with other customers.</p>' +
        '<div style="display:flex;gap:.7rem;margin-top:1rem;flex-wrap:wrap">' +
        '<a class="btn btn-primary btn-sm" href="' + REC.page("account") + '">Sign In</a>' +
        '<a class="btn btn-outline btn-sm" href="' + REC.page("account") + '">Create Account</a>' +
        "</div>" +
        "</div>"
      );
    }
    if (state && state.pending) {
      return (
        '<div class="rv-form-box">' +
        "<strong>Thanks for your review!</strong>" +
        '<p style="font-size:.9rem;color:var(--muted);margin-top:.4rem">Your rating and comment have been submitted and are awaiting approval.</p>' +
        '<button type="button" class="btn btn-outline btn-sm" id="review_delete" style="margin-top:1rem">' +
        UI.icon("i-trash") + " Delete My Review</button>" +
        "</div>"
      );
    }
    const edit = state && state.edit;
    const prefill = edit ? Math.max(1, Math.min(5, Number(edit.rating) || 0)) : 0;
    const note = edit
      ? edit.approved
        ? "You have already reviewed this product. Updates are re-checked by our team before they are published again."
        : "Your review is awaiting approval. Updates are re-checked by our team before publishing."
      : "Reviews are checked by our team before they are published.";
    return (
      '<div class="rv-form-box">' +
      "<strong>" + (edit ? "Edit Your Review" : "Write a Review") + "</strong>" +
      '<p style="font-size:.86rem;color:var(--muted);margin:.3rem 0 0">' +
      (edit
        ? "Update your rating or comment for this product."
        : "Rate this product (1–5 stars) and tell others what you think.") +
      "</p>" +
      '<div class="field" style="margin-top:.9rem">' +
      '<label for="review_rating">Your rating</label>' +
      '<div class="rate-input" id="rate_input" role="radiogroup" aria-label="Rating">' +
      '<input type="hidden" id="review_rating" value="' + prefill + '"/>' +
      Array.from({ length: 5 }, (_, i) =>
        '<button type="button" class="rate-star' +
        (i + 1 <= prefill ? " on" : "") +
        '" data-rate="' + (i + 1) + '" aria-label="' + (i + 1) + " star" +
        (i ? "s" : "") + '" aria-pressed="' + (i + 1 <= prefill ? "true" : "false") + '">' +
        UI.icon("i-star") + "</button>"
      ).join("") +
      "</div>" +
      "</div>" +
      '<div class="field">' +
      '<label for="review_comment">Your comment</label>' +
      '<textarea class="textarea" id="review_comment" rows="4" maxlength="1000" placeholder="Share your experience with this product…">' +
      (edit ? UI.esc(String(edit.comment || "")) : "") +
      "</textarea>" +
      "</div>" +
      '<button type="button" class="btn btn-primary" id="review_submit">' +
      UI.icon("i-star") + (edit ? " Update Review" : " Submit Review") + "</button>" +
      (edit
        ? '<button type="button" class="btn btn-outline btn-sm" id="review_delete" style="margin-top:.7rem">' +
          UI.icon("i-trash") + " Delete My Review</button>"
        : "") +
      '<p class="rv-mod-note">' + UI.icon("i-shield") + " " + UI.esc(note) + "</p>" +
      "</div>"
    );
  }

  REC.reviews = {
    getReviews,
    getStats,
    getDistribution,
    myReview,
    submit,
    remove,
    summary,
    distributionHTML,
    hydrateCards,
    card,
    empty,
    formPanel,
    stars,
    starsRow,
    DEMO_REVIEWS,
  };

  win.REC = REC;
})(window);
/* ============================================================
   REC — Cart page rendering + interaction
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  function $(s, r) {
    return (r || document).querySelector(s);
  }

  function renderCart() {
    const host = $("#cart_items");
    const items = REC.cart.items();
    if (!host) return;

    if (!items.length) {
      $("#cart_empty").style.display = "block";
      $("#cart_filled").style.display = "none";
      host.innerHTML = ""; // clear stale rows so the DOM matches the (empty) cart
      $("#sum_subtotal").textContent = UI.money(0);
      $("#sum_total").textContent = UI.money(0);
      return;
    }
    $("#cart_empty").style.display = "none";
    $("#cart_filled").style.display = "block";
    host.innerHTML = items.map((i, idx) => REC.render.cartItemRow(i, idx)).join("");

    const subtotal = REC.cart.subtotal();
    $("#sum_subtotal").textContent = UI.money(subtotal);
    $("#sum_total").textContent = UI.money(subtotal);
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const remove = e.target.closest("[data-remove]");
      if (remove) {
        REC.cart.remove(remove.getAttribute("data-remove"));
        renderCart();
        UI.toast("Item removed from cart", "info");
        return;
      }
      const inc = e.target.closest("[data-inc]");
      if (inc) {
        const id = inc.getAttribute("data-inc");
        const item = REC.cart.items().find((i) => String(i.product_id) === String(id));
        if (item) {
          REC.cart.updateQty(id, item.quantity + 1);
          renderCart();
        }
        return;
      }
      const dec = e.target.closest("[data-dec]");
      if (dec) {
        const id = dec.getAttribute("data-dec");
        const item = REC.cart.items().find((i) => String(i.product_id) === String(id));
        if (item) {
          REC.cart.updateQty(id, item.quantity - 1);
          renderCart();
        }
      }
    });

    document.addEventListener("change", (e) => {
      const q = e.target.closest("[data-qty]");
      if (!q) return;
      const id = q.getAttribute("data-qty");
      const item = REC.cart.items().find((i) => String(i.product_id) === String(id));
      let v = Number(q.value || 1);
      if (v < 1) v = 1;
      if (item && item.stock_quantity != null && v > item.stock_quantity) {
        v = item.stock_quantity;
        UI.toast("Only " + v + " in stock", "warning");
      }
      REC.cart.updateQty(id, v);
      renderCart();
    });

    $("#clear_cart") &&
      $("#clear_cart").addEventListener("click", () => {
        REC.cart.clear();
        renderCart();
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    bind();
    document.addEventListener("rec:cartchange", renderCart);
    window.addEventListener("storage", (e) => {
      if (e.key === "rec_cart") renderCart();
    });
  });
})(window);
/* ============================================================
   REC — Checkout page logic
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  const DEFAULT_FEE = 0; // fee is configured per state in delivery_zones
  let currentFee = DEFAULT_FEE;

  function $(s, r) {
    return (r || document).querySelector(s);
  }
  function $$(s, r) {
    return Array.from((r || document).querySelectorAll(s));
  }

  async function init() {
    const client = REC.initSupabase();
    if (client && REC.auth.getSession) {
      try {
        const { data } = await client.auth.getSession();
        if (data && data.session) {
          const cur = REC.auth.currentUser();
          if (cur && cur.profile) prefill(cur.profile);
        }
      } catch (e) {}
    }

    renderSummary();
    buildStates();
    buildPickupStations();
    bindMethod();
    bindFee();
    bindSubmit();
  }

  function prefill(p) {
    if (!p) return;
    if (!$('#full_name').value) $('#full_name').value = p.full_name || "";
    if (!$('#phone').value) $('#phone').value = p.phone || "";
    const emailField = $('#email');
    if (p.email) emailField.value = p.email;
  }

  function buildStates() {
    const sel = $('#state');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select your state</option>' +
      REC.products.STATES.map((s) => '<option value="' + s + '">' + s + "</option>").join("");
  }

  function buildLgas(state) {
    const sel = $('#lga');
    if (!sel) return;
    const lgas = (state && REC.products.LGAS && REC.products.LGAS[state]) || [];
    sel.disabled = !lgas.length;
    sel.innerHTML =
      '<option value="">' + (lgas.length ? "Select your LGA" : "Select your state first") + "</option>" +
      lgas.map((l) => '<option value="' + l + '">' + l + "</option>").join("");
  }

  async function buildPickupStations() {
    const sel = $('#pickup_station');
    if (!sel) return;
    sel.innerHTML = '<option value="">Loading stations…</option>';
    try {
      const stations = await REC.products.getPickupStations();
      if (!stations || !stations.length) {
        sel.innerHTML = '<option value="">No pickup stations available — please select delivery</option>';
        sel.disabled = true;
        return;
      }
      sel.disabled = false;
      sel.innerHTML =
        '<option value="">Select a pickup station</option>' +
        stations
          .map(
            (s) =>
              '<option value="' + s.id + '"' +
              ' data-name="' + UI.esc(s.name.replace(/"/g, "&quot;")) + '"' +
              ' data-addr="' + UI.esc(s.address.replace(/"/g, "&quot;")) + '"' +
              ' data-hours="' + UI.esc((s.operating_hours || "").replace(/"/g, "&quot;")) + '"' +
              ' data-phone="' + UI.esc((s.contact_phone || "").replace(/"/g, "&quot;")) + '">' +
              UI.esc(s.name) + " — " + UI.esc(s.city || s.state) +
              "</option>"
          )
          .join("");
    } catch (e) {
      sel.innerHTML = '<option value="">Could not load stations</option>';
      sel.disabled = true;
    }
  }

  function showPickupDetails() {
    const sel = $('#pickup_station');
    const info = $('#pickup_info');
    const text = $('#pickup_info_text');
    if (!sel || !info || !text) return;
    const opt = sel.options[sel.selectedIndex];
    if (!opt || !opt.value) {
      info.hidden = true;
      return;
    }
    const lines = [opt.getAttribute('data-addr')];
    if (opt.getAttribute('data-hours')) lines.push('Hours: ' + opt.getAttribute('data-hours'));
    if (opt.getAttribute('data-phone')) lines.push('Tel: ' + opt.getAttribute('data-phone'));
    text.textContent = lines.filter(Boolean).join(' · ');
    info.hidden = false;
  }

  function setMethod(method) {
    const delivery = $('#fm_delivery');
    const pickup = $('#fm_pickup');
    const btnD = $('#fm_btn_delivery');
    const btnP = $('#fm_btn_pickup');
    if (!delivery || !pickup) return;
    REC.checkoutMethod = method === 'pickup' ? 'pickup' : 'delivery';
    const isPickup = REC.checkoutMethod === 'pickup';
    delivery.hidden = isPickup;
    pickup.hidden = !isPickup;
    if (btnD) {
      btnD.classList.toggle('active', !isPickup);
      btnD.setAttribute('aria-checked', String(!isPickup));
    }
    if (btnP) {
      btnP.classList.toggle('active', isPickup);
      btnP.setAttribute('aria-checked', String(isPickup));
    }
    const note = $('#sum_note');
    if (note) {
      note.textContent = isPickup
        ? 'Pickup at one of our stations is free. Bring your order reference when you come.'
        : 'Delivery fee is confirmed based on your selected state. We deliver across all 36 states and the FCT.';
    }
    updateTotals();
  }

  function bindMethod() {
    const btns = $$('.fm-btn');
    btns.forEach((b) =>
      b.addEventListener('click', () => {
        setMethod(b.getAttribute('data-method'));
        const firstRequired = b.getAttribute('data-method') === 'pickup' ? $('#pickup_station') : $('#state');
        firstRequired && firstRequired.focus({ preventScroll: true });
      })
    );
    const sel = $('#pickup_station');
    if (sel) sel.addEventListener('change', showPickupDetails);
  }

  async function stateFee(state) {
    if (!state) return DEFAULT_FEE;
    try {
      const zones = await REC.products.getDeliveryZones(state);
      if (zones && zones.length) {
        return Number(zones[0].delivery_fee || 0);
      }
    } catch (e) {}
    // Nationwide default (no configured zone yet) — keep transparent.
    return DEFAULT_FEE;
  }

  async function bindFee() {
    const sel = $('#state');
    if (!sel) return;
    sel.addEventListener('change', async () => {
      buildLgas(sel.value);
      const fee = await stateFee(sel.value);
      updateTotals(fee);
    });
  }

  function updateTotals(_fee) {
    if (_fee !== undefined) currentFee = _fee;
    const subtotal = REC.cart.subtotal();
    const isPickup = REC.checkoutMethod === 'pickup';
    const fee = isPickup ? 0 : (Number(currentFee) || 0);
    $('#sum_subtotal').textContent = UI.money(subtotal);
    $('#sum_delivery').textContent = isPickup ? "Free" : (fee ? UI.money(fee) : "—");
    $('#sum_total').textContent = UI.money(subtotal + fee);
  }

  function renderSummary() {
    const list = REC.cart.items();
    const host = $('#checkout_items');
    if (!host) return;
    if (!list.length) {
      host.innerHTML =
        '<div class="osi-row"><span>Your cart is empty.</span><span></span></div>' +
        '<div class="osi-row"><span></span><span><a class="btn-link" href="' + REC.page("shop") + '">Browse products</a></span></div>';
      $('#submit_btn') && ($('#submit_btn').disabled = true);
      updateTotals(); // zero the totals as soon as the cart empties
      return;
    }
    host.innerHTML = list
      .map(
        (i) =>
          '<div class="osi-row"><span>' +
          UI.esc(i.name) +
          " × " +
          i.quantity +
          '</span><span>' +
          UI.money(i.price * i.quantity) +
          "</span></div>"
      )
      .join("");
    $("#submit_btn") && ($("#submit_btn").disabled = false);
    updateTotals(); // keep the currently selected delivery fee
  }

  function validate(form) {
    let ok = true;
    $$('.field', form).forEach((f) => f.classList.remove('invalid'));
    const isPickup = REC.checkoutMethod === 'pickup';
    const rules = [
      ['full_name', (v) => v.trim().length >= 3, 'Enter your full name'],
      ['phone', (v) => v.replace(/\D/g, '').length >= 10, 'Enter a valid phone number'],
      ['email', (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email or leave blank'],
    ];
    if (isPickup) {
      rules.push(['pickup_station', (v) => !!v, 'Select a pickup station']);
    } else {
      rules.push(
        ['state', (v) => !!v, 'Select your state'],
        ['lga', (v) => !!v, 'Select your LGA'],
        ['delivery_address', (v) => v.trim().length >= 5, 'Enter your delivery address']
      );
    }
    rules.forEach(([id, fn, msg]) => {
      const el = $('#' + id);
      if (!el) return;
      const field = el.closest('.field');
      const val = el.value || '';
      if (!fn(val)) {
        ok = false;
        if (field) {
          field.classList.add('invalid');
          const err = field.querySelector('.err');
          if (err) err.textContent = msg;
        }
      }
    });
    return ok;
  }

  /* Links the order to the signed-in account's customers row so it shows
     up in "Your Orders" (orders.customer_id -> customers.id -> user_id).
     Returns null for guests; a failed link never blocks checkout. */
  async function resolveCustomerId(p) {
    const client = REC.supabaseClient;
    if (!client || !client.auth || !client.auth.getSession) return null;
    try {
      const { data } = await client.auth.getSession();
      const session = data && data.session;
      if (!session || !session.user) return null;
      const uid = session.user.id;
      const lookup = () => client.from("customers").select("id").eq("user_id", uid).maybeSingle();
      const { data: existing } = await lookup();
      if (existing) return existing.id;
      const { data: created, error } = await client
        .from("customers")
        .insert({ user_id: uid, full_name: p.full_name, phone: p.phone, email: p.email || null })
        .select("id")
        .single();
      if (error) {
        // Another checkout may have created it first (unique user_id).
        const { data: again } = await lookup();
        if (again) return again.id;
        console.warn("customers insert failed:", error.message);
        return null;
      }
      return created ? created.id : null;
    } catch (e) {
      console.warn("customer link skipped:", e && e.message);
      return null;
    }
  }

  function bindSubmit() {
    const form = $('#checkout_form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!REC.cart.items().length) {
        UI.toast('Your cart is empty', 'warning');
        return;
      }
      if (!validate(form)) {
        UI.toast('Please correct the highlighted fields', 'error');
        const firstBad = $('.field.invalid');
        if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const btn = $('#submit_btn');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Processing…';

      try {
        const isPickup = REC.checkoutMethod === 'pickup';
        const state = $('#state').value;
        const fee = isPickup ? 0 : await stateFee(state);
        const subtotal = REC.cart.subtotal();
        const psSelect = $('#pickup_station');
        const psOption = psSelect && psSelect.value ? psSelect.options[psSelect.selectedIndex] : null;
        const payload = {
          full_name: $('#full_name').value.trim(),
          phone: $('#phone').value.trim(),
          email: $('#email').value.trim() || null,
          fulfillment_method: isPickup ? 'pickup' : 'delivery',
          state: isPickup ? null : state,
          lga: isPickup ? null : $('#lga').value.trim(),
          delivery_address: isPickup ? null : $('#delivery_address').value.trim(),
          pickup_station_id: psOption ? Number(psOption.value) : null,
          pickup_station_name: psOption ? psOption.getAttribute('data-name') : null,
          pickup_station_address: psOption ? psOption.getAttribute('data-addr') : null,
          notes: $('#notes').value.trim() || null,
          subtotal,
          delivery_fee: fee,
          total: subtotal + fee,
          items: REC.cart.items(),
        };

        payload.customer_id = await resolveCustomerId(payload);

        const order = await REC.orders.create(payload);
        const reference = order.order_number;
        localStorage.setItem('rec_last_order', JSON.stringify({ ...order, created_at: order.created_at || new Date().toISOString() }));
        REC.cart.clear();

        // Confirmation page renders from rec_last_order.
        window.location.href = REC.page("order-success") + "?ref=" + encodeURIComponent(reference);
      } catch (err) {
        UI.toast(err.message || 'Order submission failed. Please try again.', 'error');
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
    // Keep the order summary in sync whenever the cart changes
    // (same tab or another tab via the storage event).
    document.addEventListener("rec:cartchange", renderSummary);
    window.addEventListener("storage", (e) => {
      if (e.key === "rec_cart") renderSummary();
    });
  });
})(window);
/* ============================================================
   REC — Contact page (form → Supabase, fallback to WhatsApp)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  function $(s, r) {
    return (r || document).querySelector(s);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    REC.initSupabase();

    // Populate contact details from settings
    const s = await REC.products.getSettings();
    const fill = (id, val) => {
      const el = $("#" + id);
      if (el) el.textContent = val || el.textContent;
    };
    fill("c_company", s.business_name || REC.config.appName);
    fill("c_location", s.address || REC.config.location);
    fill("c_email", s.email || REC.config.email);
    fill("c_phone", s.phone || REC.config.phone);
    const tel = $("#c_phone_link");
    if (tel) tel.href = "tel:" + (REC.config.phoneRaw || "+2348135042997");
    const mail = $("#c_email_link");
    if (mail) mail.href = "mailto:" + (s.email || REC.config.email);
    const wa = $("#c_wa_link");
    if (wa) wa.href = REC.whatsapp.general();
    const wa2 = $("#c_wa_link2");
    if (wa2) wa2.href = REC.whatsapp.general();

    // Social + channel/group links (only real links are shown)
    const socials = [
      { href: s.social_whatsapp || REC.whatsapp.general(), icon: "i-whatsapp", label: "WhatsApp" },
      { href: s.whatsapp_channel, icon: "i-whatsapp", label: "WhatsApp Channel" },
      { href: s.whatsapp_group, icon: "i-whatsapp", label: "WhatsApp Group" },
      { href: s.social_facebook, icon: "i-facebook", label: "Facebook" },
      { href: s.social_instagram, icon: "i-instagram", label: "Instagram" },
      { href: s.social_tiktok, icon: "i-tiktok", label: "TikTok" },
      { href: s.social_youtube, icon: "i-youtube", label: "YouTube" },
      { href: s.social_telegram || s.telegram_channel, icon: "i-telegram", label: "Telegram" },
    ].filter((x) => !!x.href);
    const socialHost = $("#c_socials");
    if (socialHost) {
      socialHost.innerHTML = socials
        .map(
          (x) =>
            '<a href="' +
            UI.esc(x.href) +
            '" aria-label="' +
            UI.esc(x.label) +
            '" target="_blank" rel="noopener">' +
            UI.icon(x.icon) +
            "</a>"
        )
        .join("");
    }

    const form = $("#contact_form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Honeypot — bots fill the hidden field; silently ignore.
        const honeypot = $("#cf_website");
        if (honeypot && honeypot.value.trim()) return;

        // Minimal rate guard — one submission per 90 seconds per browser.
        const LAST_KEY = "rec_contact_last";
        const last = Number(localStorage.getItem(LAST_KEY) || 0);
        if (Date.now() - last < 90000) {
          UI.toast("Thanks — please wait a moment before sending another message.", "info");
          return;
        }

        const name = $("#cf_name").value.trim();
        const email = $("#cf_email").value.trim();
        const phone = $("#cf_phone").value.trim();
        const subject = $("#cf_subject").value.trim();
        const message = $("#cf_message").value.trim();

        if (!name || !message || message.length < 10) {
          UI.toast("Please fill your name and a message (at least 10 characters).", "error");
          return;
        }

        const btn = $("#cf_submit");
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.textContent = "Sending…";

        const client = REC.supabaseClient;
        if (client) {
          try {
            const { error } = await client.from("contact_messages").insert({
              name,
              email: email || null,
              phone: phone || null,
              subject: subject || "Website enquiry",
              message,
            });
            if (error) throw error;
            form.reset();
            localStorage.setItem(LAST_KEY, String(Date.now()));
            UI.toast("Thank you! Your message has been sent to the REC team.", "success");
            btn.disabled = false;
            btn.innerHTML = original;
            return;
          } catch (err) {
            console.error("Contact insert failed:", err.message);
            // fall through to WhatsApp handoff
          }
        }

        // Fallback: open WhatsApp with the message
        const waMsg =
          "Hello REC Livestock & Agro Farms,\n" +
          (name ? "My name is " + name + ".\n" : "") +
          (subject ? "Subject: " + subject + "\n" : "") +
          message +
          (phone ? "\n\nPhone: " + phone : "") +
          (email ? "\nEmail: " + email : "");
        window.open(REC.whatsapp.general(waMsg), "_blank", "noopener");
        UI.toast("Opening WhatsApp — please send the pre-filled message.", "info");
        btn.disabled = false;
        btn.innerHTML = original;
      });
    }
  });
})(window);
/* ============================================================
   REC — Blog listing
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  document.addEventListener("DOMContentLoaded", async () => {
    REC.initSupabase();
    const host = document.getElementById("blog_grid");
    if (!host) return;
    const posts = await REC.products.getBlogPosts();
    if (!posts.length) {
      host.innerHTML = UI.emptyState(
        "Blog posts coming soon",
        "The REC team is writing practical farm guides for you."
      );
      return;
    }
    host.innerHTML = posts
      .map((p) => {
        const img = REC.asset(p.image) || REC.asset("images/turkey.png");
        return (
          '<article class="product-card reveal" style="overflow:hidden">' +
          '<a class="p-media" href="' + REC.page("blog-post") + '?slug=' + encodeURIComponent(p.slug) + '">' +
          '<img src="' + UI.esc(img) + '" alt="' + UI.esc(p.title) + '" width="400" height="300" loading="lazy"/>' +
          "</a>" +
          '<div class="p-body">' +
          '<span class="p-cat">' + UI.esc(p.category || "Farm") + "</span>" +
          '<a class="p-name" href="' + REC.page("blog-post") + '?slug=' + encodeURIComponent(p.slug) + '">' + UI.esc(p.title) + "</a>" +
          '<p style="font-size:.86rem;color:var(--muted);line-height:1.55">' + UI.esc(p.excerpt || "") + "</p>" +
          '<div class="p-meta" style="margin-top:.4rem">' +
          UI.icon("i-clock").replace('<svg', '<svg width="15" height="15"') +
          '<span>' + UI.formatDate(p.published_at || p.date) + " · " + UI.esc(p.author || "REC Farm Team") + "</span>" +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
    UI.initReveal();
  });
})(window);
/* ============================================================
   REC — Single blog post
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  function $(id) {
    return document.getElementById(id);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    REC.initSupabase();
    const host = $("post_body");
    if (!host) return;
    const slug = UI.qs().get("slug");
    const post = await REC.products.getBlogPost(slug || "");

    if (!post || !post.title) {
      host.innerHTML = UI.emptyState("Post not found", "The article may have been removed.");
      return;
    }

    const paragraphs = Array.isArray(post.content)
      ? post.content.join("</p><p>")
      : String(post.content || "").replace(/\n{2,}/g, "</p><p>");

    host.innerHTML =
      '<nav class="breadcrumb" aria-label="Breadcrumb">' +
      '<a href="' + REC.page("index") + '">Home</a><span class="sep">/</span>' +
      '<a href="' + REC.page("blog") + '">Blog</a><span class="sep">/</span>' +
      '<span aria-current="page">' + UI.esc(post.title) + "</span></nav>" +
      '<span class="p-cat">' + UI.esc(post.category || "Farm") + "</span>" +
      "<h1 style='font-size:clamp(1.9rem,4vw,2.7rem)'>" + UI.esc(post.title) + "</h1>" +
      '<div class="p-meta" style="margin-top:.7rem">' +
      UI.icon("i-clock").replace('<svg', '<svg width="16" height="16"') +
      "<span>" + UI.formatDate(post.published_at || post.date) + " · " + UI.esc(post.author || "REC Farm Team") + "</span>" +
      "</div>" +
      '<div class="pd-main-img" style="aspect-ratio:16/9;margin-top:1.6rem">' +
      '<img src="' + UI.esc(REC.asset(post.image) || REC.asset("images/turkey.png")) + '" alt="' + UI.esc(post.title) + '" style="width:100%;height:100%;object-fit:cover"/>' +
      "</div>" +
      '<div class="prose" style="margin-top:1.8rem;line-height:1.85">' +
      "" + paragraphs + "" +
      "</div>" +
      '<div class="cta-band" style="margin-top:2.4rem">' +
      '<div class="cta-inner"><div><h2 style="font-size:1.4rem">Need help on your farm?</h2>' +
      "<p>Talk to the REC team today.</p></div>" +
      '<div style="display:flex;gap:.7rem;flex-wrap:wrap">' +
      '<a class="btn btn-gold" href="' + REC.page("shop") + '">Shop Products</a>' +
      '<a class="btn btn-white" href="' + REC.whatsapp.general() + '" target="_blank" rel="noopener">WhatsApp Us</a>' +
      "</div></div></div>";

    document.title = post.title + " | REC Blog";
    setPostMeta(post);
  });

  function setPostMeta(post) {
    const date = post.published_at || post.date;
    const image = toAbs(REC.asset(post.image));
    setMeta("og:title", post.title + " | REC Blog");
    setMeta("twitter:title", post.title + " | REC Blog");
    setMeta("og:description", (post.excerpt || "").slice(0, 200));
    setMeta("twitter:description", (post.excerpt || "").slice(0, 200));
    setMeta("og:image", image);
    setMeta("twitter:image", image);
    const urlMeta = document.querySelector('meta[property="og:url"]');
    if (urlMeta) urlMeta.setAttribute("content", window.location.href);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = window.location.href;

    const prev = document.getElementById("bp_jsonld");
    if (prev) prev.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      image: image,
      datePublished: date,
      author: { "@type": "Organization", name: post.author || "REC Farm Team" },
      publisher: { "@type": "Organization", name: "REC Livestock & Agro Farms" },
      mainEntityOfPage: window.location.href,
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "bp_jsonld";
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
  }

  function setMeta(prop, content) {
    let el = document.querySelector('meta[property="' + prop + '"], meta[name="' + prop + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(prop.indexOf("og:") === 0 ? "property" : "name", prop);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function toAbs(src) {
    if (!src) return REC.asset("images/turkey.png");
    return /^https?:\/\//.test(src) ? src : "https://reclivestock.ng/" + src.replace(/^\//, "");
  }
})(window);
/* ============================================================
   REC — Account (login / register / track order)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  function $(s, r) {
    return (r || document).querySelector(s);
  }

  function show(id) {
    ["view_guest", "view_login", "view_register", "view_track", "view_profile", "view_forgot", "view_recovery"].forEach((v) => {
      const el = $('#' + v);
      if (el) el.style.display = v === id ? "block" : "none";
    });
  }

  async function detectRecovery() {
    try {
      if (!REC.supabaseClient || !REC.supabaseClient.auth.getSession) return false;
      const { data } = await REC.supabaseClient.auth.getSession();
      return !!(data && data.session && data.session.user && data.session.user.aud === "authenticated" && location.hash && /type=recovery/i.test(location.hash));
    } catch (e) {
      return false;
    }
  }

  function renderProfile() {
    const cur = REC.auth.currentUser();
    const user = cur && cur.user;
    const profile = (cur && cur.profile) || {};
    if (!user) {
      show("view_login");
      const tr = $("#tab_row");
      if (tr) tr.style.display = "";
      return;
    }
    const tr = $("#tab_row");
    if (tr) tr.style.display = "none";
    show("view_profile");
    const box = $("#profile_box");
    box.innerHTML =
      "<h3>Hi, " + UI.esc(profile.full_name || user.user_metadata && user.user_metadata.full_name || user.email || "there") + "</h3>" +
      '<div class="sum-row"><span>Email</span><span>' + UI.esc(user.email || "") + "</span></div>" +
      '<div class="sum-row"><span>Phone</span><span>' + UI.esc(profile.phone || (user.user_metadata && user.user_metadata.phone) || "—") + "</span></div>" +
      '<div class="sum-row"><span>Member since</span><span>' + UI.formatDate(profile.created_at || user.created_at) + "</span></div>" +
      '<div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.2rem">' +
      '<button type="button" class="btn btn-outline btn-sm" id="signout_btn">Sign Out</button>' +
      "</div>" +
      '<h4 style="margin:1.8rem 0 .6rem">Your Orders</h4><div id="profile_orders"></div>';

    $("#signout_btn").addEventListener("click", async () => {
      try {
        await REC.auth.signOut();
        UI.toast("Signed out", "success");
        setTimeout(() => window.location.reload(), 400);
      } catch (err) {
        UI.toast(err.message || "Sign out failed", "error");
      }
    });

    loadOrders(user);
  }

  async function loadOrders(user) {
    const host = $("#profile_orders");
    if (!host) return;
    const sb = REC.orders.sb();
    if (!sb) {
      host.innerHTML = '<p style="font-size:.9rem;color:var(--muted)">Order history is available once Supabase is connected.</p>';
      return;
    }
    host.innerHTML = '<p style="font-size:.9rem;color:var(--muted)">Loading your orders…</p>';
    try {
      const { data: custRow } = await sb.from("customers").select("id").eq("user_id", user.id).maybeSingle();
      let orders = [];
      if (custRow) {
        const { data, error } = await sb
          .from("orders")
          .select("order_number, status, payment_status, total, created_at, items")
          .eq("customer_id", custRow.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (error) throw error;
        orders = data || [];
      }
      renderOrders(host, orders);
    } catch (err) {
      host.innerHTML = '<p style="font-size:.9rem;color:var(--muted)">Could not load your orders: ' + UI.esc(err.message) + "</p>";
    }
  }

  function renderOrders(host, orders) {
    if (!orders || !orders.length) {
      host.innerHTML =
        '<div class="empty-state"><p>No orders yet. Order history links to any account you were signed into at checkout.</p></div>' +
        '<div style="text-align:center;margin-top:1rem"><a class="btn btn-gold btn-sm" href="' + REC.page("shop") + '">Start Shopping</a></div>';
      return;
    }
    const statusMap = {
      pending: ["badge-gold", "Pending"],
      confirmed: ["badge-green", "Confirmed"],
      processing: ["badge-gold", "Processing"],
      ready: ["badge-green", "Ready"],
      "out for delivery": ["badge-green", "Out for Delivery"],
      completed: ["badge-green", "Completed"],
      cancelled: ["badge-red", "Cancelled"],
    };
    host.innerHTML = orders
      .map((o) => {
        const [cls, label] = statusMap[o.status] || ["bg-gray", o.status || "Pending"];
        const pay = o.payment_status === "paid" ? '<span class="badge badge-green">Paid</span>' : '<span class="badge badge-gold">' + UI.esc(o.payment_status || "unpaid") + "</span>";
        return (
          '<div class="pd-order-panel">' +
          '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.4rem">' +
          "<h3>" + UI.esc(o.order_number) + "</h3>" +
          '<span class="badge ' + cls + '">' + UI.esc(label) + "</span>" +
          "</div>" +
          '<div class="sum-row"><span>Placed</span><span>' + UI.formatDate(o.created_at) + "</span></div>" +
          '<div class="sum-row"><span>Total</span><span>' + UI.money(o.total) + "</span></div>" +
          '<div class="sum-row"><span>Payment</span><span>' + pay + "</span></div>" +
          "</div>"
        );
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // Account page only — this controller lives in the shared app.js and
    // its listeners would otherwise run on every page (and throw, since
    // #profile_box / #view_login only exist here).
    if (!document.getElementById("tab_row")) return;
    REC.initSupabase();
    const forms = ["login", "register", "track"];

    // Already signed in? Show the profile view.
    const cur = REC.auth && REC.auth.currentUser();
    if (cur && cur.user) {
      await REC.auth.refreshProfile && REC.auth.refreshProfile();
      renderProfile();
    } else {
      // User landed here from a password-reset email.
      const recovery = await detectRecovery();
      if (recovery) {
        const tr = $("#tab_row");
        if (tr) tr.style.display = "none";
        show("view_recovery");
      }
    }

    // Tabs
    const tabs = $$('.tab-btn').forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.getAttribute("data-tab");
        show("view_" + target);
      });
    });

    // Forgot password toggle
    const forgotLink = $("#forgot_link");
    if (forgotLink) forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      show("view_forgot");
    });
    const forgotBack = $("#forgot_back");
    if (forgotBack) forgotBack.addEventListener("click", (e) => {
      e.preventDefault();
      show("view_login");
    });

    // Send reset link
    $("#forgot_form") &&
      $("#forgot_form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = $("#forgot_email").value.trim();
        if (!email) return UI.toast("Enter your account email address", "warning");
        if (!REC.isSupabaseConfigured() || !REC.supabaseClient || !REC.auth.resetPassword) {
          UI.toast("Password reset is enabled once Supabase accounts are connected.", "error");
          return;
        }
        const btn = $("#forgot_submit");
        btn.disabled = true;
        btn.textContent = "Sending…";
        try {
          await REC.auth.resetPassword(email);
          UI.toast("Reset link sent — check your inbox.", "success");
          btn.disabled = false;
          btn.textContent = "Resend Reset Link";
        } catch (err) {
          UI.toast(err.message || "Could not send reset link", "error");
          btn.disabled = false;
          btn.textContent = "Send Reset Link";
        }
      });

    // Set new password after recovery email click
    $("#recovery_form") &&
      $("#recovery_form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const pw = $("#recovery_password").value;
        const confirm = $("#recovery_confirm").value;
        if (pw.length < 6) return UI.toast("Password must be at least 6 characters", "warning");
        if (pw !== confirm) return UI.toast("Passwords do not match", "warning");
        if (!REC.isSupabaseConfigured() || !REC.supabaseClient || !REC.auth.updatePassword) {
          UI.toast("Password recovery is enabled once Supabase accounts are connected.", "error");
          return;
        }
        const btn = $("#recovery_submit");
        btn.disabled = true;
        btn.textContent = "Updating…";
        try {
          await REC.auth.updatePassword(pw);
          await REC.auth.signOut();
          UI.toast("Password updated — please sign in.", "success");
          const tr = $("#tab_row");
          if (tr) tr.style.display = "";
          show("view_login");
        } catch (err) {
          UI.toast(err.message || "Could not update password", "error");
        }
        btn.disabled = false;
        btn.textContent = "Update Password";
      });

    // Login
    $("#login_form") &&
      $("#login_form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = $("#login_submit");
        btn.disabled = true;
        btn.textContent = "Signing in…";
        try {
          const email = $("#login_email").value.trim();
          const password = $("#login_password").value;
          if (!REC.isSupabaseConfigured() || !REC.supabaseClient) {
            throw new Error("Accounts are enabled once Supabase is connected. For now, use guest checkout.");
          }
          await REC.auth.signIn(email, password);
          UI.toast("Welcome back!", "success");
          renderProfile();
        } catch (err) {
          UI.toast(err.message || "Login failed", "error");
          btn.disabled = false;
          btn.textContent = "Sign In";
        }
      });

    // Register
    $("#register_form") &&
      $("#register_form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = $("#register_submit");
        btn.disabled = true;
        btn.textContent = "Creating account…";
        try {
          const name = $("#register_name").value.trim();
          const email = $("#register_email").value.trim();
          const phone = $("#register_phone").value.trim();
          const password = $("#register_password").value;
          if (!REC.isSupabaseConfigured() || !REC.supabaseClient) {
            throw new Error("Accounts are enabled once Supabase is connected. For now, use guest checkout.");
          }
          const { data } = await REC.auth.signUp(email, password, {
            full_name: name,
            phone,
          });
          UI.toast("Account created! Check your email to confirm.", "success");
          btn.disabled = false;
          btn.textContent = "Create Account";
        } catch (err) {
          UI.toast(err.message || "Registration failed", "error");
          btn.disabled = false;
          btn.textContent = "Create Account";
        }
      });

    // Track order
    $("#track_form") &&
      $("#track_form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const ref = $("#track_ref").value.trim();
        if (!ref) return UI.toast("Enter your order reference", "warning");
        const btn = $("#track_submit");
        btn.disabled = true;
        btn.textContent = "Searching…";
        try {
          const order = await REC.orders.track(ref.toUpperCase());
          btn.disabled = false;
          btn.textContent = "Track Order";
          const host = $("#track_result");
          if (!order) {
            host.innerHTML =
              '<div class="empty-state"><h4>Order not found</h4><p>Double-check your reference like <strong>REC-2026-000001</strong>.</p></div>';
            return;
          }
          const statusMap = {
            pending: ["badge-gold", "Pending"],
            confirmed: ["badge-green", "Confirmed"],
            processing: ["badge-gold", "Processing"],
            ready: ["badge-green", "Ready"],
            "out for delivery": ["badge-green", "Out for Delivery"],
            completed: ["badge-green", "Completed"],
            cancelled: ["badge-red", "Cancelled"],
          };
          const [cls, label] = statusMap[order.status] || ["bg-gray", order.status || "Pending"];
const isPickup = order.fulfillment_method === "pickup";
            const destLabel = isPickup
              ? "Pickup station"
              : "Delivery to";
            const destValue = isPickup
              ? order.pickup_station_name || "Pickup"
              : [order.state, order.lga].filter(Boolean).join(", ") || "—";
            host.innerHTML =
              '<div class="pd-order-panel">' +
              "<h3>Order " + UI.esc(order.order_number) + "</h3>" +
              '<div class="sum-row"><span>Status</span><span class="badge ' + cls + '">' + UI.esc(label) + "</span></div>" +
              '<div class="sum-row"><span>Placed</span><span>' + UI.formatDate(order.created_at) + "</span></div>" +
              '<div class="sum-row"><span>Total</span><span>' + (REC.ui.money(order.total)) + "</span></div>" +
              '<div class="sum-row"><span>' + destLabel + '</span><span>' + UI.esc(destValue) + "</span></div>" +
            '<div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1rem">' +
            '<a class="btn btn-whatsapp btn-sm" href="' + REC.whatsapp.general("Hello REC, I\u0027m tracking order " + (order.order_number || "")) + '" target="_blank" rel="noopener">' + UI.icon("i-whatsapp") + "Ask on WhatsApp</a>" +
            "</div></div>";
        } catch (err) {
          btn.disabled = false;
          btn.textContent = "Track Order";
          UI.toast(err.message || "Tracking failed", "error");
        }
      });
  });

  function $$(s, r) {
    return Array.from((r || document).querySelectorAll(s));
  }
})(window);
/* ============================================================
   REC — Order confirmation page
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  function $(id) {
    return document.getElementById(id);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const ref = UI.qs().get("ref");
    const stored = localStorage.getItem("rec_last_order");
    const order = stored ? JSON.parse(stored) : null;

    let reference = ref || (order && order.order_number) || null;

    const refEl = $("order_ref");
    if (reference) refEl.textContent = reference;

    const wa = $("order_wa");
    if (wa) {
      const items = (order && order.items) || [];
      wa.href = REC.whatsapp.order(reference || "my order", items);
    }

    // Show pickup station details when the order is a pickup order.
    if (order && order.fulfillment_method === "pickup" && order.pickup_station_name) {
      const box = $("pickup_box");
      if (box) {
        $("pickup_name").textContent = order.pickup_station_name;
        $("pickup_address").textContent = order.pickup_station_address || "";
        $("pickup_hours").textContent =
          "Pickup is free — bring your order reference (" + reference + ").";
        box.hidden = false;
      }
    }
  });
})(window);
/* ============================================================
   REC — Admin shell (shared): guard, sidebar, helpers
   NOTE: Authorization is enforced by Supabase RLS. This UI only
   improves UX; it never replaces database-level security.
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

const NAV = [
    { key: "dashboard", label: "Dashboard", icon: "i-grid", href: REC.admin("index.html") },
    { key: "orders", label: "Orders", icon: "i-clipboard", href: REC.admin("orders.html"), count: true },
    { key: "products", label: "Products", icon: "i-box", href: REC.admin("products.html") },
    { key: "categories", label: "Categories", icon: "i-layers", href: REC.admin("categories.html") },
    { key: "inventory", label: "Inventory", icon: "i-database", href: REC.admin("inventory.html") },
    { key: "customers", label: "Customers", icon: "i-users", href: REC.admin("customers.html") },
    { key: "delivery", label: "Delivery", icon: "i-truck", href: REC.admin("delivery.html") },
    { key: "pickups", label: "Pickups", icon: "i-map-pin", href: REC.admin("pickups.html") },
    { key: "testimonials", label: "Testimonials", icon: "i-quote", href: REC.admin("testimonials.html") },
    { key: "reviews", label: "Reviews", icon: "i-star", href: REC.admin("reviews.html"), count: true },
    { key: "blog", label: "Blog", icon: "i-file", href: REC.admin("blog.html") },
    { key: "messages", label: "Messages", icon: "i-message", href: REC.admin("messages.html"), count: true },
    { key: "settings", label: "Settings", icon: "i-settings", href: REC.admin("settings.html") },
  ];

  const ADMIN = (win.RECAdmin = win.RECAdmin || {});

  ADMIN.sb = function () {
    REC.initSupabase();
    return REC.supabaseClient;
  };

  ADMIN.guard = async function () {
    REC.initSupabase();
    if (!REC.isSupabaseConfigured() || !REC.supabaseClient) {
      showSetupNotice();
      return false;
    }
    try {
const { data } = await REC.supabaseClient.auth.getSession();
      if (!data.session) {
        location.href = REC.admin("login.html");
        return false;
      }
      const profile = await REC.auth.getProfile(data.session.user.id);
      if (!profile || profile.role !== "admin") {
        location.href = REC.admin("login.html");
        return false;
      }
      REC.auth.cacheUser(data.session.user, profile);
      return true;
    } catch (e) {
      location.href = REC.admin("login.html");
      return false;
    }
  };

  function showSetupNotice() {
    const main = document.getElementById("admin-main") || document.getElementById("admin-shell");
    if (!main) return;
    main.innerHTML =
      '<div class="empty-state" style="padding:4rem 1.5rem">' +
      '<div class="e-icon"><svg style="width:32px;height:32px"><use href="../assets/icons/sprite.svg#i-lock"></use></svg></div>' +
      "<h4>Supabase is not connected yet</h4>" +
      "<p>Add your public Supabase URL and anon key in <code>js/app.js</code>, then run the SQL in <code>supabase/schema.sql</code> and create an admin account.</p>" +
      '<a class="btn btn-primary" style="margin-top:1rem" href="' + REC.admin("login.html") + '">Go to Admin Login</a>' +
      "</div>";
  }

  ADMIN.render = function (activeKey, userLabel) {
    const shell = document.getElementById("admin-shell");
    if (!shell) return;

    let items = NAV.map((n) => {
      const badge = n.count ? '<span class="nav-count" id="nav-count-' + n.key + '"></span>' : "";
      const activeCls = n.key === activeKey ? ' class="active"' : "";
      return (
        '<a href="' +
        n.href +
        '"' +
        activeCls +
        '><svg aria-hidden="true"><use href="../assets/icons/sprite.svg#' +
        n.icon +
        '"></use></svg><span>' +
        n.label +
        "</span>" +
        badge +
        "</a>"
      );
    });

    const user = REC.auth.currentUser();
    const name = user && user.profile ? user.profile.full_name : userLabel || "";
    const initials = UI.initials(name) || "R";

    shell.innerHTML =
      '<aside class="admin-sidebar" id="admin-sidebar">' +
      '<div class="as-brand">' +
      '<img src="../assets/logo/rec-logo.jpg" alt="REC logo"/>' +
      "<div><b>REC Admin</b><span>Dashboard</span></div>" +
      "</div>" +
      '<nav class="admin-nav" aria-label="Admin">' +
      '<span class="nav-label">Main</span>' +
      items.slice(0, 2).join("") +
      '<span class="nav-label">Catalogs</span>' +
      items.slice(2, 6).join("") +
      '<span class="nav-label">Content</span>' +
      items.slice(6).join("") +
      "</nav>" +
      '<div class="as-foot">' +
      '<div class="as-user">' +
      '<span class="avatar">' + initials + "</span>" +
      "<div><b>" + UI.esc(name) + "</b><small>Administrator</small></div>" +
      "</div>" +
      '<a href="#" class="admin-nav-a" data-logout style="display:flex;align-items:center;gap:.6rem;font-size:.86rem;font-weight:700;color:#d7e6da">' +
      '<svg aria-hidden="true" style="width:18px;height:18px"><use href="../assets/icons/sprite.svg#i-logout"></use></svg> Sign Out</a>' +
      "</div>" +
      "</aside>" +
      '<div class="admin-backdrop" id="admin-backdrop"></div>' +
      '<div class="admin-main" id="admin-main">' +
      '<div class="admin-topbar">' +
      '<button type="button" class="btn btn-outline mb-toggle" id="mb-toggle" aria-label="Open menu">' +
      '<svg aria-hidden="true" style="width:20px;height:20px"><use href="../assets/icons/sprite.svg#i-menu"></use></svg></button>' +
      "<h1 id=\"page-title\"></h1>" +
      '<a class="btn btn-sm btn-outline" href="../index.html" target="_blank">View Website</a>' +
      "</div>" +
      '<div id="admin-content"></div>' +
      "</div>";

document.querySelector("[data-logout]").addEventListener("click", async (e) => {
      e.preventDefault();
      await REC.auth.signOut();
      location.href = REC.admin("login.html");
    });

    const toggle = document.getElementById("mb-toggle");
    const sidebar = document.getElementById("admin-sidebar");
    const backdrop = document.getElementById("admin-backdrop");
    if (toggle) {
      toggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        if (backdrop) backdrop.classList.toggle("show", sidebar.classList.contains("open"));
      });
      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
      });
    }
  };

  ADMIN.setState = function () {
    document.getElementById("page-title").textContent = document.title.replace("| REC Admin", "").trim();
  };

  /* Registers a page controller only when its data-page matches the
     current admin page. Without this, every controller in this
     consolidated file would overwrite win.AdminPage and the last one
     (Orders) would render on every page. */
  ADMIN.register = function (key, page) {
    const root = document.getElementById("admin-shell");
    if (root && (root.getAttribute("data-page") || "dashboard") === key) {
      win.AdminPage = page;
    }
  };

  ADMIN.setCount = function (key, n) {
    const el = document.getElementById("nav-count-" + key);
    if (el) {
      el.textContent = n;
      el.style.display = n > 0 ? "inline-block" : "none";
    }
  };

  ADMIN.skeleton = function (rows) {
    let tds = "";
    for (let i = 0; i < rows; i++) {
      tds +=
        "<tr>" +
        Array.from({ length: 5 }, () => '<td><div class="skeleton" style="height:16px"></div></td>').join("") +
        "</tr>";
    }
    return '<div class="table-wrap"><table class="data-table">' + tds + "</table></div>";
  };

  ADMIN.escapeXml = UI.esc;
  ADMIN.money = UI.money;
  ADMIN.date = UI.formatDate;
  ADMIN.toast = UI.toast;
  ADMIN.emptyState = UI.emptyState;
  ADMIN.icon = UI.icon;
  ADMIN.esc = UI.esc;

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("admin-shell");
    if (root) {
      ADMIN.guard().then((ok) => {
        if (!ok) return;
        const active = root.getAttribute("data-page") || "dashboard";
        ADMIN.render(active);
        if (win.AdminPage && win.AdminPage.init) win.AdminPage.init();
      });
    }
    const loginCard = document.getElementById("admin-login-card");
    if (loginCard && win.AdminLogin) win.AdminLogin.init();
  });
})(window);
/* ============================================================
   REC — Admin login
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const UI = REC.ui;

  const AdminLogin = {
    async init() {
      const form = document.getElementById("admin_login_form");
      if (!form) return;

      REC.initSupabase();
      if (!REC.isSupabaseConfigured() || !REC.supabaseClient) {
        document.getElementById("al_setup_note").style.display = "block";
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("al_submit");
        btn.disabled = true;
        btn.textContent = "Signing in…";
        try {
          if (!REC.supabaseClient) throw new Error("Supabase is not configured yet. Check js/app.js.");
          await REC.auth.signIn(
            document.getElementById("al_email").value.trim(),
            document.getElementById("al_password").value
          );
          const cur = REC.auth.currentUser();
          if (!cur || !cur.profile || cur.profile.role !== "admin") {
            await REC.auth.signOut();
            throw new Error("This account does not have admin access.");
          }
UI.toast("Welcome back, " + (cur.profile.full_name || "Admin") + "!", "success");
          setTimeout(() => (window.location.href = REC.admin("index.html")), 500);
        } catch (err) {
          UI.toast(err.message || "Login failed", "error");
          btn.disabled = false;
          btn.textContent = "Sign In to Dashboard";
        }
      });
    },
  };

  win.AdminLogin = AdminLogin;
})(window);
/* ============================================================
   REC — Admin Dashboard (real data from Supabase)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    async init() {
      document.title = "Dashboard | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!content) return;

      if (!sb()) {
        content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase to view your dashboard.");
        return;
      }

      content.innerHTML =
        '<div class="stat-grid" id="stat_grid">' +
        Array.from({ length: 6 }, () =>
          '<div class="stat-card"><div class="skeleton" style="height:14px;width:50%"></div><div class="skeleton" style="height:26px;width:60%;margin-top:8px"></div></div>'
        ).join("") +
        "</div>" +
        '<div class="chart-grid">' +
        '<div class="admin-panel"><div class="ap-head"><h3>Revenue (last 7 days)</h3></div><div class="ap-body chart-box" id="revenue_chart"><div class="skeleton" style="height:180px"></div></div></div>' +
        '<div class="admin-panel"><div class="ap-head"><h3>Order Status</h3></div><div class="ap-body chart-box" id="status_chart"><div class="skeleton" style="height:180px"></div></div></div>' +
        "</div>" +
        '<div class="chart-grid">' +
        '<div class="admin-panel"><div class="ap-head"><h3>Recent Orders</h3></div><div class="ap-body" id="recent_orders"><div class="skeleton" style="height:120px"></div></div></div>' +
        '<div class="admin-panel"><div class="ap-head"><h3>Top Products</h3></div><div class="ap-body" id="top_products"><div class="skeleton" style="height:120px"></div></div></div>' +
        "</div>";

      try {
        const [orders, products, customers, statusAgg] = await Promise.all([
          sb().from("orders").select("id,order_number,status,total,state,created_at,full_name").order("created_at", { ascending: false }).limit(200),
          sb().from("products").select("id,name,stock_quantity,price,category_id"),
          sb().from("customers").select("id").limit(1000),
          sb().from("orders").select("status"),
        ]);

        const ordersArr = orders.data || [];
        const productsArr = products.data || [];
        const customersCount = (customers.data || []).length;

        AdminPage.renderStats(ordersArr, productsArr, customersCount, statusAgg.data || []);
        AdminPage.renderRecent(ordersArr);
        AdminPage.renderTopProducts(productsArr);
        AdminPage.renderRevenue(ordersArr);
        AdminPage.renderStatus(statusAgg.data || []);
      } catch (err) {
        content.innerHTML = ADMIN.emptyState("Could not load dashboard", err.message || "Check your connection and retry.");
      }
    },

    renderStats(orders, products, customersCount) {
      const pending = orders.filter((o) => o.status === "pending").length;
      const completed = orders.filter((o) => o.status === "completed").length;
      const revenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + Number(o.total || 0), 0);
      const lowStock = products.filter((p) => Number(p.stock_quantity) <= 5).length;
      const cards = [
        { label: "Total Orders", value: orders.length },
        { label: "Pending Orders", value: pending },
        { label: "Completed Orders", value: completed },
        { label: "Total Customers", value: customersCount },
        { label: "Products", value: products.length },
        { label: "Low Stock Items", value: lowStock, warn: lowStock > 0 },
      ];
      const el = document.getElementById("stat_grid");
      el.innerHTML = cards
        .map(
          (c) =>
            '<div class="stat-card"><div class="sc-label">' + c.label + "</div>" +
            '<div class="sc-value">' + c.value + "</div>" +
            (c.label === "Low Stock Items"
              ? '<div class="sc-sub ' + (c.warn ? "down" : "up") + '">' + (c.warn ? "Review inventory" : "All healthy") + "</div>"
              : "") +
            "</div>"
        )
        .join("");
    },

    renderRecent(orders) {
      const host = document.getElementById("recent_orders");
      if (!orders.length) {
        host.innerHTML = ADMIN.emptyState("No orders yet", "Orders placed on the website will appear here.");
        return;
      }
      const statusLabels = {
        pending: ["badge-gold", "Pending"], confirmed: ["badge-green", "Confirmed"],
        processing: ["badge-gold", "Processing"], ready: ["badge-green", "Ready"],
        "out for delivery": ["badge-green", "Out for Delivery"],
        completed: ["badge-green", "Completed"], cancelled: ["badge-red", "Cancelled"],
      };
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Reference</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>" +
        orders
          .slice(0, 6)
          .map((o) => {
            const [cls, label] = statusLabels[o.status] || ["badge-gray", o.status || "Pending"];
            return (
              "<tr><td class=\"t-strong\">" + ADMIN.esc(o.order_number) + "</td><td>" + ADMIN.esc(o.full_name) + "</td>" +
              '<td>' + ADMIN.money(o.total) + "</td><td><span class=\"badge " + cls + "\">" + label + "</span></td>" +
              "<td>" + ADMIN.date(o.created_at) + "</td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div>";
    },

    renderStatus(statuses) {
      const host = document.getElementById("status_chart");
      if (!host) return;
      const counts = {};
      statuses.forEach((o) => {
        counts[o.status || "pending"] = (counts[o.status || "pending"] || 0) + 1;
      });
      const order = ["pending", "confirmed", "processing", "ready", "out for delivery", "completed", "cancelled"];
      const labels = {
        pending: ["Pending", "#d9a441"], confirmed: ["Confirmed", "#2f9e4f"],
        processing: ["Processing", "#5bb98a"], ready: ["Ready", "#2e8b5c"],
        "out for delivery": ["Out for Delivery", "#1d5d3f"], completed: ["Completed", "#3E8137"], cancelled: ["Cancelled", "#c14b3a"],
      };
      const colors = [];
      const parts = [];
      let total = 0;
      order.forEach((k) => {
        const n = counts[k] || 0;
        if (n > 0 && labels[k]) {
          parts.push([k, n]);
          colors.push(labels[k][1]);
          total += n;
        }
      });
      if (!total) {
        host.innerHTML = ADMIN.emptyState("No status data", "Orders will drive this chart.");
        return;
      }
      const palette = ["#2f9e4f", "#d9a441", "#5bb98a", "#1d5d3f", "#3E8137", "#7fae55", "#c14b3a"];
      const deg = parts.length === 1 ? 360 : 359.9;
      let from = 0;
      const stops = parts
        .map((p, i) => {
          const c = palette[(colors.length > 1 ? i : 0) % palette.length];
          const pct = (p[1] / total) * deg;
          const seg = c + " " + from.toFixed(1) + "% " + (from + pct).toFixed(1) + "%";
          from += pct;
          return seg;
        })
        .join(", ");
      const legend = parts
        .map((p, i) => {
          const c = palette[(colors.length > 1 ? i : 0) % palette.length];
          return "<li><span class=\"dot\" style=\"background:" + c + "\"></span>" +
            (labels[p[0]] ? labels[p[0]][0] : p[0]) + " — " + p[1] + "</li>";
        })
        .join("");
      host.innerHTML =
        '<div class="donut">' +
        '<div class="donut-ring" style="background:conic-gradient(' + stops + ')">' +
        '<div class="ring-inner">' + total + "<br/>orders</div></div>" +
        '<ul class="donut-legend">' + legend + "</ul></div>";
    },

    renderRevenue(orders) {
      const host = document.getElementById("revenue_chart");
      if (!host) return;
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const key = d.toDateString();
        const label = d.toLocaleDateString("en-NG", { weekday: "short" });
        const sum = orders
          .filter((o) => o.status !== "cancelled" && new Date(o.created_at).toDateString() === key)
          .reduce((s, o) => s + Number(o.total || 0), 0);
        days.push({ label, sum });
      }
      const max = Math.max.apply(null, days.map((d) => d.sum)) || 1;
      host.innerHTML =
        '<div class="bars">' +
        days
          .map(
            (d) =>
              '<div class="bar-col"><div class="bar" style="height:' + (d.sum ? Math.max(4, (d.sum / max) * 100) : 2) + '%"></div>' +
              "<span>" + d.label + "</span></div>"
          )
          .join("") +
        "</div>" +
        '<p class="hint">Total revenue per day (last 7 days), excluding cancelled orders.</p>';
    },

    renderTopProducts(products) {
      const host = document.getElementById("top_products");
      const sorted = products.slice().sort((a, b) => Number(b.stock_quantity) - Number(a.stock_quantity)).slice(0, 5);
      const low = products.filter((p) => p.stock_quantity <= 5).length;
      host.innerHTML =
        '<div class="pd-meta-grid" style="grid-template-columns:1fr">' +
        sorted
          .map(
            (p) =>
              '<div class="pd-meta"><svg aria-hidden="true"><use href="' + REC.sprite("i-box") + '"></use></svg>' +
              "<div><strong>" + ADMIN.esc(p.name) + "</strong>" + p.stock_quantity + " in stock</div></div>"
          )
          .join("") +
        "</div>" +
        '<p class="admin-login-note" style="margin-top:1rem">' + low + " product" + (low === 1 ? "" : "s") + " at or below minimum stock.</p>";
    },
  };

  ADMIN.register("dashboard", AdminPage);
})(window);
/* ============================================================
   REC — Admin Products (CRUD + image upload)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { products: [], categories: [], editId: null, search: "" },

    async init() {
      document.title = "Products | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head">' +
        '<div><h3>Products</h3><span style="font-size:.8rem;color:var(--muted)">Manage your catalogue — everything updates live on the website.</span></div>' +
        '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
        '<input class="input" id="p_search" type="search" placeholder="Search..." style="max-width:200px;padding:.55rem .8rem"/>' +
        '<button class="btn btn-sm btn-primary" id="p_add"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-plus") + '"></use></svg> Add Product</button>' +
        "</div></div>" +
        '<div class="ap-body" id="p_list">' +
        ADMIN.skeleton(6) +
        "</div></div>";

      await this.load();
      this.bind();
    },

    async load() {
      const [p, c] = await Promise.all([
        sb().from("products").select("*").order("created_at", { ascending: false }),
        sb().from("categories").select("*").order("sort_order"),
      ]);
      this.state.products = p.data || [];
      this.state.categories = c.data || [];
      ADMIN.setCount("products", this.state.products.length);
      this.render();
    },

    render() {
      const host = document.getElementById("p_list");
      if (!host) return;
      let list = this.state.products;
      const s = this.state.search.trim().toLowerCase();
      if (s) list = list.filter((x) => x.name.toLowerCase().includes(s));
      if (!list.length) {
        host.innerHTML = ADMIN.emptyState(
          "No products yet",
          "Add your first product to make it visible in the shop."
        );
        return;
      }
      const catName = (id) => {
        const c = this.state.categories.find((x) => x.id === id);
        return c ? c.name : "—";
      };
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Online Orderable</th><th>Status</th><th></th>" +
        "</tr></thead><tbody>" +
        list
          .map(
            (p) =>
              "<tr>" +
              '<td><div class="t-prod"><img src="' + ADMIN.esc(REC.asset(p.image_url || "images/placeholder-product.svg")) + '" alt=""/>' +
              '<div><span class="t-strong">' + ADMIN.esc(p.name) + "</span><br/>" +
              '<span style="font-size:.78rem;color:var(--muted)">' + ADMIN.esc(p.unit || "") + "</span></div></div></td>" +
              "<td>" + ADMIN.esc(catName(p.category_id)) + "</td>" +
              "<td class=\"t-strong\">" + ADMIN.money(p.price) + "</td>" +
              "<td>" + (p.stock_quantity > 0 ? p.stock_quantity : '<span style="color:var(--danger);font-weight:700">0</span>') + "</td>" +
              "<td><span class=\"badge " + (p.online_orderable ? "badge-green" : "badge-red") + '">' + (p.online_orderable ? "Yes" : "Visit Farm") + "</span></td>" +
              "<td><span class=\"badge " + (p.active ? "badge-green" : "badge-gray") + '">' + (p.active ? "Active" : "Hidden") + "</span>" +
              (p.featured ? ' <span class="badge badge-gold">F</span>' : "") + "</td>" +
              '<td><div class="t-actions">' +
              '<button class="t-btn" data-edit="' + p.id + '" title="Edit"><svg><use href="' + REC.sprite("i-edit") + '"></use></svg></button>' +
              '<button class="t-btn danger" data-del="' + p.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    bind() {
      const search = document.getElementById("p_search");
      if (search) {
        search.addEventListener("input", () => {
          this.state.search = search.value;
          this.render();
        });
      }
      document.getElementById("p_add").addEventListener("click", () => this.openForm());
      document.addEventListener("click", (e) => {
        const ed = e.target.closest("[data-edit]");
        if (ed) this.openForm(ed.getAttribute("data-edit"));
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });
    },

    openForm(id) {
      this.state.editId = id || null;
      const p = id ? this.state.products.find((x) => x.id === id) : null;
      const cats = this.state.categories;
      let modal = document.getElementById("p_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "p_modal";
        document.body.appendChild(modal);
      }
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>" + (p ? "Edit Product" : "Add Product") + "</h3>" +
        '<div class="admin-grid-2">' +
        '<div class="field"><label for="pf_name">Name *</label><input class="input" id="pf_name" value="' + ADMIN.esc(p ? p.name : "") + '"/></div>' +
        '<div class="field"><label for="pf_unit">Unit</label><input class="input" id="pf_unit" value="' + ADMIN.esc(p ? p.unit || "" : "per item") + '"/></div>' +
        '<div class="field"><label for="pf_price">Price (₦) *</label><input class="input" id="pf_price" type="number" min="0" step="0.01" value="' + (p ? p.price : "") + '"/></div>' +
        '<div class="field"><label for="pf_stock">Stock quantity</label><input class="input" id="pf_stock" type="number" min="0" value="' + (p ? p.stock_quantity : 0) + '"/></div>' +
        '<div class="field"><label for="pf_cat">Category</label><select class="select" id="pf_cat">' +
        cats
          .map((c) => '<option value="' + c.id + '"' + (p && p.category_id === c.id ? " selected" : "") + ">" + ADMIN.esc(c.name) + "</option>")
          .join("") +
        "</select></div>" +
        '<div class="field"><label for="pf_moq">Minimum order qty</label><input class="input" id="pf_moq" type="number" min="1" value="' + (p ? p.minimum_order_quantity : 1) + '"/></div>' +
        '<div class="field full"><label for="pf_desc">Description</label><textarea class="textarea" id="pf_desc" style="min-height:90px">' + ADMIN.esc(p ? p.description || "" : "") + "</textarea></div>" +
        '<div class="field"><label for="pf_breed">Breed / Type</label><input class="input" id="pf_breed" value="' + ADMIN.esc(p ? p.breed || "" : "") + '"/></div>' +
        '<div class="field"><label for="pf_age">Age</label><input class="input" id="pf_age" value="' + ADMIN.esc(p ? p.age || "" : "") + '"/></div>' +
        '<div class="field"><label for="pf_sex">Sex</label><input class="input" id="pf_sex" value="' + ADMIN.esc(p ? p.sex || "" : "") + '"/></div>' +
        '<div class="field"><label for="pf_weight">Weight</label><input class="input" id="pf_weight" value="' + ADMIN.esc(p ? p.weight || "" : "") + '"/></div>' +
        '<div class="field"><label for="pf_size">Size</label><input class="input" id="pf_size" placeholder="e.g. Large" value="' + ADMIN.esc(p ? p.size || "" : "") + '"/></div>' +
        '<div class="field full"><label for="pf_delivery">Delivery info</label><input class="input" id="pf_delivery" value="' + ADMIN.esc(p ? p.delivery_info || "" : "") + '"/></div>' +
        '<div class="field full"><label for="pf_image">Image URL (or upload)</label>' +
        '<input class="input" id="pf_image" value="' + ADMIN.esc(p ? p.image_url || "" : "") + '" placeholder="https://... or upload a file"/>' +
        '<label class="btn btn-sm btn-outline" style="margin-top:.5rem;width:fit-content;cursor:pointer">' +
        '<svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-upload") + '"></use></svg> Upload Image' +
        '<input type="file" id="pf_file" accept="image/*" style="display:none"/></label>' +
        '<span class="hint" id="pf_upload_hint"></span></div>' +
        "</div>" +
        '<div class="switch-row"><div><div class="sr-label">Active</div><div class="sr-hint">Visible in shop</div></div>' +
        '<label class="switch"><input type="checkbox" id="pf_active"' + (!p || p.active ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="switch-row"><div><div class="sr-label">Featured</div><div class="sr-hint">Show in Featured Products</div></div>' +
        '<label class="switch"><input type="checkbox" id="pf_featured"' + (p && p.featured ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="switch-row"><div><div class="sr-label">Online orderable</div><div class="sr-hint">Turn off to show “Visit Farm to Purchase”</div></div>' +
        '<label class="switch"><input type="checkbox" id="pf_online"' + (!p || p.online_orderable ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="form-actions">' +
        '<button class="btn btn-primary" id="pf_save">Save Product</button>' +
        '<button class="btn btn-outline" data-close>Cancel</button>' +
        "</div></div>";

      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
      document.getElementById("pf_save").addEventListener("click", () => this.save());

      document.getElementById("pf_file").addEventListener("change", async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        const hint = document.getElementById("pf_upload_hint");
        hint.textContent = "Uploading…";
        try {
          const path = "products/" + Date.now() + "-" + file.name.replace(/\s+/g, "-");
          const { error } = await sb().storage.from(REC.config.storageBucket).upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });
          if (error) throw error;
          const { data } = sb().storage.from(REC.config.storageBucket).getPublicUrl(path);
          document.getElementById("pf_image").value = data.publicUrl;
          hint.textContent = "Uploaded ✓";
        } catch (e) {
          hint.textContent = "Upload failed: " + e.message;
        }
      });
    },

    async save() {
      const get = (id) => document.getElementById(id);
      const name = get("pf_name").value.trim();
      const price = Number(get("pf_price").value || 0);
      if (!name || price < 0) return ADMIN.toast("Name and price are required", "error");

      const btn = get("pf_save");
      btn.disabled = true;
      btn.textContent = "Saving…";

      const payload = {
        name,
        unit: get("pf_unit").value.trim() || "each",
        price,
        stock_quantity: Number(get("pf_stock").value || 0),
        category_id: Number(get("pf_cat").value) || null,
        minimum_order_quantity: Number(get("pf_moq").value || 1),
        description: get("pf_desc").value.trim(),
        breed: get("pf_breed").value.trim() || null,
        age: get("pf_age").value.trim() || null,
        sex: get("pf_sex").value.trim() || null,
        weight: get("pf_weight").value.trim() || null,
        size: get("pf_size").value.trim() || null,
        delivery_info: get("pf_delivery").value.trim() || null,
        image_url: get("pf_image").value.trim() || null,
        active: get("pf_active").checked,
        featured: get("pf_featured").checked,
        online_orderable: get("pf_online").checked,
      };

      try {
        if (this.state.editId) {
          const { error } = await sb().from("products").update(payload).eq("id", this.state.editId);
          if (error) throw error;
          ADMIN.toast("Product updated", "success");
        } else {
          payload.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          const { error } = await sb().from("products").insert(payload);
          if (error) throw error;
          ADMIN.toast("Product created", "success");
        }
        document.getElementById("p_modal").classList.remove("open");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Save Product";
      }
    },

    async remove(id) {
      const p = this.state.products.find((x) => x.id === id);
      if (!p) return;
      if (!confirm("Delete \"" + p.name + "\"? This cannot be undone.")) return;
      try {
        const { error } = await sb().from("products").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Product deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("products", AdminPage);
})(window);
/* ============================================================
   REC — Admin Categories (CRUD)
   Schema: name, slug, description, image, sort_order
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const slugify = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const AdminPage = {
    state: { rows: [] },

    async init() {
      document.title = "Categories | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Categories</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">These drive the navigation tiles on the homepage.</span></div>' +
        '<button class="btn btn-sm btn-primary" id="c_add"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-plus") + '"></use></svg> Add Category</button></div>' +
        '<div class="ap-body" id="c_list">' + ADMIN.skeleton(4) + "</div></div>";

      await this.load();
      document.getElementById("c_add").addEventListener("click", () => this.openForm());
      document.getElementById("c_list").addEventListener("click", (e) => {
        const ed = e.target.closest("[data-edit]");
        if (ed) this.openForm(ed.getAttribute("data-edit"));
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });
    },

    async load() {
      const { data, error } = await sb().from("categories").select("*").order("sort_order");
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      ADMIN.setCount("categories", this.state.rows.length);
      this.render();
    },

    render() {
      const host = document.getElementById("c_list");
      if (!host) return;
      if (!this.state.rows.length) {
        host.innerHTML = ADMIN.emptyState("No categories", "Add categories to fill the homepage tiles.");
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr><th>Category</th><th>Slug</th><th>Image</th><th>Sort</th><th></th></tr></thead><tbody>' +
        this.state.rows
          .map(
            (c) =>
              "<tr>" +
              '<td class="t-strong">' + ADMIN.esc(c.name) + "</td>" +
              "<td><code>" + ADMIN.esc(c.slug) + "</code></td>" +
              '<td><div class="t-prod"><img src="' + ADMIN.esc(REC.asset(c.image || "images/placeholder-product.svg")) + '" alt=""/></div></td>' +
              "<td>" + c.sort_order + "</td>" +
              '<td><div class="t-actions">' +
              '<button class="t-btn" data-edit="' + c.id + '" title="Edit"><svg><use href="' + REC.sprite("i-edit") + '"></use></svg></button>' +
              '<button class="t-btn danger" data-del="' + c.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    openForm(id) {
      const c = id ? this.state.rows.find((x) => String(x.id) === String(id)) : null;
      let modal = document.getElementById("c_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "c_modal";
        document.body.appendChild(modal);
      }
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>" + (c ? "Edit Category" : "Add Category") + "</h3>" +
        '<div class="field"><label for="cf_name">Name *</label><input class="input" id="cf_name" value="' + ADMIN.esc(c ? c.name : "") + '"/></div>' +
        '<div class="field"><label for="cf_desc">Description</label><textarea class="textarea" id="cf_desc" style="min-height:70px">' + ADMIN.esc(c ? c.description || "" : "") + "</textarea></div>" +
        '<div class="field"><label for="cf_image">Image URL</label><input class="input" id="cf_image" value="' + ADMIN.esc(c ? c.image || "" : "") + '" placeholder="https://… or assets/images/…"/>' +
        '<label class="btn btn-sm btn-outline" style="margin-top:.5rem;width:fit-content;cursor:pointer"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-upload") + '"></use></svg> Upload' +
        '<input type="file" id="cf_file" accept="image/*" style="display:none"/></label></div>' +
        '<div class="field"><label for="cf_sort">Sort order</label><input class="input" id="cf_sort" type="number" value="' + (c ? c.sort_order : 1) + '"/></div>' +
        '<div class="form-actions"><button class="btn btn-primary" id="cf_save">Save</button><button class="btn btn-outline" data-close>Cancel</button></div></div>';
      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
      document.getElementById("cf_save").addEventListener("click", () => this.save(id));

      document.getElementById("cf_file").addEventListener("change", async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        try {
          const path = "categories/" + Date.now() + "-" + file.name.replace(/\s+/g, "-");
          const { error } = await sb().storage.from(REC.config.storageBucket).upload(path, file, { contentType: file.type });
          if (error) throw error;
          const { data } = sb().storage.from(REC.config.storageBucket).getPublicUrl(path);
          document.getElementById("cf_image").value = data.publicUrl;
          ADMIN.toast("Image uploaded", "success");
        } catch (e) {
          ADMIN.toast(e.message || "Upload failed", "error");
        }
      });
    },

    async save(id) {
      const name = document.getElementById("cf_name").value.trim();
      if (!name) return ADMIN.toast("Name is required", "error");
      const existing = id ? this.state.rows.find((x) => String(x.id) === String(id)) : null;
      const payload = {
        name,
        slug: existing ? existing.slug : slugify(name),
        description: document.getElementById("cf_desc").value.trim() || null,
        image: document.getElementById("cf_image").value.trim() || null,
        sort_order: Number(document.getElementById("cf_sort").value || 1),
      };
      try {
        if (id) {
          const { error } = await sb().from("categories").update(payload).eq("id", id);
          if (error) throw error;
          ADMIN.toast("Category updated", "success");
        } else {
          const { error } = await sb().from("categories").insert(payload);
          if (error) throw error;
          ADMIN.toast("Category created", "success");
        }
        document.getElementById("c_modal").classList.remove("open");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      }
    },

    async remove(id) {
      const c = this.state.rows.find((x) => String(x.id) === String(id));
      if (!c) return;
      if (!confirm('Delete "' + c.name + '"? Products keep their category name.')) return;
      try {
        const { error } = await sb().from("categories").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Category deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("categories", AdminPage);
})(window);
/* ============================================================
   REC — Admin Inventory (stock levels + adjustments)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { rows: [], filter: "all", search: "" },

    async init() {
      document.title = "Inventory | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Inventory</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Track stock levels. Low stock highlights items needing attention.</span></div>' +
        '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
        '<select class="select" id="inv_filter" style="max-width:180px">' +
        '<option value="all">All items</option><option value="low">Low stock only</option><option value="out">Out of stock</option></select>' +
        '<input class="input" id="inv_search" type="search" placeholder="Search..." style="max-width:200px;padding:.55rem .8rem"/>' +
        "</div></div>" +
        '<div class="ap-body" id="inv_list">' + ADMIN.skeleton(6) + "</div></div>";

      await this.load();
      document.getElementById("inv_filter").addEventListener("change", (e) => { this.state.filter = e.target.value; this.render(); });
      document.getElementById("inv_search").addEventListener("input", (e) => { this.state.search = e.target.value; this.render(); });
      document.getElementById("inv_list").addEventListener("click", (e) => this.onQty(e));
    },

    async load() {
      const { data, error } = await sb().from("products").select("id,name,stock_quantity,price,unit,active").order("name");
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      this.render();
    },

    render() {
      const host = document.getElementById("inv_list");
      let list = this.state.rows;
      if (this.state.filter === "low") list = list.filter((r) => r.stock_quantity <= 5 && r.stock_quantity > 0);
      if (this.state.filter === "out") list = list.filter((r) => r.stock_quantity <= 0);
      const s = this.state.search.trim().toLowerCase();
      if (s) list = list.filter((r) => r.name.toLowerCase().includes(s));

      if (!list.length) {
        host.innerHTML = ADMIN.emptyState("No items found", "Adjust the filter or search.");
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Product</th><th>Unit</th><th>In Stock</th><th>Status</th><th>Adjustment</th>" +
        "</tr></thead><tbody>" +
        list
          .map((r) => {
            const st = r.stock_quantity <= 0 ? ['badge-red', "Out of stock"] : r.stock_quantity <= 5 ? ['badge-gold', "Low stock"] : ['badge-green', "In stock"];
            return (
              "<tr>" +
              '<td class="t-strong">' + ADMIN.esc(r.name) + "</td>" +
              "<td>" + ADMIN.esc(r.unit || "each") + "</td>" +
              '<td class="t-strong">' + r.stock_quantity + "</td>" +
              '<td><span class="badge ' + st[0] + '">' + st[1] + "</span></td>" +
              "<td><div style=\"display:flex;gap:.3rem;align-items:center\">" +
              '<input class="input" id="inv_qty_' + r.id + '" type="number" value="' + r.stock_quantity + '" style="width:70px;padding:.4rem .5rem"/>' +
              '<button class="btn btn-sm btn-primary" data-save="' + r.id + '">Save</button>' +
              "</div></td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div>";
    },

    async onQty(e) {
      const btn = e.target.closest("[data-save]");
      if (!btn) return;
      const id = btn.getAttribute("data-save");
      const qty = Number(document.getElementById("inv_qty_" + id).value);
      if (isNaN(qty) || qty < 0) return ADMIN.toast("Enter a valid quantity", "error");
      try {
        const { error } = await sb().from("products").update({ stock_quantity: qty }).eq("id", id);
        if (error) throw error;
        ADMIN.toast("Stock updated", "success");
        await this.load();
      } catch (err) {
        ADMIN.toast(err.message || "Update failed", "error");
      }
    },
  };

  ADMIN.register("inventory", AdminPage);
})(window);
/* ============================================================
   REC — Admin Customers (list from orders + customers)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { customers: [] },

    async init() {
      document.title = "Customers | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Customers</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Everyone who has placed an order or created an account.</span></div>' +
        '<input class="input" id="cu_search" type="search" placeholder="Search..." style="max-width:220px;padding:.55rem .8rem"/></div>' +
        '<div class="ap-body" id="cu_list">' + ADMIN.skeleton(5) + "</div></div>";

      await this.load();
      document.getElementById("cu_search").addEventListener("input", (e) => this.render(e.target.value));
    },

    async load() {
      const [ordersR, customersR] = await Promise.all([
        sb().from("orders").select("full_name,email,phone,delivery_address,lga,state,id,order_number,created_at,total,status"),
        // profiles has no email column; customers is the table that carries
        // the contact details for people who ordered or created an account.
        sb().from("customers").select("email,full_name,phone,created_at"),
      ]);
      const map = {};
      (ordersR.data || []).forEach((o) => {
        const key = (o.email || "").toLowerCase();
        if (!key) return;
        if (!map[key]) {
          map[key] = { name: o.full_name || "", email: o.email || "", phone: o.phone || "", delivery_address: o.delivery_address || "", lga: o.lga || "", state: o.state || "", orders: 0, spent: 0, first: o.created_at };
        }
        map[key].orders += 1;
        if (o.status !== "cancelled") map[key].spent += Number(o.total || 0);
      });
      (customersR.data || []).forEach((p) => {
        const key = (p.email || "").toLowerCase();
        if (!key) return;
        if (!map[key]) map[key] = { name: p.full_name || "", email: p.email || "", phone: p.phone || "", delivery_address: "", lga: "", state: "", orders: 0, spent: 0, first: p.created_at };
      });
      this.state.customers = Object.values(map);
      ADMIN.setCount("customers", this.state.customers.length);
      this.render();
    },

    render(search) {
      const host = document.getElementById("cu_list");
      let list = this.state.customers;
      const s = (search || "").trim().toLowerCase();
      if (s) list = list.filter((c) => (c.name + "").toLowerCase().includes(s) || (c.email + "").toLowerCase().includes(s) || (c.phone + "").toLowerCase().includes(s));
      if (!list.length) {
        host.innerHTML = ADMIN.emptyState("No customers yet", "Customer details will appear after their first order or signup.");
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Customer</th><th>Location</th><th>Orders</th><th>Spent</th><th>First seen</th>" +
        "</tr></thead><tbody>" +
        list
          .slice()
          .sort((a, b) => b.spent - a.spent)
          .map(
            (c) =>
              "<tr>" +
              '<td class="t-strong">' + ADMIN.esc(c.name || "—") + '<br/><span style="font-size:.78rem;color:var(--muted)">' + ADMIN.esc(c.email) + (c.phone ? " · " + ADMIN.esc(c.phone) : "") + "</span></td>" +
              "<td>" + ADMIN.esc([c.delivery_address, c.lga, c.state].filter(Boolean).join(", ") || "—") + "</td>" +
              "<td>" + c.orders + "</td>" +
              '<td class="t-strong">' + ADMIN.money(c.spent) + "</td>" +
              "<td>" + (c.first ? ADMIN.date(c.first) : "—") + "</td>" +
              "</tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },
  };

  ADMIN.register("customers", AdminPage);
})(window);
/* ============================================================
   REC — Admin Delivery Zones (CRUD)
   Schema: state, lga, delivery_fee, estimated_days, active,
           special_notes  (one row per state → unique index)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { rows: [] },

    async init() {
      document.title = "Delivery | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Delivery Zones</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Delivery fees are charged per state at checkout. Untracked states default to pickup/info after confirmation.</span></div>' +
        '<button class="btn btn-sm btn-primary" id="d_add"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-plus") + '"></use></svg> Add Zone</button></div>' +
        '<div class="ap-body" id="d_list">' + ADMIN.skeleton(6) + "</div></div>";

      await this.load();
      document.getElementById("d_add").addEventListener("click", () => this.openForm());
      document.getElementById("d_list").addEventListener("click", (e) => {
        const ed = e.target.closest("[data-edit]");
        if (ed) this.openForm(ed.getAttribute("data-edit"));
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });
    },

    async load() {
      const { data, error } = await sb().from("delivery_zones").select("*").order("state");
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      ADMIN.setCount("delivery", Math.ceil(this.state.rows.length / 2));
      this.render();
    },

    render() {
      const host = document.getElementById("d_list");
      if (!this.state.rows.length) {
        host.innerHTML = ADMIN.emptyState("No zones yet", "Add states so customers see delivery fees at checkout.");
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr><th>State</th><th>LGA</th><th>Fee</th><th>ETA (days)</th><th>Active</th><th></th></tr></thead><tbody>' +
        this.state.rows
          .map(
            (r) =>
              "<tr>" +
              '<td class="t-strong">' + ADMIN.esc(r.state) + "</td>" +
              "<td>" + ADMIN.esc(r.lga || "All") + "</td>" +
              "<td>" + ADMIN.money(r.delivery_fee) + "</td>" +
              "<td>" + (r.estimated_days != null ? r.estimated_days : "—") + "</td>" +
              '<td><span class="badge ' + (r.active ? "badge-green" : "badge-gray") + '">' + (r.active ? "Active" : "Inactive") + "</span></td>" +
              '<td><div class="t-actions">' +
              '<button class="t-btn" data-edit="' + r.id + '" title="Edit"><svg><use href="' + REC.sprite("i-edit") + '"></use></svg></button>' +
              '<button class="t-btn danger" data-del="' + r.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    openForm(id) {
      const r = id ? this.state.rows.find((x) => String(x.id) === String(id)) : null;
      let modal = document.getElementById("d_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "d_modal";
        document.body.appendChild(modal);
      }
      const stateOpts = REC.products.STATES.map(
          (s) => '<option value="' + s + '"' + (r && r.state === s ? " selected" : "") + ">" + s + "</option>"
        ).join("");
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>" + (r ? "Edit Zone" : "Add Zone") + "</h3>" +
        '<div class="admin-grid-2">' +
        '<div class="field"><label for="df_state">State *</label><select class="select" id="df_state">' + stateOpts + "</select></div>" +
        '<div class="field"><label for="df_lga">LGA (optional)</label><input class="input" id="df_lga" value="' + ADMIN.esc(r ? r.lga || "" : "") + '" placeholder="All"/></div>' +
        '<div class="field"><label for="df_fee">Delivery fee (₦) *</label><input class="input" id="df_fee" type="number" min="0" value="' + (r ? r.delivery_fee : "") + '"/></div>' +
        '<div class="field"><label for="df_days">Estimated days</label><input class="input" id="df_days" type="number" min="0" value="' + (r && r.estimated_days != null ? r.estimated_days : "") + '" placeholder="e.g. 1"/></div>' +
        "</div>" +
        '<div class="field"><label for="df_notes">Special notes</label><input class="input" id="df_notes" value="' + ADMIN.esc(r ? r.special_notes || "" : "") + '" placeholder="e.g. Delivered on Tuesdays & Saturdays"/></div>' +
        '<div class="switch-row"><div><div class="sr-label">Active</div><div class="sr-hint">Use this fee in checkout</div></div>' +
        '<label class="switch"><input type="checkbox" id="df_active"' + (!r || r.active ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="form-actions"><button class="btn btn-primary" id="df_save">Save</button><button class="btn btn-outline" data-close>Cancel</button></div></div>';
      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
      document.getElementById("df_save").addEventListener("click", () => this.save(id));
    },

    async save(id) {
      const state = document.getElementById("df_state").value.trim();
      const fee = Number(document.getElementById("df_fee").value || 0);
      if (!state || fee < 0) return ADMIN.toast("State and a valid fee are required", "error");
      const payload = {
        state,
        lga: document.getElementById("df_lga").value.trim() || null,
        delivery_fee: fee,
        estimated_days: Number(document.getElementById("df_days").value || 0) || null,
        special_notes: document.getElementById("df_notes").value.trim() || null,
        active: document.getElementById("df_active").checked,
      };
      try {
        if (id) {
          const { error } = await sb().from("delivery_zones").update(payload).eq("id", id);
          if (error) throw error;
          ADMIN.toast("Zone updated", "success");
        } else {
          const { error } = await sb().from("delivery_zones").insert(payload);
          if (error) throw error;
          ADMIN.toast("Zone created", "success");
        }
        document.getElementById("d_modal").classList.remove("open");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      }
    },

    async remove(id) {
      const r = this.state.rows.find((x) => String(x.id) === String(id));
      if (!r) return;
      if (!confirm('Delete zone for "' + r.state + '"?')) return;
      try {
        const { error } = await sb().from("delivery_zones").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Zone deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("delivery", AdminPage);
})(window);
/* ============================================================
   REC — Admin Pickup Stations (CRUD)
   Schema: name, state, city, address, contact_phone,
           operating_hours, notes, active, sort_order
   Shown to customers at checkout and on the order confirmation.
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { rows: [] },

    async init() {
      document.title = "Pickup Stations | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Pickup Stations</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Customers can choose one of these at checkout instead of delivery. Active stations show on the website; inactive ones are hidden.</span></div>' +
        '<button class="btn btn-sm btn-primary" id="ps_add"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-plus") + '"></use></svg> Add Station</button></div>' +
        '<div class="ap-body" id="ps_list">' + ADMIN.skeleton(6) + "</div></div>";

      await this.load();
      document.getElementById("ps_add").addEventListener("click", () => this.openForm());
      document.getElementById("ps_list").addEventListener("click", (e) => {
        const ed = e.target.closest("[data-edit]");
        if (ed) this.openForm(ed.getAttribute("data-edit"));
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });
    },

    async load() {
      const { data, error } = await sb().from("pickup_stations").select("*").order("sort_order").order("name");
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      ADMIN.setCount("pickups", this.state.rows.length);
      this.render();
    },

    render() {
      const host = document.getElementById("ps_list");
      if (!this.state.rows.length) {
        host.innerHTML = ADMIN.emptyState("No pickup stations yet", "Add stations so customers can pick up their orders near them.");
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr><th>Station</th><th>State</th><th>Address</th><th>Status</th><th></th></tr></thead><tbody>' +
        this.state.rows
          .map(
            (r) =>
              "<tr>" +
              '<td><div class="t-prod"><div><span class="t-strong">' + ADMIN.esc(r.name) + "</span><br/>" +
              '<span style="font-size:.78rem;color:var(--muted)">' + ADMIN.esc([r.city, r.operating_hours].filter(Boolean).join(" · ") || "") + "</span></div></div></td>" +
              "<td>" + ADMIN.esc(r.state) + "</td>" +
              '<td style="max-width:280px">' + ADMIN.esc(r.address) + "</td>" +
              '<td><span class="badge ' + (r.active ? "badge-green" : "badge-gray") + '">' + (r.active ? "Active" : "Hidden") + "</span></td>" +
              '<td><div class="t-actions">' +
              '<button class="t-btn" data-edit="' + r.id + '" title="Edit"><svg><use href="' + REC.sprite("i-edit") + '"></use></svg></button>' +
              '<button class="t-btn danger" data-del="' + r.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    openForm(id) {
      this.state.editId = id || null;
      const r = id ? this.state.rows.find((x) => String(x.id) === String(id)) : null;
      let modal = document.getElementById("ps_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "ps_modal";
        document.body.appendChild(modal);
      }
      const stateOpts =
        '<option value="">Select state</option>' +
        REC.products.STATES.map(
          (s) => '<option value="' + s + '"' + (r && r.state === s ? " selected" : "") + ">" + s + "</option>"
        ).join("");
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>" + (r ? "Edit Station" : "Add Station") + "</h3>" +
        '<div class="admin-grid-2">' +
        '<div class="field"><label for="psf_name">Station name *</label><input class="input" id="psf_name" value="' + ADMIN.esc(r ? r.name : "") + '" placeholder="e.g. Umuahia Head Office"/></div>' +
        '<div class="field"><label for="psf_city">City / Area</label><input class="input" id="psf_city" value="' + ADMIN.esc(r ? r.city || "" : "") + '" placeholder="e.g. Umuahia"/></div>' +
        '<div class="field"><label for="psf_state">State *</label><select class="select" id="psf_state">' + stateOpts + "</select></div>" +
        '<div class="field"><label for="psf_phone">Contact phone</label><input class="input" id="psf_phone" value="' + ADMIN.esc(r ? r.contact_phone || "" : "") + '" placeholder="e.g. +2348135042997"/></div>' +
        "</div>" +
        '<div class="field"><label for="psf_address">Address / pickup point *</label><textarea class="textarea" id="psf_address" rows="2">' + ADMIN.esc(r ? r.address || "" : "") + '</textarea></div>' +
        '<div class="admin-grid-2">' +
        '<div class="field"><label for="psf_hours">Operating hours</label><input class="input" id="psf_hours" value="' + ADMIN.esc(r ? r.operating_hours || "" : "") + '" placeholder="e.g. Mon–Sat, 8am – 6pm"/></div>' +
        '<div class="field"><label for="psf_fee">Pickup fee (₦) *</label><input class="input" id="psf_fee" type="number" min="0" step="0.01" value="' + (r ? r.pickup_fee : 0) + '"/></div>' +
        '<div class="field"><label for="psf_sort">Sort order</label><input class="input" id="psf_sort" type="number" min="0" value="' + (r ? r.sort_order : 0) + '"/></div>' +
        "</div>" +
        '<div class="field"><label for="psf_notes">Notes for customers</label><input class="input" id="psf_notes" value="' + ADMIN.esc(r ? r.notes || "" : "") + '" placeholder="e.g. Call ahead to confirm your order is ready"/></div>' +
        '<div class="switch-row"><div><div class="sr-label">Active</div><div class="sr-hint">Show this station on the website</div></div>' +
        '<label class="switch"><input type="checkbox" id="psf_active"' + (!r || r.active ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="form-actions"><button class="btn btn-primary" id="psf_save">Save</button><button class="btn btn-outline" data-close>Cancel</button></div></div>';
      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
      document.getElementById("psf_save").addEventListener("click", () => this.save());
    },

    async save() {
      const name = document.getElementById("psf_name").value.trim();
      const state = document.getElementById("psf_state").value.trim();
      const address = document.getElementById("psf_address").value.trim();
      if (!name || !state || !address) return ADMIN.toast("Name, state and address are required", "error");
      const payload = {
        name,
        state,
        address,
        city: document.getElementById("psf_city").value.trim() || null,
        contact_phone: document.getElementById("psf_phone").value.trim() || null,
        operating_hours: document.getElementById("psf_hours").value.trim() || null,
        pickup_fee: Number(document.getElementById("psf_fee").value || 0),
        notes: document.getElementById("psf_notes").value.trim() || null,
        sort_order: Number(document.getElementById("psf_sort").value || 0),
        active: document.getElementById("psf_active").checked,
      };
      try {
        if (this.state.editId) {
          const { error } = await sb().from("pickup_stations").update(payload).eq("id", this.state.editId);
          if (error) throw error;
          ADMIN.toast("Station updated", "success");
        } else {
          const { error } = await sb().from("pickup_stations").insert(payload);
          if (error) throw error;
          ADMIN.toast("Station created", "success");
        }
        document.getElementById("ps_modal").classList.remove("open");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      }
    },

    async remove(id) {
      const r = this.state.rows.find((x) => String(x.id) === String(id));
      if (!r) return;
      if (!confirm('Delete pickup station "' + r.name + '"?')) return;
      try {
        const { error } = await sb().from("pickup_stations").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Station deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("pickups", AdminPage);
})(window);
/* ============================================================
   REC — Admin Testimonials (CRUD)
   Schema: name, location, message, photo_url, rating,
           sample, published
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { rows: [] },

    async init() {
      document.title = "Testimonials | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Customer Reviews</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Shown in the homepage trust section.</span></div>' +
        '<button class="btn btn-sm btn-primary" id="t_add"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-plus") + '"></use></svg> Add Review</button></div>' +
        '<div class="ap-body" id="t_list">' + ADMIN.skeleton(4) + "</div></div>";

      await this.load();
      document.getElementById("t_add").addEventListener("click", () => this.openForm());
      document.getElementById("t_list").addEventListener("click", (e) => {
        const ed = e.target.closest("[data-edit]");
        if (ed) this.openForm(ed.getAttribute("data-edit"));
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });
      document.getElementById("t_list").addEventListener("change", (e) => this.toggle(e));
    },

    async load() {
      const { data, error } = await sb().from("testimonials").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      this.render();
    },

    render() {
      const host = document.getElementById("t_list");
      if (!this.state.rows.length) {
        host.innerHTML = ADMIN.emptyState("No reviews yet", "Add testimonials to build trust on the homepage.");
        return;
      }
      const stars = (n) => "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr><th>Customer</th><th>Location</th><th>Rating</th><th>Review</th><th>Published</th><th></th></tr></thead><tbody>' +
        this.state.rows
          .map(
            (r) =>
              "<tr>" +
              '<td class="t-strong">' + ADMIN.esc(r.name) + (r.sample ? ' <span class="badge badge-gold">Sample</span>' : "") + "</td>" +
              "<td>" + ADMIN.esc(r.location || "") + "</td>" +
              '<td style="color:var(--rec-gold)">' + stars(Math.min(5, r.rating || 5)) + "</td>" +
              '<td style="max-width:340px">' + ADMIN.esc(r.message && r.message.length > 90 ? r.message.slice(0, 90) + "…" : r.message || "") + "</td>" +
              '<td><label class="switch"><input type="checkbox" data-active="' + r.id + '"' + (r.published ? " checked" : "") + '><span class="slider"></span></label></td>' +
              '<td><div class="t-actions">' +
              '<button class="t-btn" data-edit="' + r.id + '" title="Edit"><svg><use href="' + REC.sprite("i-edit") + '"></use></svg></button>' +
              '<button class="t-btn danger" data-del="' + r.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    openForm(id) {
      const r = id ? this.state.rows.find((x) => x.id === id) : null;
      let modal = document.getElementById("t_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "t_modal";
        document.body.appendChild(modal);
      }
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>" + (r ? "Edit Review" : "Add Review") + "</h3>" +
        '<div class="admin-grid-2">' +
        '<div class="field"><label for="tf_name">Customer name *</label><input class="input" id="tf_name" value="' + ADMIN.esc(r ? r.name : "") + '"/></div>' +
        '<div class="field"><label for="tf_location">Location</label><input class="input" id="tf_location" value="' + ADMIN.esc(r ? r.location || "" : "") + '" placeholder="Umuahia, Abia"/></div>' +
        '<div class="field"><label for="tf_rating">Rating</label><select class="select" id="tf_rating">' +
        [1, 2, 3, 4, 5].map((n) => '<option value="' + n + '"' + (r && r.rating === n ? " selected" : "") + ">" + n + " stars</option>").join("") +
        "</select></div>" +
        '<div class="field"><label for="tf_photo">Photo URL</label><input class="input" id="tf_photo" value="' + ADMIN.esc(r ? r.photo_url || "" : "") + '" placeholder="https://…"/></div>' +
        "</div>" +
        '<div class="field"><label for="tf_content">Review *</label><textarea class="textarea" id="tf_content" style="min-height:110px">' + ADMIN.esc(r ? r.message : "") + "</textarea></div>" +
        '<div class="switch-row"><div><div class="sr-label">Published</div><div class="sr-hint">Visible on the website</div></div>' +
        '<label class="switch"><input type="checkbox" id="tf_published"' + (r && r.published ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="switch-row"><div><div class="sr-label">Sample</div><div class="sr-hint">Tag as placeholder review</div></div>' +
        '<label class="switch"><input type="checkbox" id="tf_sample"' + (r && r.sample ? " checked" : "") + '><span class="slider"></span></label></div>' +
        '<div class="form-actions"><button class="btn btn-primary" id="tf_save">Save</button><button class="btn btn-outline" data-close>Cancel</button></div></div>';
      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
      document.getElementById("tf_save").addEventListener("click", () => this.save(id));
    },

    async save(id) {
      const name = document.getElementById("tf_name").value.trim();
      const message = document.getElementById("tf_content").value.trim();
      if (!name || !message) return ADMIN.toast("Name and review are required", "error");
      const payload = {
        name,
        message,
        location: document.getElementById("tf_location").value.trim() || null,
        photo_url: document.getElementById("tf_photo").value.trim() || null,
        rating: Number(document.getElementById("tf_rating").value) || 5,
        published: document.getElementById("tf_published").checked,
        sample: document.getElementById("tf_sample").checked,
      };
      try {
        if (id) {
          const { error } = await sb().from("testimonials").update(payload).eq("id", id);
          if (error) throw error;
          ADMIN.toast("Review updated", "success");
        } else {
          const { error } = await sb().from("testimonials").insert(payload);
          if (error) throw error;
          ADMIN.toast("Review added", "success");
        }
        document.getElementById("t_modal").classList.remove("open");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      }
    },

    async toggle(e) {
      const chk = e.target.closest("[data-active]");
      if (!chk) return;
      try {
        const { error } = await sb().from("testimonials").update({ published: chk.checked }).eq("id", chk.getAttribute("data-active"));
        if (error) throw error;
        ADMIN.toast("Updated", "success");
      } catch (err) {
        chk.checked = !chk.checked;
        ADMIN.toast(err.message || "Update failed", "error");
      }
    },

    async remove(id) {
      if (!confirm("Delete this review?")) return;
      try {
        const { error } = await sb().from("testimonials").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Review deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("testimonials", AdminPage);
})(window);
/* ============================================================
   REC — Admin Product Reviews (moderation)
   Approve / hide, feature, and delete customer reviews.
   Reviews are never published automatically.
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;
  const stars = (n) => "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));

  const AdminPage = {
    state: { rows: [], filter: "pending" },

    async init() {
      document.title = "Reviews | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Product Reviews</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Customers rate and comment on products. Approve to publish.</span></div></div>' +
        '<div class="filter-tabs" id="rv_filters">' +
        '<button class="btn btn-sm btn-outline active" data-filter="pending">Pending</button>' +
        '<button class="btn btn-sm btn-outline" data-filter="approved">Approved</button>' +
        '<button class="btn btn-sm btn-outline" data-filter="all">All</button>' +
        "</div>" +
        '<div class="ap-body" id="rv_list">' + ADMIN.skeleton(5) + "</div></div>";

      document.getElementById("rv_filters").addEventListener("click", (e) => {
        const b = e.target.closest("[data-filter]");
        if (!b) return;
        this.state.filter = b.getAttribute("data-filter");
        document.querySelectorAll("#rv_filters [data-filter]").forEach((x) => x.classList.toggle("active", x === b));
        this.render();
      });
      document.getElementById("rv_list").addEventListener("change", (e) => this.toggle(e));
      document.getElementById("rv_list").addEventListener("click", (e) => {
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });

      await this.load();
    },

    async load() {
      const { data, error } = await sb()
        .from("product_reviews")
        .select("*, products(id, name, slug)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      ADMIN.setCount("reviews", this.state.rows.filter((r) => !r.approved).length);
      this.render();
    },

    render() {
      const host = document.getElementById("rv_list");
      const filter = this.state.filter;
      const rows = this.state.rows.filter((r) =>
        filter === "pending" ? !r.approved : filter === "approved" ? r.approved : true
      );
      if (!rows.length) {
        host.innerHTML = ADMIN.emptyState(
          filter === "pending" ? "No pending reviews" : "No reviews",
          filter === "pending"
            ? "New customer reviews will appear here for approval."
            : "There are no product reviews to show."
        );
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Product</th><th>Customer</th><th>Rating</th><th>Review</th><th>Date</th><th>Featured</th><th>Approved</th><th></th>" +
        "</tr></thead><tbody>" +
        rows
          .map(
            (r) =>
              "<tr" + (r.approved ? "" : ' class="row-pending"') + ">" +
              '<td class="t-strong">' +
              '<a class="t-link" href="' + REC.page("product") + '?id=' + encodeURIComponent(r.product_id) + '">' +
              ADMIN.esc(r.products ? r.products.name : "Product") + "</a>" +
              "</td>" +
              "<td>" + ADMIN.esc(r.author_name || r.user_id || "") + "</td>" +
              '<td style="color:var(--rec-gold);white-space:nowrap">' + stars(Math.min(5, r.rating || 0)) + "</td>" +
              '<td style="max-width:320px">' + ADMIN.esc(r.comment && r.comment.length > 90 ? r.comment.slice(0, 90) + "…" : r.comment || "") + "</td>" +
              "<td>" + ADMIN.date(r.created_at) + "</td>" +
              '<td><label class="switch"><input type="checkbox" data-feature="' + r.id + '"' + (r.featured ? " checked" : "") + '><span class="slider"></span></label></td>' +
              '<td><label class="switch"><input type="checkbox" data-approved="' + r.id + '"' + (r.approved ? " checked" : "") + '><span class="slider"></span></label></td>' +
              '<td><div class="t-actions">' +
              '<button class="t-btn danger" data-del="' + r.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    async toggle(e) {
      const app = e.target.closest("[data-approved]");
      const feat = e.target.closest("[data-feature]");
      if (app) {
        const id = app.getAttribute("data-approved");
        const row = this.state.rows.find((x) => x.id === id);
        try {
          const { error } = await sb()
            .from("product_reviews")
            .update({ approved: app.checked })
            .eq("id", id);
          if (error) throw error;
          if (row) row.approved = app.checked;
          ADMIN.toast(app.checked ? "Review published" : "Review hidden", "success");
          ADMIN.setCount("reviews", this.state.rows.filter((r) => !r.approved).length);
          if (this.state.filter !== "all") this.render();
        } catch (err) {
          app.checked = !app.checked;
          ADMIN.toast(err.message || "Update failed", "error");
        }
      }
      if (feat) {
        const id = feat.getAttribute("data-feature");
        const row = this.state.rows.find((x) => x.id === id);
        try {
          const { error } = await sb()
            .from("product_reviews")
            .update({ featured: feat.checked })
            .eq("id", id);
          if (error) throw error;
          if (row) row.featured = feat.checked;
          ADMIN.toast(feat.checked ? "Review featured" : "Unfeatured", "success");
          if (this.state.filter === "approved") this.render();
        } catch (err) {
          feat.checked = !feat.checked;
          ADMIN.toast(err.message || "Update failed", "error");
        }
      }
    },

    async remove(id) {
      if (!confirm("Delete this review permanently?")) return;
      try {
        const { error } = await sb().from("product_reviews").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Review deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("reviews", AdminPage);
})(window);
/* ============================================================
   REC — Admin Blog (CRUD + storage header upload)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { rows: [] },

    async init() {
      document.title = "Blog | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Articles</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Write guides and updates to position REC as a trusted source.</span></div>' +
        '<button class="btn btn-sm btn-primary" id="b_add"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-plus") + '"></use></svg> New Article</button></div>' +
        '<div class="ap-body" id="b_list">' + ADMIN.skeleton(4) + "</div></div>";

      await this.load();
      document.getElementById("b_add").addEventListener("click", () => this.openForm());
      document.getElementById("b_list").addEventListener("click", (e) => {
        const ed = e.target.closest("[data-edit]");
        if (ed) this.openForm(ed.getAttribute("data-edit"));
        const dl = e.target.closest("[data-del]");
        if (dl) this.remove(dl.getAttribute("data-del"));
      });
      document.getElementById("b_list").addEventListener("change", (e) => this.toggle(e));
    },

    async load() {
      const { data, error } = await sb().from("blog_posts").select("*").order("published_at", { ascending: false }).limit(200);
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      this.render();
    },

    render() {
      const host = document.getElementById("b_list");
      if (!this.state.rows.length) {
        host.innerHTML = ADMIN.emptyState("No articles yet", "Publish your first article from the Blog section of the website.");
        return;
      }
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr><th>Title</th><th>Category</th><th>Published</th><th>Status</th><th></th></tr></thead><tbody>' +
        this.state.rows
          .map(
            (r) =>
              "<tr>" +
              '<td class="t-strong">' + ADMIN.esc(r.title) + "</td>" +
              "<td>" + ADMIN.esc(r.category || "Guides") + "</td>" +
              "<td>" + (r.published_at ? ADMIN.date(r.published_at) : "—") + "</td>" +
              '<td><label class="switch"><input type="checkbox" data-active="' + r.id + '"' + (r.published ? " checked" : "") + '><span class="slider"></span></label></td>' +
              '<td><div class="t-actions">' +
              '<button class="t-btn" data-edit="' + r.id + '" title="Edit"><svg><use href="' + REC.sprite("i-edit") + '"></use></svg></button>' +
              '<button class="t-btn danger" data-del="' + r.id + '" title="Delete"><svg><use href="' + REC.sprite("i-trash") + '"></use></svg></button>' +
              "</div></td></tr>"
          )
          .join("") +
        "</tbody></table></div>";
    },

    openForm(id) {
      const r = id ? this.state.rows.find((x) => x.id === id) : null;
      let modal = document.getElementById("b_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "b_modal";
        document.body.appendChild(modal);
      }
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card modal-lg" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>" + (r ? "Edit Article" : "New Article") + "</h3>" +
        '<div class="admin-grid-2">' +
        '<div class="field full"><label for="bf_title">Title *</label><input class="input" id="bf_title" value="' + ADMIN.esc(r ? r.title : "") + '"/></div>' +
        '<div class="field"><label for="bf_category">Category</label><input class="input" id="bf_category" value="' + ADMIN.esc(r ? r.category || "Guides" : "Guides") + '"/></div>' +
        '<div class="field"><label for="bf_author">Author</label><input class="input" id="bf_author" value="' + ADMIN.esc(r ? r.author || "" : "REC Farm Team") + '"/></div>' +
        '</div>' +
        '<div class="field"><label for="bf_excerpt">Excerpt</label><textarea class="textarea" id="bf_excerpt" style="min-height:70px">' + ADMIN.esc(r ? r.excerpt || "" : "") + "</textarea></div>" +
        '<div class="field"><label for="bf_content">Content (Markdown)</label><textarea class="textarea mono" id="bf_content" style="min-height:200px">' + ADMIN.esc(r ? r.content : "") + "</textarea>" +
        '<span class="hint">Supports ## headings, bold **text**, lists and links.</span></div>' +
        '<div class="field"><label for="bf_cover">Cover image URL</label>' +
        '<input class="input" id="bf_cover" value="' + ADMIN.esc(r ? r.image || "" : REC.asset("images/turkey.png")) + '"/>' +
        '<label class="btn btn-sm btn-outline" style="margin-top:.5rem;width:fit-content;cursor:pointer"><svg aria-hidden="true" style="width:16px;height:16px"><use href="' + REC.sprite("i-upload") + '"></use></svg> Upload' +
        '<input type="file" id="bf_file" accept="image/*" style="display:none"/></label></div>' +
        '<div class="form-actions">' +
        '<button class="btn btn-primary" id="bf_save">' + (r ? "Save Changes" : "Publish") + "</button>" +
        '<button class="btn btn-outline" data-close>Cancel</button></div></div>';
      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
      document.getElementById("bf_save").addEventListener("click", () => this.save(id));

      document.getElementById("bf_file").addEventListener("change", async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        try {
          const path = "blog/" + Date.now() + "-" + file.name.replace(/\s+/g, "-");
          const { error } = await sb().storage.from(REC.config.storageBucket).upload(path, file, { contentType: file.type });
          if (error) throw error;
          const { data } = sb().storage.from(REC.config.storageBucket).getPublicUrl(path);
          document.getElementById("bf_cover").value = data.publicUrl;
          ADMIN.toast("Cover uploaded", "success");
        } catch (e) {
          ADMIN.toast(e.message || "Upload failed", "error");
        }
      });
    },

    async save(id) {
      const title = document.getElementById("bf_title").value.trim();
      const content = document.getElementById("bf_content").value.trim();
      if (!title || !content) return ADMIN.toast("Title and content are required", "error");
      const payload = {
        title,
        content,
        category: document.getElementById("bf_category").value.trim() || "Guides",
        author: document.getElementById("bf_author").value.trim() || "REC Farm Team",
        excerpt: document.getElementById("bf_excerpt").value.trim() || null,
        image: document.getElementById("bf_cover").value.trim() || null,
        published: true,
        published_at: new Date().toISOString(),
      };
      try {
        if (id) {
          const { error } = await sb().from("blog_posts").update(payload).eq("id", id);
          if (error) throw error;
          ADMIN.toast("Article updated", "success");
        } else {
          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
          payload.slug = slug;
          const { error } = await sb().from("blog_posts").insert(payload);
          if (error) throw error;
          ADMIN.toast("Article published", "success");
        }
        document.getElementById("b_modal").classList.remove("open");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      }
    },

    async toggle(e) {
      const chk = e.target.closest("[data-active]");
      if (!chk) return;
      try {
        const { error } = await sb().from("blog_posts").update({ published: chk.checked }).eq("id", chk.getAttribute("data-active"));
        if (error) throw error;
        ADMIN.toast(chk.checked ? "Published" : "Saved as draft", "success");
      } catch (err) {
        ADMIN.toast(err.message || "Update failed", "error");
      }
    },

    async remove(id) {
      if (!confirm("Delete this article?")) return;
      try {
        const { error } = await sb().from("blog_posts").delete().eq("id", id);
        if (error) throw error;
        ADMIN.toast("Article deleted", "success");
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Delete failed", "error");
      }
    },
  };

  ADMIN.register("blog", AdminPage);
})(window);
/* ============================================================
   REC — Admin Messages (contact form inbox)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { rows: [] },

    async init() {
      document.title = "Messages | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Messages</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Enquiries sent through the contact form.</span></div>' +
        '<button class="btn btn-sm btn-outline" id="m_unread">Mark all read</button></div>' +
        '<div class="ap-body" id="m_list">' + ADMIN.skeleton(5) + "</div></div>";

      await this.load();
      document.getElementById("m_list").addEventListener("click", (e) => this.onClick(e));
      document.getElementById("m_unread").addEventListener("click", () => this.markAll());
    },

    async load() {
      const { data, error } = await sb().from("contact_messages").select("*").order("handled").order("created_at", { ascending: false }).limit(200);
      if (error) return ADMIN.toast(error.message, "error");
      this.state.rows = data || [];
      ADMIN.setCount("messages", this.state.rows.filter((m) => !m.handled).length);
      this.render();
    },

    render() {
      const host = document.getElementById("m_list");
      if (!this.state.rows.length) {
        host.innerHTML = ADMIN.emptyState("No messages yet", "Messages from the contact page arrive here.");
        return;
      }
      host.innerHTML =
        '<div class="m-list">' +
        this.state.rows
          .map(
            (m) =>
              '<div class="m-item' + (m.handled ? "" : " unread") + '" data-id="' + m.id + '">' +
              '<div class="m-head"><strong>' + ADMIN.esc(m.name) + "</strong>" +
              '<a href="mailto:' + ADMIN.esc(m.email) + '" style="color:var(--rec-green);font-size:.85rem">' + ADMIN.esc(m.email) + "</a>" +
              '<span class="m-date">' + ADMIN.date(m.created_at) + "</span></div>" +
              '<div class="m-subject">' + ADMIN.esc(m.subject || "General enquiry") + "</div>" +
              '<p class="m-body">' + ADMIN.esc(m.message) + "</p>" +
              '<div class="m-actions">' +
              (m.handled ? "" : '<button class="btn btn-sm btn-outline" data-read="' + m.id + '">Mark read</button>') +
              '<button class="btn btn-sm btn-outline" data-del="' + m.id + '">Delete</button>' +
              "</div></div>"
          )
          .join("") +
        "</div>";
    },

    async onClick(e) {
      const id = (e.target.closest("[data-read]") || {}).getAttribute ? (e.target.closest("[data-read]") || {}).getAttribute("data-read") : null;
      const dl = e.target.closest("[data-del]");
      if (id) {
        try {
          const { error } = await sb().from("contact_messages").update({ handled: true }).eq("id", id);
          if (error) throw error;
          await this.load();
        } catch (err) {
          ADMIN.toast(err.message || "Update failed", "error");
        }
        return;
      }
      if (dl) {
        if (!confirm("Delete this message?")) return;
        try {
          const { error } = await sb().from("contact_messages").delete().eq("id", dl.getAttribute("data-del"));
          if (error) throw error;
          ADMIN.toast("Message deleted", "success");
          await this.load();
        } catch (err) {
          ADMIN.toast(err.message || "Delete failed", "error");
        }
      }
    },

    async markAll() {
      try {
        const { error } = await sb().from("contact_messages").update({ handled: true }).eq("handled", false);
        if (error) throw error;
        ADMIN.toast("All messages marked as read", "success");
        await this.load();
      } catch (err) {
        ADMIN.toast(err.message || "Update failed", "error");
      }
    },
  };

  ADMIN.register("messages", AdminPage);
})(window);
/* ============================================================
   REC — Admin Settings (site_settings + stock alerts)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const AdminPage = {
    state: { settings: {} },

    async init() {
      document.title = "Settings | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      await this.load();
      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Site Settings</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Brand info used across the website. Supabase keys are set in js/app.js / Vercel env vars.</span></div></div>' +
        '<div class="ap-body"><form id="s_form" class="admin-grid-2">' +
        '<div class="field"><label for="sf_site_name">Business name</label><input class="input" id="sf_site_name"/></div>' +
        '<div class="field"><label for="sf_motto">Motto</label><input class="input" id="sf_motto"/></div>' +
        '<div class="field"><label for="sf_phone">Phone</label><input class="input" id="sf_phone"/></div>' +
        '<div class="field"><label for="sf_whatsapp">WhatsApp (digits)</label><input class="input" id="sf_whatsapp"/></div>' +
        '<div class="field"><label for="sf_email">Email</label><input class="input" id="sf_email"/></div>' +
        '<div class="field"><label for="sf_address">Address</label><input class="input" id="sf_address"/></div>' +
        '<div class="field full"><label for="sf_delivery_note">Delivery note</label><input class="input" id="sf_delivery_note"/></div>' +
        '<div class="field full"><label for="sf_website">Website (URL)</label><input class="input" id="sf_website" placeholder="https://reclivestock.ng"/></div>' +
        '<div class="field"><label for="sf_fb">Facebook (URL)</label><input class="input" id="sf_fb"/></div>' +
        '<div class="field"><label for="sf_ig">Instagram (URL)</label><input class="input" id="sf_ig"/></div>' +
        '<div class="field"><label for="sf_tt">TikTok (URL)</label><input class="input" id="sf_tt"/></div>' +
        '<div class="field"><label for="sf_yt">YouTube (URL)</label><input class="input" id="sf_yt"/></div>' +
        '<div class="field"><label for="sf_tg">Telegram (URL)</label><input class="input" id="sf_tg"/></div>' +
        '<div class="field"><label for="sf_wa_channel">WhatsApp channel (URL)</label><input class="input" id="sf_wa_channel"/></div>' +
        '<div class="field"><label for="sf_wa_group">WhatsApp group (URL)</label><input class="input" id="sf_wa_group"/></div>' +
        '<div class="field"><label for="sf_tg_channel">Telegram channel (URL)</label><input class="input" id="sf_tg_channel"/></div>' +
        '<div class="field"><label for="sf_tg_group">Telegram group (URL)</label><input class="input" id="sf_tg_group"/></div>' +
        '<div class="form-actions full"><button class="btn btn-primary" type="submit">Save Settings</button>' +
        '<span class="hint" id="s_saved" style="display:none;color:var(--green-600);font-weight:700">Saved ✓</span></div>' +
        "</form></div></div>" +
        '<div id="s_stock"></div>';

      this.fillForm();
      document.getElementById("s_form").addEventListener("submit", (e) => {
        e.preventDefault();
        this.save();
      });
      this.renderStock();
    },

    async load() {
      const { data, error } = await sb().from("site_settings").select("*").limit(1);
      if (data && data.length) this.state.settings = data[0];
      else if (error) ADMIN.toast(error.message, "error");
    },

    fillForm() {
      const s = this.state.settings;
      document.getElementById("sf_site_name").value = s.business_name || REC.config.appName;
      document.getElementById("sf_motto").value = s.motto || "";
      document.getElementById("sf_phone").value = s.phone || REC.config.phone;
      document.getElementById("sf_whatsapp").value = s.whatsapp || "";
      document.getElementById("sf_email").value = s.email || REC.config.email;
      document.getElementById("sf_address").value = s.address || "";
      document.getElementById("sf_delivery_note").value = s.delivery_note || "";
      document.getElementById("sf_fb").value = s.social_facebook || "";
      document.getElementById("sf_ig").value = s.social_instagram || "";
      document.getElementById("sf_tt").value = s.social_tiktok || "";
      document.getElementById("sf_yt").value = s.social_youtube || "";
      document.getElementById("sf_tg").value = s.social_telegram || "";
      document.getElementById("sf_website").value = s.website || REC.config.website || "";
      document.getElementById("sf_wa_channel").value = s.whatsapp_channel || "";
      document.getElementById("sf_wa_group").value = s.whatsapp_group || "";
      document.getElementById("sf_tg_channel").value = s.telegram_channel || "";
      document.getElementById("sf_tg_group").value = s.telegram_group || "";
    },

    async save() {
      const v = (id) => document.getElementById(id).value.trim();
      let payload = {
        business_name: v("sf_site_name") || REC.config.appName,
        motto: v("sf_motto"),
        phone: v("sf_phone") || REC.config.phone,
        whatsapp: v("sf_whatsapp") || REC.config.phoneRaw || "",
        email: v("sf_email") || REC.config.email,
        address: v("sf_address"),
        delivery_note: v("sf_delivery_note"),
        social_facebook: v("sf_fb") || null,
        social_instagram: v("sf_ig") || null,
        social_tiktok: v("sf_tt") || null,
        social_youtube: v("sf_yt") || null,
        social_telegram: v("sf_tg") || null,
        website: v("sf_website") || REC.config.website || null,
        whatsapp_channel: v("sf_wa_channel") || null,
        whatsapp_group: v("sf_wa_group") || null,
        telegram_channel: v("sf_tg_channel") || null,
        telegram_group: v("sf_tg_group") || null,
      };
      try {
        if (this.state.settings && this.state.settings.id) {
          const { error } = await sb().from("site_settings").update(payload).eq("id", this.state.settings.id);
          if (error) throw error;
        } else {
          const { error } = await sb().from("site_settings").insert(payload);
          if (error) throw error;
        }
        const saved = document.getElementById("s_saved");
        saved.style.display = "inline";
        setTimeout(() => (saved.style.display = "none"), 2500);
        await this.load();
      } catch (e) {
        ADMIN.toast(e.message || "Save failed", "error");
      }
    },

    async renderStock() {
      const host = document.getElementById("s_stock");
      if (!host) return;
      const { data } = await sb().from("products").select("name,stock_quantity").order("stock_quantity");
      const low = (data || [])
        .filter((p) => Number(p.stock_quantity) <= 5)
        .slice(0, 5);
      host.innerHTML =
        '<div class="admin-panel" style="margin-top:1rem"><div class="ap-head"><h3>Env configuration</h3></div><div class="ap-body">' +
        '<div class="env-box"><code>SUPABASE_URL</code><span>' + ADMIN.esc(REC.config.supabaseUrl || "not set") + "</span></div>" +
        '<div class="env-box"><code>SUPABASE_ANON_KEY</code><span>' + (REC.config.supabaseAnonKey && REC.config.supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY" ? "configured (anon key)" : ADMIN.esc(REC.config.supabaseAnonKey || "not set")) + "</span></div>" +
        '<p class="hint" style="margin-top:.6rem">Diretions: set these in <b>js/app.js</b> for local dev, or as Vercel env vars for production. The public site uses only the anon key; never expose your service role key.</p>' +
        "</div></div>" +
        (low.length
          ? '<div class="admin-panel" style="margin-top:1rem"><div class="ap-head"><h3>Low Stock Alerts</h3></div><div class="ap-body">' +
            low.map((p) => '<div class="pd-meta"><strong>' + ADMIN.esc(p.name) + "</strong>: " + p.stock_quantity + " left</div>").join("") +
            "</div></div>"
          : "");
    },
  };

  ADMIN.register("settings", AdminPage);
})(window);
/* ============================================================
   REC — Admin Orders (list, status update, details)
   ============================================================ */
(function (win) {
  "use strict";
  const REC = (win.REC = win.REC || {});
  const ADMIN = (win.RECAdmin = win.RECAdmin || {});
  const sb = () => REC.supabaseClient;

  const STATUS = [
    ["pending", "Pending"],
    ["confirmed", "Confirmed"],
    ["processing", "Processing"],
    ["ready", "Ready"],
    ["out for delivery", "Out for Delivery"],
    ["completed", "Completed"],
    ["cancelled", "Cancelled"],
  ];
  const BADGE = {
    pending: "badge-gold", confirmed: "badge-green", processing: "badge-gold",
    ready: "badge-green", "out for delivery": "badge-green",
    completed: "badge-green", cancelled: "badge-red",
  };

  const AdminPage = {
    state: { orders: [], filter: "all", search: "" },

    async init() {
      document.title = "Orders | REC Admin";
      ADMIN.setState();
      const content = document.getElementById("admin-content");
      if (!sb()) return (content.innerHTML = ADMIN.emptyState("No connection", "Connect Supabase first."));

      content.innerHTML =
        '<div class="admin-panel"><div class="ap-head"><div><h3>Orders</h3>' +
        '<span style="font-size:.8rem;color:var(--muted)">Update fulfilment status to keep customers informed.</span></div>' +
        '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
        '<select class="select" id="o_filter" style="max-width:180px"></select>' +
        '<input class="input" id="o_search" type="search" placeholder="Reference / name..." style="max-width:220px;padding:.55rem .8rem"/>' +
        "</div></div>" +
        '<div class="ap-body" id="o_list">' + ADMIN.skeleton(6) + "</div></div>";

      const sel = document.getElementById("o_filter");
      sel.innerHTML = '<option value="all">All statuses</option>' + STATUS.map(([k, v]) => '<option value="' + k + '">' + v + "</option>").join("");

      await this.load();
      sel.addEventListener("change", () => { this.state.filter = sel.value; this.render(); });
      document.getElementById("o_search").addEventListener("input", (e) => { this.state.search = e.target.value; this.render(); });
      document.getElementById("o_list").addEventListener("change", (e) => this.onStatus(e));
      document.getElementById("o_list").addEventListener("click", (e) => this.onDetail(e));
    },

    async load() {
      const { data, error } = await sb()
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) return ADMIN.toast(error.message, "error");
      this.state.orders = data || [];
      ADMIN.setCount(
        "orders",
        this.state.orders.filter((o) => o.status === "pending").length
      );
      this.render();
    },

    render() {
      const host = document.getElementById("o_list");
      let list = this.state.orders;
      if (this.state.filter !== "all") list = list.filter((o) => o.status === this.state.filter);
      const s = this.state.search.trim().toLowerCase();
      if (s) list = list.filter((o) => (o.order_number || "").toLowerCase().includes(s) || (o.full_name || "").toLowerCase().includes(s) || (o.phone || "").toLowerCase().includes(s));

      if (!list.length) {
        host.innerHTML = ADMIN.emptyState("No orders", "Orders placed on the checkout page appear here.");
        return;
      }
      const optAll = STATUS.map(([k, v]) => '<option value="' + k + '">' + v + "</option>").join("");
      host.innerHTML =
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        "<th>Reference</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th>" +
        "</tr></thead><tbody>" +
        list
          .map(
            (o) => {
              const items = o.items ? (Array.isArray(o.items) ? o.items.length : 0) : 0;
              return (
                "<tr>" +
                '<td class="t-strong"><button class="t-link" data-id="' + o.id + '">' + ADMIN.esc(o.order_number) + "</button></td>" +
                "<td>" + ADMIN.esc(o.full_name) + '<br/><span style="font-size:.78rem;color:var(--muted)">' + ADMIN.esc(o.phone || "") + "</span></td>" +
                "<td>" + items + "</td>" +
                '<td class="t-strong">' + ADMIN.money(o.total) + "</td>" +
                "<td>" + ADMIN.date(o.created_at) + "</td>" +
                '<td><select class="select o-status" style="padding:.35rem .5rem;font-size:.8rem" data-id="' + o.id + '">' +
                optAll.replace('<option value="' + ADMIN.esc(o.status) + '">', '<option value="' + ADMIN.esc(o.status) + '" selected>') +
                "</select></td>" +
                "</tr>"
              );
            }
          )
          .join("") +
        "</tbody></table></div>";
    },

    async onStatus(e) {
      const sel = e.target.closest(".o-status");
      if (!sel) return;
      const id = sel.getAttribute("data-id");
      const prev = this.state.orders.find((o) => o.id === id);
      const next = sel.value;
      if (!prev || prev.status === next) return;
      try {
        const { error } = await sb().from("orders").update({ status: next }).eq("id", id);
        if (error) throw error;
        prev.status = next;
        ADMIN.toast("Order marked " + next.replace(/\b\w/g, (c) => c.toUpperCase()), "success");
      } catch (err) {
        sel.value = prev.status;
        ADMIN.toast(err.message || "Update failed", "error");
      }
    },

    onDetail(e) {
      const btn = e.target.closest(".t-link");
      if (!btn) return;
      const order = this.state.orders.find((o) => o.id === btn.getAttribute("data-id"));
      if (!order) return;

      const items = order.items || [];
      let modal = document.getElementById("o_modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-root";
        modal.id = "o_modal";
        document.body.appendChild(modal);
      }
      const isPickup = order.fulfillment_method === "pickup";
      const meta = [
        ["Customer", order.full_name],
        ["Phone", order.phone],
        ["Email", order.email],
        ["Fulfillment", isPickup ? "Pickup at a station" : "Delivery"],
      ];
      if (isPickup) {
        meta.push(
          ["Pickup station", order.pickup_station_name || "—"],
          ["Station address", order.pickup_station_address || "—"]
        );
      } else {
        meta.push(
          ["Delivery address", order.delivery_address || "—"],
          ["State / LGA", [order.state, order.lga].filter(Boolean).join(", ")]
        );
      }
      meta.push(["Payment", order.payment_status || "unpaid"], ["Notes", order.notes || "—"]);
      const [cls, label] = [BADGE[order.status] || "badge-gray", order.status || "Pending"];
      modal.innerHTML =
        '<div class="modal-backdrop" data-close></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<button class="modal-close" data-close aria-label="Close"><svg><use href="' + REC.sprite("i-close") + '"></use></svg></button>' +
        "<h3>Order " + ADMIN.esc(order.order_number) + '</h3>' +
        '<span class="badge ' + cls + '">' + label + "</span>" +
        '<div class="modal-sec">' +
        meta.map(([k, v]) => "<p><strong>" + k + ":</strong> " + ADMIN.esc(v || "—") + "</p>").join("") +
        "</div>" +
        '<div class="modal-sec"><h4>Items</h4>' +
        "<div class=\"table-wrap\"><table class=\"data-table\"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead><tbody>" +
        items
          .map(
            (i) =>
              "<tr><td>" + ADMIN.esc(i.name) + "</td><td>" + i.quantity + "</td><td>" + ADMIN.money(i.price) + "</td><td>" + ADMIN.money(i.price * i.quantity) + "</td></tr>"
          )
          .join("") +
        "</tbody></table></div>" +
        '<p style="margin-top:.8rem;font-weight:800">Subtotal: ' + ADMIN.money(order.subtotal) + "<br/>Delivery: " + ADMIN.money(order.delivery_fee) + '</p>' +
        '<p class="t-strong" style="font-size:1.1rem">Total: ' + ADMIN.money(order.total) + "</p></div>" +
        '<button class="btn btn-outline btn-block" data-close>Close</button></div>';
      modal.classList.add("open");
      modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", () => modal.classList.remove("open")));
    },
  };

  ADMIN.register("orders", AdminPage);
})(window);
