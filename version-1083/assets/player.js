(function () {
  function initMoviePlayer(source) {
    var video = document.getElementById('movie-video');
    var shell = document.getElementById('player-shell');
    var trigger = document.getElementById('play-trigger');
    var hls = null;
    var attached = false;

    if (!video || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      attached = true;
    }

    function hideTrigger() {
      if (trigger) {
        trigger.classList.add('is-hidden');
      }
    }

    function play() {
      attach();
      hideTrigger();
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (trigger) {
      trigger.addEventListener('click', play);
    }

    if (shell) {
      shell.addEventListener('click', function (event) {
        if (event.target === video && !attached) {
          play();
        }
      });
    }

    video.addEventListener('play', hideTrigger);
    video.addEventListener('loadedmetadata', function () {
      if (hls && video.paused && trigger && trigger.classList.contains('is-hidden')) {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
