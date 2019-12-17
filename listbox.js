function ListboxInterface(ddlb) {
  var activeIndex = 0,
    evtChange = new CustomEvent('change', { detail: ddlb }),
    defaultSelected = [].slice.call(ddlb.querySelectorAll('[role="option"]'))
      .find(function (opt) {
        return opt.getAttribute('aria-selected') === 'true';
      }),
    isDisabled = false;

  function activate(index) {
    var c = ddlb.options.length - 1,
      node = ddlb.options.item(index);

    activeIndex = index;
    while (c > -1) {
      ddlb.options.item(c).setAttribute('aria-current', false);
      c -= 1;
    }

    if (node) {
      node.setAttribute('aria-current', true);
      ddlb.active = node.id;
    }
    return node;
  }
  function bool(value) {
    switch (typeof value) {
      case 'boolean':
        return value;
      case 'bigint':
      case 'number':
        return !!value;
      case 'function':
      case 'symbol':
        return true;
      case 'object':
        return !!Object.keys(value || {}).length;
      case 'string':
        return Boolean(
          JSON.parse(
            value.split(/\W/).reduce(function (t, v) {
              if (/^(false|no|n|off)$/i.test(v)) {
                t = 'false';
              }
              return t;
            }, 'true')
          )
        );
      case 'undefined':
        return false;
    }
    return false;
  }
  function close() {
    ddlb.expanded = false;
  }
  function first() {
    return activate(0);
  }
  function last() {
    return activate(ddlb.options.length - 1);
  }
  function next() {
    return activate(activeIndex + 1);
  }
  function open() {
    ddlb.expanded = true;
  }
  function previous() {
    return activate(activeIndex - 1);
  }
  function select(node) {
    var c = ddlb.options.length - 1
      el = node || ddlb.options.item(activeIndex),
      selected = bool(el.getAttribute('aria-selected'));

    if (!ddlb.multiple) {
      while (c > -1) {
        ddlb.options.item(c).removeAttribute('aria-selected');
        c -= 1;
      }
    }
    el.setAttribute('aria-selected', !selected);
    if (ddlb.selectedIndex > -1) {
      ddlb.setAttribute('data-selectedIndex', ddlb.selectedIndex);
    } else {
      ddlb.removeAttribute('data-selectedIndex');
    }
    !ddlb.multiple && close();
    ddlb.dispatchEvent(evtChange);
  }

  Object.defineProperty(ddlb, 'active', {
    enumerable: true,
    get: function () {
      return this.getAttribute('aria-activedescendant');
    },
    set: function (value) {
      if (document.getElementById(value)) {
        this.setAttribute('aria-activedescendant', value);
      }
    }
  });
  Object.defineProperty(ddlb, 'add', {
    enumerable: true,
    value: function (option, index) {
      this.options.add(option, index);
    }
  });
  Object.defineProperty(ddlb, 'autofocus', {
    enumerable: true,
    get: function () {
      return;
    },
    set: function () {
      return;
    }
  });
  Object.defineProperty(ddlb, 'disabled', {
    enumerable: true,
    get: function () {
      return;
    },
    set: function () {
      return;
    }
  });
  Object.defineProperty(ddlb, 'expanded', {
    enumerable: true,
    get: function () {
      return bool(this.getAttribute('aria-expanded'));
    },
    set: function (value) {
      this.setAttribute('aria-expanded', bool(value));
    }
  });
  Object.defineProperty(ddlb, 'form', {
    enumerable: true,
    get: function () {
      return;
    }
  });
  Object.defineProperty(ddlb, 'length', {
    enumerable: true,
    get: function () {
      return this.options.length;
    }
  });
  Object.defineProperty(ddlb, 'multiple', {
    enumerable: true,
    get: function () {
      return bool(this.getAttribute('aria-multiselectable'));
    },
    set: function (value) {
      var b = bool(value);

      if (b) {
        this.setAttribute('aria-multiselectable', true);
      } else {
        this.removeAttribute('aria-multiselectable');
      }
    }
  });
  Object.defineProperty(ddlb, 'name', {
    enumerable: true,
    get: function () {
      return this.getAttribute('name');
    },
    set: function (value) {
      if (typeof value === 'string') {
        this.setAttribute('name', value);
      }
    }
  });
  Object.defineProperty(ddlb, 'options', {
    enumerable: true,
    get: function () {
      var opts = this.querySelectorAll('[role="option"]'),
        items = [].slice.call(opts);

      items.forEach(function (opt, idx) {
        if (!opt.hasOwnProperty('defaultSelected')) {
          Object.defineProperty(opt, 'defaultSelected', {
            enumerable: true,
            value: defaultSelected ?
              opt.id === defaultSelected.id :
              undefined
          });
        }
        if (!opt.hasOwnProperty('disabled')) {
          Object.defineProperty(opt, 'disabled', {
            enumerable: true,
            get: function () {
              return bool(this.getAttribute('aria-disabled'));
            },
            set: function (value) {
              this.setAttribute('aria-disabled', !!value);
            }
          });
        }
        if (!opt.hasOwnProperty('form')) {
          Object.defineProperty(opt, 'form', {
            enumerable: true,
            get: function () {
              return;
            }
          });
        }
        if (!opt.hasOwnProperty('html')) {
          Object.defineProperty(opt, 'html', {
            enumerable: true,
            get: function () {
              return this.innerHTML;
            },
            set: function (value) {
              this.innerHTML = value;
            }
          });
        }
        if (!opt.hasOwnProperty('index')) {
          Object.defineProperty(opt, 'index', {
            enumerable: true,
            value: idx
          });
        }
        if (!opt.hasOwnProperty('label')) {
          Object.defineProperty(opt, 'label', {
            enumerable: true,
            get: function () {
              return this.text;
            },
            set: function (value) {
              this.text = value;
            }
          });
        }
        if (!opt.hasOwnProperty('selected')) {
          Object.defineProperty(opt, 'selected', {
            enumerable: true,
            get: function () {
              return bool(this.getAttribute('aria-selected'));
            },
            set: function (value) {
              this.setAttribute('aria-selected', !!value);
            }
          });
        }
        if (!opt.hasOwnProperty('text')) {
          Object.defineProperty(opt, 'text', {
            enumerable: true,
            get: function () {
              return this.innerText;
            },
            set: function (value) {
              this.innerHTML = value;
            }
          });
        }
        if (!opt.hasOwnProperty('value')) {
          Object.defineProperty(opt, 'value', {
            enumerable: true,
            get: function () {
              return this.getAttribute('value');
            },
            set: function (arg) {
              this.setAttribute('value', arg);
            }
          });
        }
      });

      if (!opts.hasOwnProperty('add')) {
        Object.defineProperty(opts, 'add', {
          enumerable: true,
          value: function (option, index) {
            var reference = this.item(index);

            if (/^li$/i.test(option.nodeName)) {
              option.setAttribute('role', 'option');
              this.insertBefore(option, reference);
            }
          }
        });
      }
      if (!opts.hasOwnProperty('namedItem')) {
        Object.defineProperty(opts, 'namedItem', {
          enumerable: true,
          value: function (id) {
            return this.querySelector('[id="' + id + '"]');
          }
        });
      }
      if (!opts.hasOwnProperty('selectedIndex')) {
        Object.defineProperty(opts, 'selectedIndex', {
          enumerable: true,
          get: function () {
            var b = false,
              n = this.length - 1;

            while (!b && n > -1) {
              b = this.item(n).getAttribute('aria-selected') === 'true';
              n -= b ? 0 : 1;
            }
            return n;
          },
          set: function (value) {
            select(this.item(Number(value)));
          }
        });
      }
      if (!opts.hasOwnProperty('remove')) {
        Object.defineProperty(opts, 'remove', {
          enumerable: true,
          value: function (index) {
            var reference = /^(number|string)$/.test(typeof index) ?
                this.item(Number(index)) :
                index;

            if (reference) {
              this.removeChild(reference);
            }
          }
        });
      }
      return opts;
    }
  });
  Object.defineProperty(ddlb, 'remove', {
    enumerable: true,
    value: function (index) {
      this.options.remove(index);
    }
  });
  Object.defineProperty(ddlb, 'selectedIndex', {
    enumerable: true,
    get: function () {
      return this.options.selectedIndex;
    },
    set: function (value) {
      this.options.selectedIndex = Number(value);
    }
  });
  Object.defineProperty(ddlb, 'selectedOptions', {
    enumerable: true,
    get: function () {
      var qs = '[role="option"][aria-selected="true"]';
      return this.querySelectorAll(qs);
    }
  });
  Object.defineProperty(ddlb, 'size', {
    enumerable: true,
    get: function () {
      return;
    },
    set: function () {
      return;
    }
  });
  Object.defineProperty(ddlb, 'type', {
    enumerable: true,
    get: function () {
      return 'listbox-' + (this.multiple ? 'multiple' : 'one');
    }
  });
  Object.defineProperty(ddlb, 'value', {
    enumerable: true,
    get: function () {
      var selected = [].slice.call(this.selectedOptions);

      if (selected) {
        return selected[0].value;
      }
    },
    set: function (arg) {
      var c = 0,
        opts = [].slice.call(this.options),
        reference = opts.find(function (opt) {
          opt.value === arg;
        });

      if (reference) {
        select(reference);
      }
    }
  });

  ddlb.addEventListener('blur', function (e) {
    e.target.expanded = false;
  });
  ddlb.addEventListener('click', function (e) {
    var opt = e.target,
      role = /^option$/i;

    if (ddlb.expanded) {
      while (opt && !role.test(opt.getAttribute('role'))) {
        opt = opt.parentNode;
      }

      if (role.test(opt.getAttribute('role'))) {
        select(opt);
      }
    } else {
      open();
    }
  });
  ddlb.addEventListener('focus', function (e) {
    e.target.expanded = true;
  });
  ddlb.addEventListener('keydown', function (e) {
    if (ddlb.expanded) {
      switch (e.key) {
        case 'ArrowDown':
          return next() || first();
        case 'ArrowLeft':
          return previous() || last();
        case 'ArrowRight':
          return next() || first();
        case 'ArrowUp':
          return previous() || last();
        case 'End':
          return last();
        case 'Enter':
        case ' ':
          return select();
        case 'Escape':
          return close();
        case 'Home':
          return first();
      }
    } else {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'End':
        case 'Enter':
          return open();
      }
    }
  });
  ddlb.setAttribute('tabindex', 0);

  first();
}

[].slice.call(document.getElementsByTagName('*'))
.filter(function (el) {
  return /^listbox$/i.test(el.getAttribute('role'));
})
.forEach(function (listbox) {
  return ListboxInterface(listbox);
});
