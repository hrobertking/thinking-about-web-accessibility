[].slice.call(document.getElementsByClassName('slider'))
.forEach(function SliderInterface(slider) {
  var container = {
      left: slider.getBoundingClientRect().left,
      top: slider.getBoundingClientRect().top,
      height: slider.offsetHeight || 1,
      width: slider.offsetWidth || 1,
    },
    controls = {
      input: slider.getElementsByTagName('input').item(0),
      thumb: slider.getElementsByClassName('thumb').item(0),
      value: slider.getElementsByClassName('value').item(0)
    },
    evtChange = new CustomEvent('change'),
    onblur = function (e) {
      slider.hasFocus = false;
    },
    onfocus = function (e) {
      slider.hasFocus = true;
    },
    isDragging,
    dragStart,
    dragValue;

  Object.defineProperty(slider, 'hasFocus', {
    enumerable: true,
    set: function (bool) {
      var cls = /\bfocus\b/;
        
      slider.className = slider.className
        .replace(cls, ' ')
        .trim();

      if (bool) {
        slider.className = [slider.className,
          'focus'].join(' ').trim();
      }
    }
  });
  Object.defineProperty(slider, 'isVertical', {
    enumerable: true,
    get: function () {
      return /\bvertical\b/i.test(slider.className);
    }
  });
  Object.defineProperty(slider, 'max', {
    enumerable: true,
    get: function () {
      return Number(controls.thumb.getAttribute('aria-valuemax'));
    },
    set: function (n) {
      if (!Number.isNaN(n)) {
        controls.thumb.setAttribute('aria-valuemax', n);
      }
    }
  });
  Object.defineProperty(slider, 'min', {
    enumerable: true,
    get: function () {
      return Number(controls.thumb.getAttribute('aria-valuemin'));
    },
    set: function (n) {
      if (!Number.isNaN(n)) {
        controls.thumb.setAttribute('aria-valuemin', n);
      }
    }
  });
  Object.defineProperty(slider, 'percent', {
    enumerable: true,
    get: function () {
      return Math.max(
        Math.min(
          Math.round((this.value / this.range) * 100),
          100
        ),
        0
      );
    },
    set: function (percent) {
      if (!Number.isNaN(percent)) {
        var n = (percent * this.range) + this.min;
        n = Math.max(n, this.min);
        n = Math.min(n, this.max);
        n = Math.round(n / this.step) * this.step;

        this.value = n;
      }
    }
  });
  Object.defineProperty(slider, 'range', {
    enumerable: true,
    get: function() {
      var lg = Math.max(slider.max, slider.min),
        sm = Math.min(slider.max, slider.min);
      
      return lg - sm || 1;
    }
  });
  Object.defineProperty(slider, 'step', {
    enumerable: true,
    get: function () {
      return Number(controls.thumb.getAttribute('data-step')) || 1;
    },
    set: function (n) {
      if (!Number.isNaN(n)) {
        controls.thumb.setAttribute('data-step', n);
      }
    }
  });
  Object.defineProperty(slider, 'value', {
    enumerable: true,
    get: function () {
      return Number(controls.thumb.getAttribute('aria-valuenow'));
    },
    set: function (n) {
      if (!Number.isNaN(n)) {
        controls.input.value = n;
        controls.thumb.setAttribute('aria-valuenow', n);

        /* set the width of the interface */
        var percent = Math.max(
          Math.min(
            Math.round((n / this.range) * 100),
            100
          ),
          0
        );

        controls.value.style.width = percent + '%';
        controls.thumb.style.left = percent + '%';
        this.dispatchEvent(evtChange);
      }
    }
  });
  Object.defineProperty(slider, 'decrement', {
    enumerable: true,
    value: function () {
      this.value = Math.max(this.value - this.step, this.min);
    }
  });
  Object.defineProperty(slider, 'increment', {
    enumerable: true,
    value: function () {
      this.value = Math.min(this.value + this.step, this.max);
    }
  });

  function onMouseMoveX (e) {
    if (isDragging) {
      var distance = e.clientX - dragStart,
        percent = (distance / width) + (dragValue / range),
        size = Math.max(
          Math.min(Math.round(percent * 100), 100),
          0
        );

      if (distance) {
        controls.value.style.width = size + '%';
        controls.thumb.style.left = size + '%';
      }
    }
    e.stopPropagation();
  }
  function onMouseUpX (e) {
    if (isDragging) {
      var distance = Math.abs(e.clientX - container.left),
        percent = distance / width;

      if (distance > 44) {
        slider.percent = percent;
      }
      dragStart = 0;
      dragValue = 0;

      slider.removeEventListener('mousemove', onMouseMoveX);
      slider.removeEventListener('mouseup', onMouseUpX);
      isDragging = false;
    }
    e.stopPropagation();
  }
  function onMouseDownX (e) {
    width = slider.offsetWidth;
    isDragging = true;
    dragStart = e.clientX;
    dragValue = controls.input.value;

    slider.addEventListener('mousemove', onMouseMoveX);
    slider.addEventListener('mouseup', onMouseUpX);
    e.stopPropagation();
  }
  
  function onMouseMoveY (e) {
    if (isDragging) {
      var bottom = controls.value.getBoundingClientRect().bottom,
        dragged = Math.abs(e.clientY - dragStart),
        distance = Math.abs(bottom - e.clientY),
        percent = distance / height,
        size = Math.max(
          Math.min(Math.round(percent * 100), 100),
          0
        );

      if (dragged) {
        controls.value.style.height = size + '%';
        controls.thumb.style.bottom = size + '%';
      }
    }
    e.stopPropagation();
  }
  function onMouseUpY (e) {
    if (isDragging) {
      var bottom = controls.value.getBoundingClientRect().bottom,
          distance = Math.abs(bottom - e.clientY),
        percent = distance / height;

      if (distance > 44) {
        slider.percent = percent;
      }

      dragStart = 0;
      dragValue = 0;

      slider.removeEventListener('mousemove', onMouseMoveY);
      slider.removeEventListener('mouseup', onMouseUpY);
      isDragging = false;
    }
    e.stopPropagation();
  }
  function onMouseDownY (e) {
    height = slider.offsetHeight;
    isDragging = true;
    dragStart = e.clientY;
    dragValue = controls.input.value;
    slider.addEventListener('mousemove', onMouseMoveY);
    slider.addEventListener('mouseup', onMouseUpY);
    e.stopPropagation();
  }
  
  /* constructor */
  controls.input.addEventListener('blur', onblur);
  controls.input.addEventListener('focus', onfocus);
  controls.thumb.addEventListener('blur', onblur);
  controls.thumb.addEventListener('focus', onfocus);
 
  slider.addEventListener('keydown', function (e) {
    switch (e.key) {
      case '-': /* prevent default and fall thru */
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        slider.decrement();
        break;
      case '+': /* prevent default and fall thru */
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        slider.increment();
        break;
      default:
    }
  });
  slider.addEventListener('mousedown', !slider.isVertical ?
    onMouseDownX :
    onMouseDownY
  );

  return slider;
});
