[].slice.call(document.getElementsByClassName('combobox'))
.forEach(function ComboboxInterface(combobox) {
  var activeIndex = 0,
    listlength = combobox.getElementsByClassName('listlength').item(0),
    match = function match(el, value) {
      return el.innerText
        .toLowerCase()
        .indexOf(value.toLowerCase()) === 0;
    },
    onInput = function onInput() {
      if (!combobox.isOpen) {
        combobox.open();
      }
      combobox.filter();
    },
    onKeyDown = function onKeyDown(e) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!combobox.isOpen) {
            combobox.open();
            combobox.items().first();
          } else {
            combobox.items().next();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!combobox.isOpen) {
            combobox.open();
            combobox.items().last();
          } else {
            combobox.items().previous();
          }
          break;
        case 'Enter':
          e.preventDefault();
          combobox.input.setValue();
          break;
        case 'Escape':
          e.preventDefault();
          combobox.close();
          combobox.input.value = '';
        default:
      }
    },
    select = function select(e) {
      var target = e.target;
      if (target) {
        combobox.items().reset();
        target.setAttribute('aria-selected', 'true');
        combobox.input.setValue();
      }
    };
  Object.defineProperty(combobox, 'isInvalid', {
    enumerable: true,
    get: function() {
      return combobox.input.getAttribute('aria-invalid') === 'true';
    },
    set: function(value) {
      combobox.input.setAttribute('aria-invalid', !!value);
    }
  });
  Object.defineProperty(combobox, 'isOpen', {
    enumerable: true,
    get: function () {
      return combobox.input.getAttribute('aria-expanded') === 'true';
    }
  });
  
  combobox.close = function (e) {
    combobox.input.setAttribute('aria-expanded', 'false');
    combobox.listbox.setAttribute('tabindex', -1)
    combobox.listbox.className = combobox.listbox.className
      .replace(/\s*open\s*/, ' ').trim();
  };
  combobox.filter = function () {
    var value = combobox.input.value,
      items = [].slice.call(combobox.listbox.data),
      active;
      
    combobox.items().reset();
    items.forEach(function filterList(item) {
      item.setAttribute('aria-hidden', !match(item, value));
    });
    
    active = items.filter(function active(el) {
      return el.getAttribute('aria-hidden') !== 'true';
    });
    
    if (active.length === 1) {
      combobox.items().select(active[0], true);
    }

    combobox.listbox.setAttribute('data-count', active.length);
    listlength.innerHTML = active.length;
  };
  combobox.items = function () {
    var value = combobox.input.value,
      lis = [].slice.call(combobox.listbox.data),
      listItems = lis.map(function (li) {
          if (li) {
            li.setAttribute('aria-hidden', !match(li, value));
          }
          return li;
        }).filter(function (li) {
          return li && li.getAttribute('aria-hidden') !== 'true';
        });
        
    listItems.first = function () {
      var list = combobox.listbox.data,
        count = list.length - 1,
        target = 0;
      while (count > -1) {
        if (list.item(count).getAttribute('aria-hidden') !== 'true') {
          target = count;
        }
        count -= 1;
      }
      count = list.length - 1;
      while (count > -1) {
        listItems.select(count, count === target);
        count -= 1;
      }
      
      return list.item(target);
    };
    listItems.last = function () {
      var list = combobox.listbox.data,
        count = list.length - 1,
        target = 0;
      
      while (count > -1) {
        if (list.item(count).getAttribute('aria-hidden') !== 'true') {
          target = count;
          break;
        }
        count -= 1;
      }
      count = list.length - 1;
      while (count > -1) {
        listItems.select(count, count === target);
        count -= 1;
      }
      
      return list.item(target);
    };
    listItems.next = function () {
      var list = combobox.listbox.data,
        i = list.length - 1,
        selected,
        target;

      while (i > -1 && !selected) {
        if (list.item(i).getAttribute('aria-selected') === 'true') {
          selected = listItems.select(i, false);
        }
        i -= 1;
      }
      
      if (selected) {
        selected = selected.nextElementSibling;
        while (selected) {
          if (selected.getAttribute('aria-hidden') !== 'true') {
            selected = listItems.select(selected, true);
            break;
          }
          selected = selected.nextElementSibling;
        }
      }
      
      if (!selected) {
        selected = listItems.first();
      }
      return selected;
    };
    listItems.previous = function () {
      var list = combobox.listbox.data,
        i = list.length - 1,
        selected,
        target;

      while (i > -1 && !selected) {
        if (list.item(i).getAttribute('aria-selected') === 'true') {
          selected = listItems.select(i, false);
        }
        i -= 1;
      }
      
      if (selected) {
        selected = selected.previousElementSibling;
        while (selected) {
          if (selected.getAttribute('aria-hidden') !== 'true') {
            selected = listItems.select(selected, true);
            break;
          }
          selected = selected.previousElementSibling;
        }
      }
      
      if (!selected) {
        selected = listItems.last();
      }
      
      return selected;
    };
    listItems.reset = function () {
      var i = combobox.listbox.data.length - 1;
      while (i > -1) {
        combobox.listbox.data.item(i).setAttribute('aria-hidden', false);
        combobox.listbox.data.item(i).removeAttribute('aria-selected');
        i -= 1;
      }
    };
    listItems.select = function (n, value) {
      var list = combobox.listbox.data
        node = n && n.nodeName ? n : list.item(n);
        
      if (node) {
        if (value) {
          node.setAttribute('aria-selected', 'true');
          node.scrollIntoView();
        } else {
          node.removeAttribute('aria-selected');
        }
      
        return node;
      }
    };
    
    return listItems;
  };
  combobox.open = function (e) {
    combobox.input.setAttribute('aria-expanded', 'true');
    combobox.listbox.setAttribute('tabindex', 0);
    combobox.listbox.className = [
      combobox.listbox.className,
      'open',
    ].join(' ').trim();
    combobox.filter();
  };
  combobox.selected = function () {
    var i = combobox.listbox.data.length - 1,
      item;
      
    while (i > -1) {
      item = combobox.listbox.data.item(i);
      if (item.getAttribute('aria-selected') === 'true') {
        return { id: item.id, text: item.innerText };
      }
      i -= 1;
    }
  };
  
  combobox.input = combobox.getElementsByTagName('input').item(0);
  if (combobox.input) {
    combobox.input.setValue = function () {
      var item = combobox.selected(),
        input = combobox.input,
        value = input.value;
      if (item.text.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        input.setAttribute('aria-activedescendant', item.id);
        input.value = item.text;
      }
      combobox.close();
    };  
    combobox.input.addEventListener('keydown', onKeyDown);
    combobox.input.addEventListener('input', onInput);
  }
  
  combobox.controller = combobox.getElementsByTagName('button').item(0);
  if (combobox.controller) {
    combobox.controller.addEventListener('click', combobox.open);
    combobox.controller.addEventListener('keydown', onKeyDown);
  }
  
  combobox.listbox = combobox.getElementsByTagName('ol').item(0);
  if (combobox.listbox) {
    combobox.listbox.data = combobox.listbox.getElementsByTagName('li');
    combobox.listbox.addEventListener('blur', combobox.close);
    combobox.listbox.addEventListener('keydown', onKeyDown);
  
    [].slice.call(combobox.listbox.data).forEach(function (i) {
      i.addEventListener('click', select);
    });
  }
});
