(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('active', position === current);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('active', position === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterForm = document.querySelector('[data-filter-form]');
    var filterInput = document.querySelector('[data-filter-input]');
    var filterList = document.querySelector('[data-filter-list]');

    if (filterInput && filterList) {
        var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-search]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        function applyFilter(value) {
            var keyword = String(value || '').trim().toLowerCase();

            cards.forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
            });
        }

        if (query) {
            filterInput.value = query;
            applyFilter(query);
        }

        filterInput.addEventListener('input', function () {
            applyFilter(filterInput.value);
        });

        if (filterForm) {
            filterForm.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilter(filterInput.value);
            });
        }
    }

    function startPlayer(player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('[data-play]');

        if (!video || !cover) {
            return;
        }

        var playUrl = cover.getAttribute('data-play');

        if (!playUrl) {
            return;
        }

        cover.classList.add('is-hidden');

        if (video.getAttribute('data-ready') !== 'true') {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(playUrl);
                hls.attachMedia(video);
                video._hlsInstance = hls;
            } else {
                video.src = playUrl;
            }

            video.setAttribute('data-ready', 'true');
        }

        var promise = video.play();

        if (promise && promise.catch) {
            promise.catch(function () {});
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
        var cover = player.querySelector('[data-play]');
        var video = player.querySelector('video');

        if (cover) {
            cover.addEventListener('click', function () {
                startPlayer(player);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.getAttribute('data-ready') !== 'true') {
                    startPlayer(player);
                }
            });
        }
    });
}());
