(function () {
  var ready = function (fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  };

  var all = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  ready(function () {
    initMenu();
    initSearchForms();
    initHero();
    initFilters();
    initPlayers();
  });

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initSearchForms() {
    all('.js-search-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        if (!value) {
          event.preventDefault();
          window.location.href = './category-all.html';
        }
      });
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = all('[data-hero-slide]', root);
    var dots = all('[data-hero-dot]', root);
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function initFilters() {
    var input = document.querySelector('.js-filter-input');
    var type = document.querySelector('.js-type-filter');
    var year = document.querySelector('.js-year-filter');
    var cards = all('.js-movie-card');
    var empty = document.querySelector('.js-empty-state');
    if (!cards.length || (!input && !type && !year)) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input && query) {
      input.value = query;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function apply() {
      var keyword = normalize(input ? input.value : '');
      var currentType = normalize(type ? type.value : '');
      var currentYear = normalize(year ? year.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var pass = true;
        if (keyword && text.indexOf(keyword) === -1) {
          pass = false;
        }
        if (currentType && cardType !== currentType) {
          pass = false;
        }
        if (currentYear && cardYear !== currentYear) {
          pass = false;
        }
        card.classList.toggle('is-hidden', !pass);
        if (pass) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }

  function initPlayers() {
    all('[data-player]').forEach(function (root) {
      var video = root.querySelector('video[data-src]');
      var overlay = root.querySelector('.player-start');
      if (!video || !overlay) {
        return;
      }

      var src = video.getAttribute('data-src');
      var loaded = false;
      var hls = null;

      function attachSource() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(src);
          hls.attachMedia(video);
          return;
        }
        video.src = src;
      }

      function setError() {
        root.classList.add('has-error');
        overlay.classList.remove('is-hidden');
        overlay.querySelector('span').textContent = '当前浏览器暂时无法播放';
      }

      function startPlayback(event) {
        if (event) {
          event.preventDefault();
        }
        attachSource();
        overlay.classList.add('is-hidden');
        root.classList.add('is-playing');
        var result = video.paused ? video.play() : video.pause();
        if (result && typeof result.catch === 'function') {
          result.catch(setError);
        }
      }

      overlay.addEventListener('click', startPlayback);
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });
      video.addEventListener('play', function () {
        overlay.classList.add('is-hidden');
        root.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        root.classList.remove('is-playing');
      });
      video.addEventListener('error', setError);
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }
})();
