(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        var q = input ? input.value.trim() : '';
        if (!q) {
          event.preventDefault();
        }
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }

      function play() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 6200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          play();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-hero-dot')) || 0);
          play();
        });
      });

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', play);
      show(0);
      play();
    }

    function applyFilter(input, forcedValue) {
      var targetSelector = input.getAttribute('data-filter-target');
      var target = targetSelector ? document.querySelector(targetSelector) : document;
      if (!target) {
        return;
      }
      var query = normalize(forcedValue !== undefined ? forcedValue : input.value);
      var cards = Array.prototype.slice.call(target.querySelectorAll('[data-movie-card]'));
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' '));
        card.classList.toggle('is-filter-hidden', query && haystack.indexOf(query) === -1);
      });
    }

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
        applyFilter(input, q);
      }
      input.addEventListener('input', function () {
        applyFilter(input);
      });
      var form = input.closest('form');
      if (form) {
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          applyFilter(input);
        });
      }
    });

    document.querySelectorAll('[data-filter-chip]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter-chip') || '';
        var input = document.querySelector('[data-filter-input]');
        document.querySelectorAll('[data-filter-chip]').forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        if (input) {
          input.value = value;
          applyFilter(input, value);
        }
      });
    });
  });
})();
