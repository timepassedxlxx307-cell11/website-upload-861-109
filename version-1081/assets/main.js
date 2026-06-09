(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('.hero');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === current) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }

    function startHero() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showHero(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showHero(dotIndex);
        startHero();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showHero(current - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showHero(current + 1);
        startHero();
      });
    }

    startHero();
  }

  var searchInput = document.getElementById('searchInput');
  var categoryFilter = document.getElementById('categoryFilter');
  var regionFilter = document.getElementById('regionFilter');
  var yearFilter = document.getElementById('yearFilter');
  var searchCards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
  var emptyState = document.getElementById('emptyState');

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q && searchInput && !searchInput.value) {
      searchInput.value = q;
    }
  }

  function applySearch() {
    if (!searchCards.length) {
      return;
    }

    var q = normalize(searchInput && searchInput.value);
    var category = normalize(categoryFilter && categoryFilter.value);
    var region = normalize(regionFilter && regionFilter.value);
    var year = normalize(yearFilter && yearFilter.value);
    var visible = 0;

    searchCards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.category
      ].join(' '));
      var matches = true;

      if (q && haystack.indexOf(q) === -1) {
        matches = false;
      }

      if (category && normalize(card.dataset.category) !== category) {
        matches = false;
      }

      if (region && normalize(card.dataset.region).indexOf(region) === -1) {
        matches = false;
      }

      if (year && normalize(card.dataset.year).indexOf(year) === -1) {
        matches = false;
      }

      card.hidden = !matches;

      if (matches) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  if (searchCards.length) {
    readQuery();
    applySearch();
    [searchInput, categoryFilter, regionFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applySearch);
        control.addEventListener('change', applySearch);
      }
    });
  }
})();
