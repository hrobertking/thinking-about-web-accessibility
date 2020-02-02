[].slice.call(document.getElementsByTagName('table'))
.forEach(function SortableTableInterface(table) {
  var description = document.getElementById(
      table.getAttribute('aria-describedby')
    ) || document.createElement('div'),
    sort = function (th) {
      var th,
        ordering = {
          ascending: 1,
          descending: -1,
          none: 0
        },
        transition = ['none', 'ascending', 'descending'],
        currentSort = th.getAttribute('aria-sort'),
        nextSort = transition.indexOf(currentSort) + 1,
        sortOrder = transition[nextSort] || transition[0],
        order = ordering[sortOrder],
        col = th ? th.cellIndex : null,
        body = table.tBodies.item(0),
        tbody = document.createElement('tbody'),
        sortAfter = 1 * order,
        sortBefore = -1 * order,
        rows = [].slice.call(body.rows).sort(function (a, b) {
          function toNum(str) {
            if (str.indexOf('.') > -1 && str.split('.').length === 1) {
              return Number(str.replace(/[,\s]/g, ''));
            } else if (
                str.indexOf(',') > -1 &&
                str.split(',').length === 1
              ) {
              return Number(str.replace(/[.\s]/g, '').replace(',', '.'));
            } else {
              return Number(str.replace(/[.,\s]/g, ''));
            }
          }

          var strA = a.cells[col].innerText,
            numA = toNum(strA),
            strB = b.cells[col].innerText,
            numB = toNum(strB);

          if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
            if (numA > numB) {
              return sortAfter;
            } else if (numA < numB) {
              return sortBefore;
            }
          } else {
            if (strA > strB) {
              return sortAfter;
            } else if (strA < strB) {
              return sortBefore;
            }
          }
          return 0;
        });

      rows.forEach(function (row) {
        tbody.appendChild(row);
      });
      table.replaceChild(tbody, body);
      th.setAttribute('aria-sort', sortOrder);
      description.content = 'Sorted by ' +
        th.innerText + ': ' + sortOrder;
    };
  if (!description.hasOwnProperty('content')) {
    Object.defineProperty(description, 'content', {
	  enumerable: true,
      get: function () {
        return this.innerText;
      },
      set: function (message) {
        function removeClass() {
          description.className = (description.className || '')
            .replace(/\bupdated\b/, ' ').trim();
        }

        this.innerHTML = message;
        this.className = [
          this.className,
          'updated'
        ].join(' ').trim();

        window.setTimeout(removeClass, 3000);
      }
    });
  }
  
  [].slice.call(table.getElementsByTagName('th'))
  .forEach(function (th) {
    if (th.getAttribute(`aria-sort`) !== '') {
	  var btn = document.createElement('button'),
		handler = function () {
		  sort(th);
		}
	  btn.type = 'button';
	  btn.innerHTML = th.innerHTML;
      btn.addEventListener('click', handler);
	  th.innerHTML = '';
	  th.appendChild(btn);
    }
  })
});
