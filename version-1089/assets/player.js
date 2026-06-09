(function () {
  var video = document.getElementById('player-video');
  var start = document.getElementById('player-start');
  if (!video || typeof PLAYER_STREAM === 'undefined') {
    return;
  }
  var attached = false;
  var hls = null;
  var attach = function () {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = PLAYER_STREAM;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(PLAYER_STREAM);
      hls.attachMedia(video);
    } else {
      video.src = PLAYER_STREAM;
    }
  };
  var play = function () {
    attach();
    if (start) {
      start.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  };
  if (start) {
    start.addEventListener('click', play);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    if (start) {
      start.classList.add('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
