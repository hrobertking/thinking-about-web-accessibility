[].slice.call(document.getElementsByClassName('datepicker'))
.forEach(function DatePickerInterface(field) {
  var input = [].slice.call(field.getElementsByTagName('input'))
        .filter(function (el) { return el.type === 'text' }).pop(),
    bcp47 = input.getAttribute('data-lang') || 'en-US',
    calendar = document.createElement('table'),
    calendarId = input.id + '-calendar',
    controller = document.createElement('button'),
    disclosure = document.createElement('div'),
    focusFrom,
    months = document.createElement('select'),
    next = document.createElement('button'),
    prev = document.createElement('button'),
    sibling = input.nextElementSibling,
    tbody = document.createElement('tbody'),
    thead = document.createElement('thead'),
    weekdays = document.createElement('tr'),
    weeks = tbody.getElementsByTagName('tr'),
    year = document.createElement('input');

  sibling = sibling.getAttribute('role') === 'status' ? sibling : input;
  
  // todo: needs a lang or a way to set the label based on the BCP47 code
  months.setAttribute('aria-label', 'month');
  year.setAttribute('aria-label', 'year');
  
  calendar.className = 'calendar';
  calendar.appendChild(thead);
  calendar.appendChild(tbody);
  Object.defineProperty(calendar, 'draw', {
    enumerable: true,
    value: function () {
      var DAY = 1000 * 60 * 60 * 24,
        PERIOD = new Date(calendar.year, calendar.month, 1),
        START = new Date(calendar.year, calendar.month, 1),
        WEEK = DAY * 7;

      months.selectedIndex = calendar.month;
      year.value = calendar.year;

      while (START.getDay() > 0) {
        START = new Date(START.getTime() - DAY);
      }

      [].slice.call(weeks).forEach(function (row, week) {
        [].slice.call(row.getElementsByTagName('td'))
        .forEach(function (col, day) {
          var button = col.getElementsByTagName('button').item(0),
            d = new Date(START.getTime() + (week * WEEK) + (day * DAY)),
            iso = [
              d.getFullYear(),
              ('0' + (d.getMonth() + 1)).substr(-2),
              ('0' + d.getDate()).substr(-2)
            ].join('-'),
            isAfter = d.getFullYear() > PERIOD.getFullYear() ||
              d.getMonth() > PERIOD.getMonth(),
            isBefore = d.getFullYear() < PERIOD.getFullYear() ||
              d.getMonth() < PERIOD.getMonth();

          col.className = [
            col.className.replace(/\b(before|after)\b/, ''),
            isAfter ? 'after' : '',
            isBefore ? 'before' : ''
          ].join(' ').trim();
          button.getElementsByTagName('span').item(0).innerHTML = ('0' + d.getDate()).substr(-2);
        });
      });
    }
  });
  Object.defineProperty(calendar, 'lang', {
    enumerable: true,
    get: function () {
      return bcp47;
    },
    set: function (value) {
      var analyze = /^([a-z]{2})(-[A-Z]{2})?$/i,
        code = function () {
          return analyze.test(value) &&
            value.replace(analyze, function (m, lang, country) {
              var l = (lang || '').toLowerCase(),
                c = (country || '').toUpperCase();

              return l + c;
            });
        };

      if (code) {
        bcp47 = code;
        setDaysAndMonths();
        input.setAttribute('data-lang', bcp47);
        calendar.setAttribute('lang', bcp47);
      }
    }
  });
  Object.defineProperty(calendar, 'month', {
    enumerable: true,
    get: function () {
      var mo = calendar.getAttribute('data-month'),
        num = mo ? Number(mo) : Number('-');

      return Number.isNaN(num) || num < 0 ? new Date().getMonth() : num;
    },
    set: function (value) {
      var n = Number(value);

      if (!Number.isNaN(n)) {
        months.selectedIndex = n;
        calendar.setAttribute('data-month', n);
        calendar.draw();
      }
    }
  });
  Object.defineProperty(calendar, 'year', {
    enumerable: true,
    get: function () {
      var yr = calendar.getAttribute('data-year'),
        num = yr ? Number(yr) : Number('-');

      return Number.isNaN(num) || num < 0 ?
        new Date().getFullYear() :
        num;
    },
    set: function (value) {
      var n = Number(value);

      if (!Number.isNaN(n)) {
        year.value = n;
        calendar.setAttribute('data-year', n);
        calendar.draw();
      }
    }
  });

  controller.setAttribute('aria-controls', calendarId);
  controller.setAttribute('aria-expanded', false);
  controller.type = 'button';
  controller.innerHTML = '◷';
  input.parentNode.insertBefore(controller, sibling.nextElementSibling);

  disclosure.close = function () {
    controller.setAttribute('aria-expanded', false);
    disclosure.setAttribute('aria-hidden', true);
    document.removeEventListener('keydown', function  (e) {
      if (e.key === 'Escape') {
        disclosure.close();
      }
    });
    controller.focus();
  };
  disclosure.open = function () {
    var parsed = input.parse(input.value);

    if (parsed && parsed.month && parsed.year) {
      calendar.month = Number(parsed.month) - 1;
      calendar.year = Number(parsed.year);
    }

    calendar.draw();
    disclosure.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        disclosure.close();
      }
    });
  };
  disclosure.setAttribute('id', calendarId);
  disclosure.setAttribute('aria-hidden', true);
  disclosure.setAttribute('role', 'region');
  disclosure.appendChild(calendar);
  field.parentNode.insertBefore(disclosure, field.nextElementSibling);

  next.innerHTML = '▶';
  prev.innerHTML = '◀';
  year.setAttribute('maxlength', 4);

  function DatePickerCalendar() {
    var clicked = function (e) {
        var target = e.target,
          label = target ? target.getAttribute('aria-label') : '';

        if (label) {
          input.setAttribute('value', input.toString(label));
          disclosure.close();
        }
      },
      idx = 0,
      row = thead.insertRow(-1),
      col = row.insertCell(-1),
      btn, span, dow;

    col.appendChild(prev);

    col = row.insertCell(-1);
    col.setAttribute('class', 'period');
    col.setAttribute('colspan', 5);
    col.appendChild(months);
    col.appendChild(year);

    col = row.insertCell(-1);
    col.appendChild(next);

    weekdays.setAttribute('role', 'row');
    thead.appendChild(weekdays);

    for (var c = 0; c < 7; c += 1) {
      row = document.createElement('tr');
      row.setAttribute('role', 'row');

      for (var i = 0; i < 7; i += 1) {
        dow = 'day-' + i;
        span = document.createElement('span');
        span.id = calendarId + '-' + c + '-' + i;
        
        btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-labelledby', [dow, span.id].join(' '));
        btn.addEventListener('click', clicked);
        btn.appendChild(span);

        col = document.createElement('td');
        col.appendChild(btn);
        row.appendChild(col);
      }
      tbody.appendChild(row);
    }
    setDaysAndMonths();
    calendar.draw();
  }

  function setDaysAndMonths() {
    var dayCols = Array.apply(null, new Array(7))
      .map(function (val, i) {
        var d = new Date(1970, 0, 4 + i),
          lng = d.toLocaleString(bcp47, { weekday: 'long' }),
          sht = d.toLocaleString(bcp47, { weekday: 'short' });

        return '<th scope="col" role="columnheader">' +
          '<span aria-label="' + lng + '" id="day-' + i + '">' +
          sht +
          '</span>' +
          '</th>';
      }),
      monthNames = Array.apply(null, new Array(12))
        .map(function (val, i) {
          var d = new Date();
          d.setMonth(i);
          return d.toLocaleString(bcp47, { month: 'long' });
        }),
      monthOpts = monthNames.map(function (val, i) {
          return '<option value="' + i + '">' +
            val +
            '</option>';
        });

    months.innerHTML = monthOpts.join('');
    next.setAttribute('aria-label', monthNames[calendar.month + 1]);
    prev.setAttribute('aria-label', monthNames[calendar.month - 1]);
    weekdays.innerHTML = dayCols.join('');
  }

  DatePickerCalendar();

  controller.addEventListener('click', function () {
    var isOpen = controller.getAttribute('aria-expanded') === 'true';

    controller.setAttribute('aria-expanded', !isOpen); 
    isOpen && disclosure.close();
    !isOpen && disclosure.open();
  });
  months.addEventListener('change', function (e) {
    calendar.month = months.selectedIndex;
  });
  next.addEventListener('click', function () {
    if (calendar.month === 11) {
      calendar.year += 1;
      calendar.month = 0;
      return;
    }
    calendar.month += 1;
  });
  prev.addEventListener('click', function () {
    if (calendar.month === 0) {
      calendar.year -= 1;
      calendar.month = 11;
      return;
    }
    calendar.month -= 1;
  });
  year.addEventListener('change', function (e) {
    var target = e.target,
      value = target ? target.value : null,
      num = value ? Number(value) : Number('-');

    if (Number.isNaN(num)) {
      year.value = calendar.year;
    } else {
      calendar.year = num;
    }
  });
});
