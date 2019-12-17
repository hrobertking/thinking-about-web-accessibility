[].slice.call(document.getElementsByClassName('timer'))
.forEach(function TimerInterface(timer) {
  var blnExpire = false,
    evtExpired = new CustomEvent('expired'),
    evtTick = new CustomEvent('tick'),
    intInterval,
    intElapsed, // milliseconds
    intRemaining, // milliseconds
    intSpoken, // milliseconds
    intTicked, // milliseconds from getTime
    elAudio = timer.getElementsByClassName('audio'),
    elElapsed = timer.getElementsByClassName('elapsed').item(0),
    elRemaining = timer.getElementsByClassName('remaining').item(0),
    elAudioElapsed,
    elAudioRemaining;

  function FixedArray(length) {
    return Array.apply(null, new Array(length));
  }

  // value is milliseconds
  function Time(value) {
    return {
      value: value || 0,
      toDuration: function () {
        var ts = Math.round(this.value/1000),
          prefix = ['P', '', 'T', '', ''],
          suffix = ['Y', 'D', 'H', 'M', 'S'],
          mods = [31536000, 86400, 3600, 60, 1],
          c = 0,
          amt,
          to = '';

        while (ts > 0 && c < mods.length) {
          amt = Math.floor(ts / mods[c]);
          to += prefix[c] + (amt > 0 ? amt + suffix[c] : '');
          ts -= (amt * mods[c]);
          c += 1;
        }

        return to;
      },
      toString: function (format) {
        var amt,
          c = 0,
          d = (format || '').split(':').map(function (p) {
            return p.length;
          }),
          l = [0, 0, 0, 2, 2],
          missing = FixedArray(l.length - d.length),
          mods = [31536000, 86400, 3600, 60, 1],
          to = [],
          ts = Math.round(this.value/1000);

        if (format) {
          l = missing.concat(d).map(function (v) {
            return v || 0;
          });
        }

        if (ts) {
          while (c < mods.length) {
            amt = Math.floor(ts / mods[c]);
            to.push(amt);
            ts -= (amt * mods[c]);
            c += 1;
          }
        }

        return to.map(function (val, i) {
          var str = (val || l[i] ? val : '') + '',
            len = l[i] - str.length,
            fill = len > 0 ?
              FixedArray(l[i] - str.length).reduce(function (ttl) {
                  return ttl + '0';
                }, '') :
              '';
          return fill + str;
        }).filter(function (val, idx) {
          return !!val.length;
        }).join(':') || l.map(function (l) {
          return FixedArray(l).map(function () {
              return '0';
            }).join('');
          }).filter(function (s) {
            return !!s;
          }).join(':');
      }
    };
  }

  Object.defineProperty(timer, 'elapsed', {
    enumerable: true,
    get: function () {
      return new Time(intElapsed);
    },
    set: function (value) {
      var ms = Number(value || '0');

      if (!Number.isNaN(ms)) {
        intElapsed = ms;
      }
    }
  });
  Object.defineProperty(timer, 'remaining', {
    enumerable: true,
    get: function () {
      return new Time(intRemaining);
    },
    set: function (value) {
      var ms = Number(value || '0');

      if (!Number.isNaN(ms)) {
        blnExpire = ms > 0;
        intRemaining = ms;
      }
    }
  });
  Object.defineProperty(timer, 'start', {
    enumerable: true,
    value: function (ts) {
      intElapsed = intElapsed || 0;
      intInterval = setInterval(tick, 1000);
      intRemaining = intRemaining || 0;
      intSpoken = new Date().getTime();
      intTicked = new Date().getTime();
    }
  });
  Object.defineProperty(timer, 'stop', {
    enumerable: true,
    value: function () {
      intSpoken = 0;
      clearInterval(intInterval);
    }
  });

  function audioCreate(elapsed, remaining) {
    if (!elapsed) {
      elAudioElapsed = document.createElement('span');
      elAudioElapsed.setAttribute('class', 'audio elapsed');
      timer.appendChild(elAudioElapsed);
    }
    if (!remaining) {
      elAudioRemaining = document.createElement('span');
      elAudioRemaining.setAttribute('class', 'audio remaining');
      timer.appendChild(elAudioRemaining);
    }
  }
  function audioMap() {
    var c = elAudio.length - 1;

    while (c > -1) {
      if (/\belapsed\b/.test(elAudio.item(c).className)) {
        elAudioElapsed = elAudio.item(c);
      }
      if (/\bremaining\b/.test(elAudio.item(c).className)) {
        elAudioRemaining = elAudio.item(c);
      }
      c -= 1;
    }

    if (!elAudioElapsed || !elAudioRemaining) {
      audioCreate(elAudioElapsed, elAudioRemaining);
    }
  }
  function tick() {
    var since = new Date().getTime() - (intTicked || 0),
      elapsedFormat = elElapsed.getAttribute('data-format'),
      remainingFormat = elRemaining.getAttribute('data-format');

    intTicked = new Date().getTime();
    timer.dispatchEvent(evtTick);

    intElapsed += since;
    intElapsed = Math.max(intElapsed, 0);
    elElapsed.innerHTML = timer.elapsed.toString(elapsedFormat);

    if (intRemaining) {
      intRemaining -= since;
      intRemaining = Math.max(intRemaining, 0);
      elRemaining.innerHTML = timer.remaining.toString(remainingFormat);
    } else if (blnExpire) {
      elAudioRemaining.innerHTML = timer.remaining.toString();
      blnExpire = false;
      timer.dispatchEvent(evtExpired);
    }

    if (intTicked - intSpoken > 19999) {
      if (intElapsed) {
        elAudioElapsed.innerHTML = timer.elapsed.toString();
      }
      if (intRemaining) {
        elAudioRemaining.innerHTML = timer.remaining.toString();
      }
      intSpoken = intTicked;
    }
  }
  function toMilliseconds(value) {
    var mods = [1000, 60, 60, 24],
      time = (value || '').split(':')
        .reverse()
        .reduce(function (ttl, val, idx) {
          var mod = mods.slice(0, idx + 1)
            .reduce(function (acc, cur) {
              acc *= cur;
              return acc;
            }, 1);

          ttl += Number(val) * mod;
          return ttl;
        }, 0);

    return time;
  }

  // configure the display nodes
  if (!elElapsed) {
    elElapsed = document.createElement('time');
    elElapsed.setAttribute('class', 'elapsed');
    timer.appendChild(elElapsed);
  }
  if (!elRemaining) {
    elRemaining = document.createElement('time');
    elRemaining.setAttribute('class', 'remaining');
    timer.appendChild(elRemaining);
  }

  // configure the speaking nodes
  if (!elAudio) {
    audioCreate();
  } else {
    audioMap();
  }

  elAudioElapsed && elAudioElapsed.setAttribute('role', 'alert');
  elAudioRemaining && elAudioRemaining.setAttribute('role', 'alert');

  // configure the elapsed and remaining time from the attributes
  timer.elapsed = toMilliseconds(elElapsed.innerText);
  timer.remaining = toMilliseconds(elRemaining.innerText);

  return timer;
});
