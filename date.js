[].slice.call(document.getElementsByClassName('date'))
.forEach(function DateInterface(el) {
  var convert = function convert(dt) {
      if (typeof dt !== 'undefined' &&
        typeof dt.year !== 'undefined' &&
        typeof dt.month !== 'undefined' &&
        typeof dt.day !== 'undefined') {
        var d = new Date(dt.year, dt.month - 1, dt.day),
          dtz = d.toISOString().substr(11).split(':')
            .reduce(function (t, v, i) {
              var mods = [60, 1, 1],
                mod = mods.slice(i).reduce(function (min, seg) {
                    return min *= seg;
                  }, 1),
                n = Number(v.replace(/[a-z]/ig, ''));

              return t += n * mod;
            }, 0),
          tzo = d.getTimezoneOffset();
        return new Date(d.getTime() + (dtz !== tzo ? tzo * 60000 : 0));
      }
    },
    dfe = el.getElementsByClassName('data-format').item(0),
    hint = el.getElementsByClassName('hint').item(0),
    input = el.getElementsByTagName('input').item(0),
    isLeap = function (yy) {
      return (yy % 400 === 0) || (yy % 100 !== 0 && yy % 4 === 0);
    },
    dfa = input.getAttribute('data-format') || 'dd/mm/yyyy',
    lang = input.getAttribute('data-lang') || 'en-US',
    options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

  if (input) {
    input.format = dfe ? dfe.innerHTML : dfa;
    input.parse = function (value) {
      var name = {
        d: 'day',
        dd: 'day',
        m: 'month',
        mm: 'month',
        yy: 'year',
        yyyy: 'year'
      };

      var keys = input.format.split(/[^ymd]/i),
        parts = {};
      
      keys.map(function (v, i) {
        parts[name[v]] = (value || '').split(/\D/)[i];
      });

      return parts;
    };
    input.toString = function (dt, fmt) {
      var formatter = fmt || input.format,
        iso = typeof dt === 'string' &&
          /(\d{4})\D(\d{2})\D(\d{2})/.test(dt) ?
          dt.split(/\D/g).map(function (n) { return Number(n); }) :
          null,
        keys = formatter.split(/[^ymd]/i),
        trFromDate = {
          d: function () {
            return dt.getDate();
          },
          dd: function () {
            return ('0' + dt.getDate()).substr(-2);
          },
          m: function () {
            return dt.getMonth() + 1;
          },
          mm: function () {
            return ('0' + (dt.getMonth() + 1)).substr(-2);
          },
          yy: function () {
            return dt.getFullYear().substr(-2);
          },
          yyyy: function () {
            return dt.getFullYear() + '';
          }
        },
        trFromIso = {
          d: function () {
            return iso[2];
          },
          dd: function () {
            return ('0' + iso[2]).substr(-2);
          },
          m: function () {
            return iso[1];
          },
          mm: function () {
            return ('0' + iso[1]).substr(-2);
          },
          yy: function () {
            return iso[0] % 100;
          },
          yyyy: function () {
            return iso[0];
          }
        },
        str = dt instanceof Date || iso.length ? formatter : '';

      if (dt instanceof Date) {
        keys.forEach(function (key) {
          str = str.replace(key, trFromDate[key]());
        });
      } else if (iso.length) {
        keys.forEach(function (key) {
          str = str.replace(key, trFromIso[key]());
        });
      }

      return str;
    };
    input.validate = function (dt) {
      var dim,
        msPerDay = 1000 * 60 * 60 * 24,
        parts = Object.keys(dt),
        required = ['year', 'month', 'day'],
        valid = required.reduce(function (ttl, part) {
          var value = dt[part];

          if (Number.isNaN(value) || typeof value === 'undefined') {
            ttl = false;
          }
          return ttl;
        }, true);

      if (!valid) {
        return;
      }

      if (dt.month < 1 || dt.month > 12) {
        return false;
      }

      dim = (new Date(dt.year, dt.month, 1).getTime() -
        new Date(dt.year, dt.month - 1, 1).getTime()) / msPerDay;
      if (dt.day < 1 || dt.day > dim) {
        return false;
      }
      return true;
    };
 
    input.addEventListener('input', (e) => {
      var val = input.parse(e.target.value),
        converted = convert(val),
        iso = [val.year, val.month, val.day].join('-'),
        valid = input.validate(val);

      input.setAttribute('aria-invalid', typeof valid === 'undefined' ?
        '' : !valid);
      if (valid) {
        input.setAttribute('data-value', iso);

        if (hint) {
          hint.innerHTML = converted.toLocaleDateString(lang, options);
        }
      }
    });
  }
});
