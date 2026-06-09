(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var topButton = document.querySelector('[data-back-top]');
  if (topButton) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 360) {
        topButton.classList.add('is-visible');
      } else {
        topButton.classList.remove('is-visible');
      }
    });
    topButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var setSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        setSlide(current + 1);
      }, 6500);
    }
  }

  var filterScope = document.querySelector('[data-filter-scope]');
  if (filterScope) {
    var cards = Array.prototype.slice.call(filterScope.querySelectorAll('.movie-card'));
    var input = document.querySelector('[data-filter-input]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var empty = document.querySelector('[data-empty-state]');
    var applyFilters = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [card.getAttribute('data-title'), card.getAttribute('data-tags')].join(' ').toLowerCase();
        var matched = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (type && card.getAttribute('data-type') !== type) {
          matched = false;
        }
        if (year && card.getAttribute('data-year') !== year) {
          matched = false;
        }
        if (region && card.getAttribute('data-region') !== region) {
          matched = false;
        }
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };
    [input, typeSelect, yearSelect, regionSelect].forEach(function (item) {
      if (item) {
        item.addEventListener('input', applyFilters);
        item.addEventListener('change', applyFilters);
      }
    });
  }

  var searchResults = document.querySelector('[data-search-results]');
  if (searchResults && window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var searchInput = document.querySelector('[data-search-input]');
    var status = document.querySelector('[data-search-status]');
    if (searchInput) {
      searchInput.value = q;
    }
    var makeCard = function (movie) {
      return '<a class="movie-card" href="' + movie.url + '">' +
        '<span class="poster-wrap">' +
        '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
        '<span class="poster-shade"></span><span class="card-play">▶</span>' +
        '<span class="corner-chip left">' + movie.type + '</span>' +
        '<span class="corner-chip right">' + movie.year + '</span>' +
        '</span>' +
        '<span class="card-body"><strong>' + movie.title + '</strong>' +
        '<em>' + movie.desc + '</em>' +
        '<span class="card-meta">' + movie.region + ' · ' + movie.genre + '</span>' +
        '<span class="tag-line">' + movie.tags.slice(0, 3).join(' ') + '</span></span></a>';
    };
    var runSearch = function (keyword) {
      var key = keyword.trim().toLowerCase();
      var result = window.SEARCH_MOVIES.filter(function (movie) {
        if (!key) {
          return true;
        }
        return [movie.title, movie.desc, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' ')].join(' ').toLowerCase().indexOf(key) !== -1;
      });
      var shown = key ? result : result.slice(0, 96);
      searchResults.innerHTML = shown.map(makeCard).join('');
      if (status) {
        status.textContent = shown.length ? '为你筛选相关内容' : '暂无匹配内容';
      }
    };
    runSearch(q);
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        runSearch(searchInput.value);
      });
    }
  }
})();
