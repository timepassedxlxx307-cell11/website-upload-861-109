(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function bindMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function bindNavSearch() {
    document.querySelectorAll('[data-nav-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        var url = './search.html';
        if (value) {
          url += '?q=' + encodeURIComponent(value);
        }
        window.location.href = url;
      });
    });
  }

  function bindHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var tabs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-tab]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      tabs.forEach(function (tab, i) {
        tab.classList.toggle('is-active', i === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        show(Number(tab.getAttribute('data-hero-tab')) || 0);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function bindFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll('.filter-grid, .rank-list'));
    if (!grids.length) {
      return;
    }
    var input = document.querySelector('[data-filter-input]');
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
    var empty = document.querySelector('[data-empty-result]');
    var activeValues = [];
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input && query) {
      input.value = query;
    }
    function apply() {
      var q = normalize(input ? input.value : '');
      var visible = 0;
      var selected = activeValues.map(normalize).filter(Boolean);
      document.querySelectorAll('[data-card]').forEach(function (card) {
        var text = normalize(card.getAttribute('data-filter'));
        var matchesQuery = !q || text.indexOf(q) !== -1;
        var matchesChips = selected.every(function (value) {
          return text.indexOf(value) !== -1;
        });
        var show = matchesQuery && matchesChips;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }
    if (input) {
      input.addEventListener('input', apply);
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.closest('.filter-chips');
        if (group) {
          group.querySelectorAll('[data-filter-chip]').forEach(function (other) {
            other.classList.remove('is-active');
          });
        }
        chip.classList.add('is-active');
        activeValues = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip].is-active')).map(function (active) {
          return active.getAttribute('data-filter-chip') || '';
        }).filter(Boolean);
        apply();
      });
    });
    apply();
  }

  function bindBackTop() {
    var button = document.querySelector('[data-back-top]');
    if (!button) {
      return;
    }
    function check() {
      button.classList.toggle('is-visible', window.scrollY > 420);
    }
    window.addEventListener('scroll', check, { passive: true });
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    check();
  }

  window.MovieSite = window.MovieSite || {};
  window.MovieSite.initPlayer = function (streamUrl) {
    var video = document.getElementById('moviePlayer');
    var overlay = document.getElementById('playOverlay');
    if (!video || !streamUrl) {
      return;
    }
    var attached = false;
    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }
    function start() {
      attach();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }
    if (overlay) {
      overlay.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  };

  ready(function () {
    bindMenu();
    bindNavSearch();
    bindHero();
    bindFilters();
    bindBackTop();
  });
})();
