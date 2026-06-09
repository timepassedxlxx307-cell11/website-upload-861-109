(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");
    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      if (!slides.length) {
        return;
      }
      var current = 0;
      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    });

    document.querySelectorAll("[data-filterable]").forEach(function (section) {
      var input = section.querySelector("[data-card-search]");
      var buttons = Array.prototype.slice.call(section.querySelectorAll("[data-filter-btn]"));
      var cards = Array.prototype.slice.call(section.querySelectorAll("[data-filter-card]"));
      var activeFilter = "all";

      function getText(card) {
        return [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-region") || "",
          card.textContent || ""
        ].join(" ").toLowerCase();
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var text = getText(card);
          var type = card.getAttribute("data-type") || "";
          var filterMatch = activeFilter === "all" || type === activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
          var queryMatch = !query || text.indexOf(query) !== -1;
          card.classList.toggle("is-hidden", !(filterMatch && queryMatch));
        });
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
          input.value = q;
        }
        input.addEventListener("input", apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          buttons.forEach(function (item) {
            item.classList.remove("is-active");
          });
          button.classList.add("is-active");
          activeFilter = button.getAttribute("data-filter-btn") || "all";
          apply();
        });
      });

      apply();
    });
  });
})();
