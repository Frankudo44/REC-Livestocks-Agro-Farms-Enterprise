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
      win.dispatchEvent(new CustomEvent("rec:cartchange", { detail: { items: list } }));
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