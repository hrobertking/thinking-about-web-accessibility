[].slice.call(document.getElementsByClassName('tree'))
.forEach(function TreeInterface(tree) {
  var treeItems = [].slice.call(tree.getElementsByTagName('li'))
      .filter(function (li) {
        return li.getAttribute('role') === 'treeitem';
      }),
    actions = {
      close: function (e) {
        // closes the treeitem but does not move
        var item = e.target;

        if (item) {
          item.open = false;
        }
        return item;
      },
      end: function (e) {
        // moves to the last treeitem without opening or closing
        var item = treeItems[treeItems.length - 1];

        if (item) {
          item.focus();
        }
        return item;
      },
      home: function (e) {
        // moves to the first treeitem without opening or closing
        var item = treeItems[0];

        if (item) {
          item.focus();
        }
        return item;
      },
      moveChild: function (e) {
        // move to first child
        var group = e.target.group,
          item = group && group.items.shift();

        if (item) {
          item.focus();
        }
        return item;
      },
      moveParent: function (e) {
        // moves to the parent treeitem
        var target = e.target,
          item = target.parent;

        if (item) {
          item.focus();
        }
        return item;
      },
      next: function (e) {
        // move to next focusable treeitem without opening or closing
        var item = e.target;

        while (item && !item.next) {
          item = item.parent;
        }

        item = item && item.next;
        item.focus();
        return item;
      },
      open: function (e) {
        // opens the treeitem but does not move
        var item = e.target;

        if (item) {
          item.open = true;
        }
        return item;
      },
      openSiblings: function (e) {
        // opens all closed siblings
        var siblings = e.target.siblings || [];

        siblings.filter(function (item) {
            return !item.open;
          }).forEach(function (item) {
            item.open = true;
          });
      },
      previous: function (e) {
        // move to previous focusable treeitem without opening or closing
        var item = e.target;

        while (item && !item.previous) {
          item = item.parent.group.items.pop();
        }

        item = item && item.previous;
        item.focus();
        return item;
      },
      select: function (e) {
        // update item selected
        var item = e.target;

        if (item) {
          item.selected = true;
        }
        return item;
      }
    },
    keys = {
      '*': actions.openSiblings,
      'ArrowDown': actions.next,
      'ArrowLeft': function (e) {
        var target = e.target;

        if (target.open) {
          actions.close(e);
        } else {
          actions.moveParent(e);
        }
      },
      'ArrowRight': function (e) {
        var target = e.target;

        if (!target.open) {
          actions.open(e);
        } else {
          actions.moveChild(e);
        }
      },
      'ArrowUp': actions.previous,
      'End': actions.end,
      'Enter': actions.select,
      'Home': actions.home,
      ' ': actions.select
    },
    onblur = function (e) {
      e.target.setAttribute('tabindex', -1);

      if (!tree.contains(e.relatedTarget)) {
        treeItems[0].setAttribute('tabindex', 0);
      }
    },
    onclick = function (e) {
      var item = e.target;

      e.stopPropagation();
      while (item &&
        item.getAttribute &&
        item.getAttribute('role') !== 'treeitem') {
        item = item.parentNode;
      }

      if (item.getAttribute('role') === 'treeitem') {
        item.open = !item.open;
      }
    },
    onfocus = function (e) {
      e.target.setAttribute('tabindex', 0);
    },
    onkeydown = function (e) {
      var handler = keys[e.key];

      if (handler) {
        e.stopPropagation();
        return handler(e);
      } else if (e.key.length === 1) {
        e.stopPropagation();
        return tree.search(e.key);
      }
    };

  treeItems.forEach(function (li, c) {
    Object.defineProperty(li, 'group', {
      enumerable: true,
      get: function () {
        return [].slice.call(this.getElementsByTagName('ul'))
          .filter(function (ul) {
            return [].slice.call(ul.getElementsByTagName('li'))
                .some(function (li) {
                  return li.getAttribute('role') === 'treeitem';
                });
          }).shift();
      }
    });
    Object.defineProperty(li, 'name', {
      enumerable: true,
      get: function () {
        return this.firstElementChild.innerText;
      }
    });
    Object.defineProperty(li, 'next', {
      enumerable: true,
      get: function () {
        var item = !this.open || !this.group ?
          this.nextElementSibling || this.parent.nextElementSibling :
          this.group.items[0];

        while (item &&
          item.getAttribute &&
          item.getAttribute('role') !== 'treeitem') {
          item = item.nextElementSibling;
        }
        return item;
      }
    });
    Object.defineProperty(li, 'open', {
      enumerable: true,
      get: function () {
        return this.getAttribute('aria-expanded') === 'true';
      },
      set: function (value) {
        this.setAttribute('aria-expanded', Boolean(JSON.parse(value)));
      }
    });
    Object.defineProperty(li, 'parent', {
      enumerable: true,
      get: function () {
        var item = this.parentNode;

        while (item &&
          item.getAttribute &&
          item.getAttribute('role') !== 'treeitem') {
          item = item.parentNode;
        }
        return item;
      }
    });
    Object.defineProperty(li, 'previous', {
      enumerable: true,
      get: function () {
        var item = this.previousElementSibling || this.parent;

        while (item &&
          item.getAttribute &&
          item.getAttribute('role') !== 'treeitem') {
          item = item.previousElementSibling || item.parent;
        }
        return item;
      }
    });
    Object.defineProperty(li, 'selected', {
      enumerable: true,
      get: function () {
        return this.getAttribute('aria-selected') === 'true';
      },
      set: function (value) {
        this.setAttribute('aria-selected', Boolean(JSON.parse(value)));
        this.open = true;
      }
    });
    Object.defineProperty(li, 'siblings', {
      enumerable: true,
      get: function () {
        return this.parentNode.getElementsByTagName('li');
      }
    });

    [].slice.call(li.getElementsByTagName('ul'))
    .filter(function (ul) {
      if (!ul.hasOwnProperty('items')) {
        Object.defineProperty(ul, 'items', {
          enumerable: true,
          get: function () {
            return [].slice.call(ul.getElementsByTagName('li'))
              .filter(function (li) {
                return li.getAttribute('role') === 'treeitem';
              });
          }
        });
      }
    });

    li.setAttribute('aria-expanded', false);
    li.setAttribute('tabindex', c ? -1 : 0);
    li.addEventListener('blur', onblur);
    li.addEventListener('click', onclick);
    li.addEventListener('focus', onfocus);
    li.addEventListener('keydown', onkeydown);
  });

  Object.defineProperty(tree, 'selected', {
    enumerable: true,
    get: function () {
      return treeitems.filter(function (item) {
        return item.selected;
      });
    }
  });
  Object.defineProperty(tree, 'selectedIndex', {
    enumerable: true,
    get: function () {
      return treeitems.findIndex(function (item) {
        return item.selected;
      });
    }
  });
  Object.defineProperty(tree, 'search', {
    enumerable: true,
    value: function (key) {
      var from = treeitems.findIndex(function (item) {
          return item.getAttribute('tabindex') === 0;
        }),
        match = items.slice(from)
          .find(function (item) {
            return item.name.substr(0, 1) === key;
          });

      if (match) {
        match.focus();
      }
      return match;
    }
  });
});
