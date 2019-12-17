[].slice.call(document.getElementsByClassName('video-player'))
.forEach(function VideoInterface(player) {
  var video = player.getElementsByTagName('video').item(0),
    sources = player.getElementsByTagName('source'),
    track = player.getElementsByTagName('track').item(0),
    captioning = player.getElementsByClassName('captioning').item(0),
    clock = player.getElementsByClassName('clock').item(0)
      .getElementsByClassName('slider').item(0),
    elapsed = player.getElementsByClassName('elapsed').item(0),
    duration = player.getElementsByClassName('duration').item(0),
    controls = {
      play: player.getElementsByClassName('play').item(0),
      stop: player.getElementsByClassName('stop').item(0),
      rev: player.getElementsByClassName('rewind').item(0),
      ff: player.getElementsByClassName('forward').item(0),
      cc: player.getElementsByClassName('captions').item(0),
      screensize: player.getElementsByClassName('screen').item(0),
      volume: player.getElementsByClassName('volume').item(0)
    },
    rewinding = false,
    Time = {
      get: function () {
        var html = this.innerText || '',
          mods = [1, 60, 60, 24, 365];
        
        return html.split(':').reverse().reduce(function (t, v, i) {
          return t += Number(v) * mods.slice(0, i + 1)
            .reduce(function (ttl, val) {
              return ttl *= val;
            }, 1);
        }, 0);
      },
      set: function (secs) {
        var mods = [1, 60, 60, 24, 365],
          ts = mods.reverse().map(function (val, idx) {
              var amt = Math.round(secs),
                c,
                mod,
                len = -2;

              for (c = 0; c < idx; c += 1) {
                mod = mods.slice(c).reduce(function (t, v) {
                    return t *= v;
                  }, 1);
                amt = amt % mod;
              }
              mod = mods.slice(idx).reduce(function (t, v) {
                  return t *= v;
                }, 1);
              amt = Math.floor(amt / mod).toString();
              len = Math.min(-2, amt.length * -1);

              return ('0' + amt).substr(len);
            })
            .join(':')
            .replace(/^00:(00:(00:)?)?/, '');

        this.innerHTML = ts;
      }
    };

  Object.defineProperty(controls.cc, 'pressed', {
    enumerable: true,
    get: function () {
      return this.getAttribute('aria-pressed') === 'true';
    },
    set: function (value) {
      var values = ['true', 'false'],
        bool = typeof value === 'boolean' || values.indexOf(value) > -1 ?
          JSON.parse(value) :
          false;

      this.setAttribute('aria-pressed', bool);
      captioning.setAttribute('aria-hidden', !bool)
    },
  });
  Object.defineProperty(controls.play, 'pressed', {
    enumerable: true,
    get: function () {
      return this.getAttribute('aria-pressed') === 'true';
    },
    set: function (value) {
      var values = ['true', 'false'],
        bool = typeof value === 'boolean' || values.indexOf(value) > -1 ?
          JSON.parse(value) :
          false;

      this.setAttribute('aria-pressed', bool);
      this.setAttribute('aria-label', bool ? 'Pause' : 'Play');
    },
  });
  Object.defineProperty(controls.screensize, 'pressed', {
    enumerable: true,
    get: function () {
      return this.getAttribute('aria-pressed') === 'true';
    },
    set: function (value) {
      var values = ['true', 'false'],
        bool = typeof value === 'boolean' || values.indexOf(value) > -1 ?
          JSON.parse(value) :
          false,
        description = [].slice.call(this.childNodes)
        .filter(function (node) {
          var pattern = bool ? /\bon\b/i : /\boff\b/i;
          
          return pattern.test(node.className) || pattern.test(node.id);
        }).pop(),
        describedBy = description ? description.id : null,
        rand = Math.random().toString().substr(2);

      this.setAttribute('aria-pressed', bool);
      describedBy = describedBy || 'video-volume-' + rand;
      description && this.setAttribute('aria-describedby', describedBy);
    }
  });
  Object.defineProperty(controls.screensize, 'fullscreen', {
    enumerable: true,
    value: function (value) {
      if (value) {
        player.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  });
  Object.defineProperty(controls.volume, 'expanded', {
    enumerable: true,
    get: function () {
      return this.getAttribute('aria-expanded') === 'true';
    },
    set: function (value) {
      var values = ['true', 'false'],
        bool = typeof value === 'boolean' || values.indexOf(value) > -1 ?
          JSON.parse(value) :
          false,
        onChange = function () {
          controls.volume.value = controls.volume.slider.value;
        };

      this.setAttribute('aria-expanded', bool);
      if (bool) {
        this.value = Math.floor(this.slider.value || video.volume * 10);
        this.slider.addEventListener('change', onChange);
        this.slider.focus();
      } else {
        this.slider.removeEventListener('change', onChange);
      }
    }
  });
  Object.defineProperty(controls.volume, 'slider', {
    enumerable: true,
    get: function () {
      return this.getElementsByClassName('slider').item(0);
    }
  });
  Object.defineProperty(controls.volume, 'value', {
    enumerable: true,
    get: function () {
      return this.slider.value;
    },
    set: function (value) {
      var l = ['off', 'soft', 'medium', 'loud'],
        level = Math.max(0, Math.min(l.length - 1, Math.ceil(value / 3))),
        amount = value / 10;

      this.setAttribute('data-level', l[level]);
      video.volume = amount;
    }
  });

  Object.defineProperty(duration, 'value', Time);
  Object.defineProperty(elapsed, 'value', Time);

  Object.defineProperty(player, 'enabled', {
    enumerable: true,
    get: function () {
      var bool = true;
      Object.keys(controls).forEach(function (name) {
        if (controls[name].disabled) {
          bool = false;
        }
      });
      return bool;
    },
    set: function (value) {
      Object.keys(controls).forEach(function (key) {
        controls[key].disabled = !value;
      })
    }
  });

  player.addEventListener('fullscreenchange', function (e) {
    player.className = [
      player.className.replace(/\bfullscreen\b/, ''),
      !!document.fullscreenElement ? 'fullscreen' : ''
    ].join(' ').trim();
    controls.screensize.pressed = !!document.fullscreenElement;
  });
  
  video.addEventListener('canplay', function () {
    controls.volume.value = video.volume * 10;
    duration.value = video.duration || 0;
    clock.setAttribute('data-max', duration.value);
    player.enabled = true;
  });
  video.addEventListener('durationchange', function() {
    duration.value = video.duration || 0;
    clock.setAttribute('data-max', duration.value);
  });
  video.addEventListener('timeupdate', function () {
    /* update-progress */
    elapsed.value = video.currentTime;
    clock.value = video.currentTime;
  });
  track.addEventListener('cuechange', function (cue) {
    captioning.innerHTML = cue;
  });

  controls.cc.addEventListener('click', function (e) {
    var target = e.target;

    target.pressed = !target.pressed;
    return target.pressed;
  });
  controls.screensize.addEventListener('click', function (e) {
    var target = e.target,
      on = !target.pressed;

    target.pressed = on;
    controls.screensize.fullscreen(on);
    return on;
  });
  controls.ff.addEventListener('click', function (e) {
    video.play();
    video.playbackRate = 4;
  });
  controls.play.addEventListener('click', function () {
    controls.play.pressed = !controls.play.pressed;

    if (rewinding) {
      clearInterval(rewinding);
    }
    if (controls.play.pressed) {
      video.playbackRate = 1;
      video.play();
    } else {
      video.pause();
    }
  });
  controls.rev.addEventListener('click', function (e) {
    rewinding = setInterval(function () {
      var timeIndex = Math.max(video.currentTime - .1, 0);

      video.currentTime = timeIndex;
      if (timeIndex === 0) {
        clearInterval(rewinding);
        controls.stop.click();
      }
    }, 0);
  });
  controls.stop.addEventListener('click', function (e) {
    controls.play.pressed = false;
    video.pause();
    video.currentTime = 0;
  });
  controls.volume.addEventListener('click', function (e) {
    controls.volume.expanded = true;
  });
  controls.volume.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      controls.volume.expanded = false;
    }
  });
  controls.volume.slider.addEventListener('blur', function (e) {
    controls.volume.focus();
    controls.volume.expanded = false;
  });
  
  player.enabled = false;
  elapsed.value = 0;
  duration.value = 0;
});
