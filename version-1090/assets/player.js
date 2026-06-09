(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.querySelector('[data-player-button]');

    if (!video) {
      return;
    }

    var media = video.getAttribute('data-video-src');
    var attached = false;
    var hls = null;

    function attach() {
      if (attached || !media) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = media;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(media);
        hls.attachMedia(video);
      } else {
        video.src = media;
      }
      attached = true;
    }

    function start() {
      attach();
      if (button) {
        button.classList.add('is-hidden');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!attached) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
