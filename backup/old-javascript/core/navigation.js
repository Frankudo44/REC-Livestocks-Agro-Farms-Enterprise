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