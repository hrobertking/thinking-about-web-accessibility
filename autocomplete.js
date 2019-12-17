[].slice.call(document.getElementsByClassName('autocomplete'))
.forEach(function AutocompleteInterface(autocomplete) {
  var activeIndex = 0,
    status = autocomplete.getElementsByClassName('listlength').item(0),
    match = function match(el, value) {
      var text = el.innerText.toLowerCase();
      return el.innerText
        .toLowerCase()
        .indexOf(value.toLowerCase()) === 0;
    },
    onInput = function onInput() {
      if (!autocomplete.isOpen()) {
        autocomplete.open();
      }
      autocomplete.filter();
    },
    onKeyDown = function onKeyDown(e) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (autocomplete.isOpen()) {
            autocomplete.items().next();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (autocomplete.isOpen()) {
            autocomplete.items().previous();
          }
          break;
        case 'Backspace':
        case 'Delete':
          onInput();
          break;
        case 'Enter':
          autocomplete.input.setValue();
          break;
        case 'Escape':
          e.preventDefault();
          autocomplete.close();
          autocomplete.input.value = '';
        default:
      }
    },
    select = function select(e) {
      var target = e.target;
      if (target) {
        autocomplete.items().reset();
        target.setAttribute('aria-selected', 'true');
        autocomplete.input.setValue();
      }
    };

  autocomplete.close = function open(e) {
    autocomplete.combobox.setAttribute('aria-expanded', 'false');
    autocomplete.listbox.setAttribute('tabindex', -1)
  };

  autocomplete.filter = function filter() {
    var value = autocomplete.input.value,
      items = [].slice.call(autocomplete.listbox.data),
      active;
      
    autocomplete.items().reset();
    items.forEach(function filterList(item) {
      if (item.innerText) {
        item.setAttribute('aria-hidden', !match(item, value));
      }
    });
    
    active = items.filter(function active(el) {
      return el.getAttribute('aria-hidden') !== 'true';
    });
    
    if (active.length === 1) {
      autocomplete.items().select(active[0], true);
    }

    autocomplete.setAttribute('data-count', active.length);
    status.innerHTML = active.length;
  };
  autocomplete.isOpen = function isOpen() {
    return autocomplete.combobox.getAttribute('aria-expanded') === 'true';
  };
  autocomplete.items = function items() {
    var value = autocomplete.input.value,
      lis = [].slice.call(autocomplete.listbox.data),
      listItems = lis.map(function unselect(li) {
          if (li) {
            li.setAttribute('aria-hidden', !match(li, value));
          }
          return li;
        }).filter(function filteredItems(li) {
          return li && li.getAttribute('aria-hidden') !== 'true';
        });
        
    listItems.first = function first() {
      var list = autocomplete.listbox.data,
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
    listItems.last = function last() {
      var list = autocomplete.listbox.data,
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
    listItems.next = function next() {
      var list = autocomplete.listbox.data,
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

    listItems.previous = function prev() {
      var list = autocomplete.listbox.data,
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
    listItems.reset = function reset() {
      var i = autocomplete.listbox.data.length - 1;
      while (i > -1) {
        autocomplete.listbox.data.item(i).setAttribute(
          'aria-hidden',
          false
        );
        autocomplete.listbox.data.item(i).removeAttribute(
          'aria-selected'
        );
        i -= 1;
      }
    };
    listItems.select = function select(n, value) {
      var list = autocomplete.listbox.data
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
  autocomplete.open = function open(e) {
    autocomplete.combobox.setAttribute('aria-expanded', 'true');
    autocomplete.listbox.setAttribute('tabindex', 0);
    autocomplete.filter();
  };
  autocomplete.selected = function selected() {
    var i = autocomplete.listbox.data.length - 1,
      item;
      
    while (i > -1) {
      item = autocomplete.listbox.data.item(i);
      if (item.getAttribute('aria-selected') === 'true') {
        return { id: item.id, text: item.innerText };
      }
      i -= 1;
    }
  };
  
  autocomplete.input = autocomplete.getElementsByTagName('input').item(0);
  if (autocomplete.input) {
    autocomplete.input.setValue = function setValue() {
      var item = autocomplete.selected(),
        input = autocomplete.input,
        value = input.value;
      if (item.text.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        input.setAttribute('aria-activedescendant', item.id);
        input.value = item.text;
      }
      autocomplete.close();
    };  
    autocomplete.input.addEventListener('keydown', onKeyDown);
    autocomplete.input.addEventListener('input', onInput);
  }
  
  autocomplete.combobox = autocomplete.input.parentNode;
  
  autocomplete.listbox = autocomplete.getElementsByTagName('ol').item(0);
  if (autocomplete.listbox) {
    autocomplete.listbox.data =
      autocomplete.listbox.getElementsByTagName('li');
    autocomplete.listbox.addEventListener('blur', autocomplete.close);
    autocomplete.listbox.addEventListener('keydown', onKeyDown);
  
    [].slice.call(autocomplete.listbox.data).forEach(function f(i) {
      i.addEventListener('click', select);
    });
  }
});
