(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-nav-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
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

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var nextIndex = Number(dot.getAttribute("data-hero-dot"));
                show(nextIndex);
                start();
            });
        });

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function setupFiltering() {
        var params = new URLSearchParams(window.location.search);
        var query = (params.get("q") || "").trim().toLowerCase();
        var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-item]"));
        var status = document.querySelector("[data-filter-status]");
        if (!query || !items.length) {
            return;
        }
        var matched = 0;
        items.forEach(function (item) {
            var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
            var visible = text.indexOf(query) !== -1;
            item.hidden = !visible;
            if (visible) {
                matched += 1;
            }
        });
        if (status) {
            status.textContent = "搜索“" + query + "”共找到 " + matched + " 条结果";
        }
    }

    window.initMoviePlayer = function (Hls) {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var cover = player.querySelector(".player-cover");
            var source = player.getAttribute("data-src");
            var prepared = false;

            function prepare() {
                if (prepared || !video || !source) {
                    return;
                }
                prepared = true;
                if (Hls && Hls.isSupported && Hls.isSupported()) {
                    var hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    player._hls = hls;
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else {
                    video.src = source;
                }
            }

            function play() {
                prepare();
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                var request = video.play();
                if (request && typeof request.catch === "function") {
                    request.catch(function () {
                        if (cover) {
                            cover.classList.remove("is-hidden");
                        }
                    });
                }
            }

            if (cover) {
                cover.addEventListener("click", play);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (video.paused) {
                        play();
                    }
                });
                video.addEventListener("play", function () {
                    if (cover) {
                        cover.classList.add("is-hidden");
                    }
                });
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFiltering();
    });
})();
