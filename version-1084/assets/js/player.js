(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.querySelector('[data-play-button]');
    var hls = null;
    var ready = false;

    if (!video || !button) {
        return;
    }

    function prepare() {
        if (ready) {
            return Promise.resolve();
        }

        var stream = video.getAttribute('data-stream');
        if (!stream) {
            return Promise.resolve();
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            ready = true;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            ready = true;
            return Promise.resolve();
        }

        video.src = stream;
        ready = true;
        return Promise.resolve();
    }

    function playVideo() {
        prepare().then(function () {
            var result = video.play();
            if (result && typeof result.then === 'function') {
                result.catch(function () {});
            }
        });
    }

    button.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('is-hidden');
        }
    });
    video.addEventListener('ended', function () {
        button.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
})();
