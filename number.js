[].slice.call(document.getElementsByClassName('number'))
.forEach(function NumberInterface(el) {
  if (el.nodeName.toLowerCase() === 'input') {
    el.addEventListener('input', function () {
      /* convert the value string to a value */
      var value = el.value,
        invalid = /[^\d\s,.+-]/.test(value),
        seps = /[\s,.]/g,
        neg = value.indexOf('-') > -1 ? -1 : 1,
        num = value.toString().replace(/[-+]/, ''),
        comma = num.lastIndexOf(','),
        dot = num.lastIndexOf('.'),
        sp = num.lastIndexOf(' '),
        rightmost = Math.max(comma, dot, sp),
        grps = num.split(seps).length,
        normalized = num;

      if (el.value && !invalid) {
        /* if there is a group separator and a decimal separator */
        if ((comma > -1 && dot > -1) ||
            (comma > -1 && sp > -1) ||
            (dot > -1 && sp > -1)) {
          normalized = [num.substr(0, rightmost), num.substr(rightmost)];
          normalized.forEach((v, i, a) => {
            const ref = a;
            ref[i] = v.replace(seps, '');
          });
          normalized = normalized.join('.');
        /* if there are only group separators */
        } else if (grps > 2) {
          normalized = num.replace(seps, '');
        /* if only one separator, assume it's a decimal */
        } else if (grps === 2) {
          normalized = num.replace(seps, '.');
        }

        normalized *= neg;
        invalid = Number.isNaN(Number(normalized));
        /* if num cannot be converted to a number, return undefined */
      }
      
      if (!el.value) {
        el.setAttribute('aria-invalid', '');
      } else {
        if (!invalid) {
          el.number = normalized;
        }
        el.setAttribute('aria-invalid', invalid);
      }
    });
    el.addEventListener('keydown', function (e) {
      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault();
      }
    });
  }
});
