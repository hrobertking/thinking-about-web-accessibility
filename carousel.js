[].slice.call(document.getElementsByClassName('carousel'))
.forEach(function CarouselInterface(el) {
  var ANIMATION_DELAY = Number(el.getAttribute('data-delay')) * 1000,
    btnNext = [].slice.call(el.getElementsByTagName('button'))
      .filter(function isNext(btn) {
        return btn.name === 'next';
      }).pop(),
    btnPrev = [].slice.call(el.getElementsByTagName('button'))
      .filter(function isNext(btn) {
        return btn.name === 'previous';
      }).pop(),
    index = 0,
    panels = [].slice.call(
      el.getElementsByClassName('viewer').item(0)
        .getElementsByTagName('div')
    ),
    tablist = [].slice.call(
      el.getElementsByTagName('div')
    ).filter(list => list.getAttribute('role') === 'tablist')[0],
    tabs = [].slice.call(
      tablist.getElementsByTagName('button')
    ),
    next = function next() {
      index += 1;
      index %= tabs.length;
      tabs[index].click();
    },
    previous = function previous() {
      index -= 1;
      index = index < 0 ? index + tabs.length : index;
      tabs[index].click();
    },
    timer;

  function play() {
    timer = setInterval(next, ANIMATION_DELAY);
  }
  function stop() {
    clearInterval(timer);
  }

  if (btnNext) {
    btnNext.addEventListener('click', next);
  }
  if (btnPrev) {
    btnPrev.addEventListener('click', previous);
  }

  [].slice.call(
    el.getElementsByTagName('button')
  ).filter(btn => btn.name === 'play')
  .pop()
  .addEventListener('click', (e) => {
    if (timer) {
      e.target.name = 'play';
      stop();
    } else {
      e.target.name = 'pause';
      play();
    }
  });
  tabs.forEach(function CarouselTab(btn, i) {
    btn.addEventListener('click', (e) => {
      var target = e.target,
        activePanel = document.getElementById(
          target.getAttribute('aria-controls')
        );

      tabs.filter(tab => tab !== target)
      .forEach(tab => {
        var panel = document.getElementById(
          tab.getAttribute('aria-controls')
        );

        panel && panel.setAttribute('aria-hidden', true);
        tab.setAttribute('aria-selected', false);
      });

      activePanel && activePanel.setAttribute('aria-hidden', false);
      target.setAttribute('aria-selected', true);
    });

    if (btn.getAttribute('aria-selected') === 'true') {
      btn.click();
    }
  });
});
