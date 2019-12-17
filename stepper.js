[].slice.call(document.getElementsByClassName('stepper'))
.forEach(function StepperInterface(stepper) {
  var controls = stepper.getElementsByClassName('controls').item(0),
    input = stepper.getElementsByClassName('number').item('0'),
    dec = controls.getElementsByClassName('decrement').item(0),
    inc = controls.getElementsByClassName('increment').item(0),
    aria = controls.getElementsByTagName('span').item(0),
    max = input.getAttribute('data-max'),
    min = input.getAttribute('data-min'),
    step = input.getAttribute('data-step'),
    precision = ([].slice.call(/[,.]([^,.]+)$/g.exec(step) || []).pop() ||
      '').length,
    clear = function () {
      if (aria) {
        aria.innerHTML = '';
      }
    },
    update = function (n) {
      var fixed = n.toFixed(precision);
      
      if (fixed !== input.value) {
        input.value = fixed;
        if (aria) {
          aria.innerHTML = fixed;
        }
      }
    },
    decrease = function () {
      var n = Number(input.value);

      update(Math.max(n - step, min));
    },
    increase = function () {
      var n = Number(input.value);

      update(Math.min(n + step, max));
    };

  /* normalize */
  max = max ? Number(max) : Number.MAX_SAFE_INTEGER;
  min = min ? Number(min) : Number.MIN_SAFE_INTEGER;
  step = Number(step) || 1;

  dec.addEventListener('blur', clear);
  dec.addEventListener('click', decrease);
  inc.addEventListener('blur', clear);
  inc.addEventListener('click', increase);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      increase();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      decrease();
    }
  })
});
