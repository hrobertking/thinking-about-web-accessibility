[].slice.call(document.getElementsByClassName('progressbar'))
.forEach(function ProgressBarInterface(bar) {
  var indicator = bar.getElementsByClassName('indicator').item(0);

  Object.defineProperty(bar, 'max', {
    enumerable: true,
    get: function () {
      var value = this.getAttribute('aria-valuemax');

      if (value) {
        return Number(value);
      }
    },
    set: function (value) {
      var num = Number(value);
      
      if (!Number.isNaN(num)) {
        this.setAttribute('aria-valuemax', num);
      }
    }
  });
  Object.defineProperty(bar, 'min', {
    enumerable: true,
    get: function () {
      var value = this.getAttribute('aria-valuemin');

      if (value) {
        return Number(value);
      }
    },
    set: function (value) {
      var num = Number(value);
      
      if (!Number.isNaN(num)) {
        this.setAttribute('aria-valuemin', num);
      }
    }
  });
  Object.defineProperty(bar, 'range', {
    enumerable: true,
    get: function () {
      return this.max - this.min;
    }
  });
  Object.defineProperty(bar, 'text', {
    enumerable: true,
    get: function () {
      var value = this.getAttribute('aria-valuetext'),
        p = /^(\d+)%$/.exec(value),
        percent,
        num;
  
      if (p) {
        percent = Number(p[1]) / 100;
        return (this.range * percent) + this.min;
      } else {
        return Number(value);
      }
    },
    set: function (value) {
      this.value = value;
    }
  });
  Object.defineProperty(bar, 'value', {
    enumerable: true,
    get: function () {
      return this.getAttribute('aria-valuenow');
    },
    set: function (value) {
      var p = /^(\d+)%$/.exec(value),
        percent,
        num,
        valuenow;
  
      if (p) {
        percent = Number(p[1]) / 100;
        num = (this.range * percent) + this.min;
      } else {
        num = Number(value);
        percent = (num - this.min) / (this.max || 1);
      }
      valuenow = Math.round(percent * 100);

      if (!Number.isNaN(num)) {
        this.setAttribute('aria-valuetext', num);
      }
      if (!Number.isNaN(percent)) {
        this.setAttribute('aria-valuenow', valuenow + '%');
        if (/^path$/i.test(indicator.nodeName)) {
          indicator.setAttribute('stroke-dasharray', valuenow + ', 100');
        } else {
          indicator.style.width = this.value;
        }
      }
    }
  });

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.setAttribute('class', 'indicator');
    bar.appendChild(indicator);
  }
  bar.setAttribute('role', 'progressbar');
  if (!bar.max) {
    bar.max = 100;
  }
  if (!bar.min) {
    bar.min = 0;
  }
  if (bar.value || bar.text) {
    bar.value = (bar.value || bar.text);
  }

  return bar;
});
