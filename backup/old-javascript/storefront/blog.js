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