var MoviePlayer = (function () {
  function init(url, poster) {
    var video = document.getElementById('playerVideo');
    var overlay = document.getElementById('playerOverlay');
    var hls = null;
    var ready = false;

    if (!video || !url) {
      return;
    }

    if (poster) {
      video.setAttribute('poster', poster);
    }

    function bind() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        return;
      }

      video.src = url;
    }

    function play() {
      bind();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var request = video.play();

      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    bind();

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (overlay && video.currentTime < 0.1) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  return {
    init: init
  };
})();
