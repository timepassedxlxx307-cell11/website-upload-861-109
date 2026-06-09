(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    function showHero(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }

        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showHero(activeIndex + 1);
        }, 5200);
    }

    if (prev) {
        prev.addEventListener('click', function () {
            showHero(activeIndex - 1);
            startHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showHero(activeIndex + 1);
            startHero();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showHero(index);
            startHero();
        });
    });

    startHero();

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-site-search]'));
    var searchPanel = document.querySelector('[data-search-panel]');

    function renderSuggestions(query) {
        if (!searchPanel || typeof movieCatalogue === 'undefined') {
            return;
        }

        var value = query.trim().toLowerCase();
        if (!value) {
            searchPanel.classList.remove('is-open');
            searchPanel.innerHTML = '';
            return;
        }

        var matches = movieCatalogue.filter(function (item) {
            return [item.title, item.region, item.type, item.year, item.genre].join(' ').toLowerCase().indexOf(value) !== -1;
        }).slice(0, 8);

        searchPanel.innerHTML = matches.map(function (item) {
            return '<a href="' + item.url + '"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</span></a>';
        }).join('');
        searchPanel.classList.toggle('is-open', matches.length > 0);
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            renderSuggestions(input.value);
        });

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && input.value.trim()) {
                window.location.href = './movies.html?q=' + encodeURIComponent(input.value.trim());
            }
        });
    });

    document.addEventListener('click', function (event) {
        if (searchPanel && !event.target.closest('.header-search')) {
            searchPanel.classList.remove('is-open');
        }
    });

    var filterInput = document.querySelector('[data-filter-input]');
    var filterGrid = document.querySelector('[data-filter-grid]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var activeFilter = '';

    function runFilter() {
        if (!filterGrid) {
            return;
        }

        var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var cards = Array.prototype.slice.call(filterGrid.children);
        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.textContent
            ].join(' ').toLowerCase();
            var visible = (!query || haystack.indexOf(query) !== -1) && (!activeFilter || haystack.indexOf(activeFilter.toLowerCase()) !== -1);
            card.setAttribute('data-hidden', visible ? 'false' : 'true');
        });
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
            filterInput.value = initialQuery;
        }
        filterInput.addEventListener('input', runFilter);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) {
                item.classList.remove('is-active');
            });
            button.classList.add('is-active');
            activeFilter = button.getAttribute('data-filter-value') || '';
            runFilter();
        });
    });

    runFilter();

    var jumpSearch = document.querySelector('[data-jump-search]');
    if (jumpSearch) {
        var form = jumpSearch.closest('form');
        form.addEventListener('submit', function (event) {
            if (!jumpSearch.value.trim()) {
                event.preventDefault();
            }
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
