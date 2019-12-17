[].slice.call(document.getElementsByClassName('tabs-widget'))
.forEach(function TabsWidgetInterface(widget) {
  var SELF = this,
    onkeydown = function keydown(e) {
      var key = (e.key || e.keyCode).toString();

      switch (key) {
        case 'ArrowDown':  case '40':
        case 'ArrowRight': case '39':
          return SELF.tabs.next();
        case 'ArrowLeft':  case '37':
        case 'ArrowUp':    case '38':
          return SELF.tabs.previous();
        case 'End':        case '35':
          return SELF.tabs.last();
        case 'Home':       case '36':
          return SELF.tabs.first();
        default:
      }
    },
    list = widget.querySelector('[role="tablist"]'),
    panels = [].slice.call(widget.querySelectorAll('[role="tabpanel"]')),
    tabs = [].slice.call(list.querySelectorAll('[role="tab"]')),
    onblur = function (e) {
      var target = e.target,
        blurTo = e.relatedTarget,
        role = target && target.getAttribute ?
          target.getAttribute('role') :
          '';

      if (role === 'tab' && list.contains(blurTo)) {
        e.target.setAttribute('tabindex', -1);
      }
    }
    onclick = function (e) {
      var target = e.target,
        role = target && target.getAttribute ?
          target.getAttribute('role') :
          '';

      if (role === 'tab') {
        list.select(target.id);
      }
    },
    onfocus = function (e) {
      var target = e.target,
        role = target && target.getAttribute ?
          target.getAttribute('role') :
          '';

      if (role === 'tab') {
        e.target.setAttribute('tabindex', 0);
      }
    },
    onkeydown = function (e) {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          return list.next();
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          return list.previous();
        case 'End':
          e.preventDefault();
          return list.last();
        case 'Home':
          e.preventDefault();
          return list.first();
        case 'Enter':
        case ' ':
          e.preventDefault();
          return list.select();
      }
    };

  Object.defineProperty(list, 'first', {
    enumerable: true,
    value: function () {
      tabs[0].focus();
      return list;
    }
  });
  Object.defineProperty(list, 'last', {
    enumerable: true,
    value: function () {
      tabs[tabs.length - 1].focus();
      return list;
    }
  });
  Object.defineProperty(list, 'next', {
    enumerable: true,
    value: function () {
      var next = list.selectedIndex + 1;

      next = next > tabs.length - 1 ? 0 : next;
      tabs[next].focus();
      return list;
    }
  });
  Object.defineProperty(list, 'previous', {
    enumerable: true,
    value: function () {
      var next = list.selectedIndex - 1;

      next = next < 0 ? tabs.length - 1: next;
      tabs[next].focus();
      return list;
    }
  });
  Object.defineProperty(list, 'select', {
    enumerable: true,
    value: function (id) {
      var item = typeof id !== 'undefined' ?
          id :
          tabs[list.selectedIndex].id,
        num = Number(item);

      if (!Number.isNaN(num)) {
        item = (tabs[num] || {}).id;
      }

      tabs.forEach(function (tab) {
        tab.selected = tab.id === item;
      });
      panels.forEach(function (panel) {
        panel.shown = panel.controller.id === item;
      });
    }
  });
  Object.defineProperty(list, 'selectedIndex', {
    enumerable: true,
    get: function () {
      return tabs.findIndex(function (tab) {
        return tab.focused;
      });
    },
    set: function (value) {
      var val = Number(value),
        last = tabs.length - 1;

      if (!Number.isNaN(val)) {
        val = val < 0 ? last : val;
        val = val > last ? 0 : val;
        val = tabs[val].id;
        list.select(val);
      }
    }
  });

  panels.forEach(function (tabpanel, i) {
    var d = new Date().getTime(),
      name = widget.id || 'tabs-widget-' + d,
      panel = tabpanel,
      controller;

    panel.id = panel.id || name + '-panel' + i;
    controller = tabs.find(function (tab) {
        return tab.getAttribute('aria-controls') === panel.id ||
          panel.getAttribute('aria-labelledby').indexOf(tab.id) > -1;
      }) || tabs[i] || document.createElement('button');
    controller.id = controller.id || name + '-tab' + i;

    controller.setAttribute('aria-controls', panel.id);
    panel.setAttribute('aria-labelledby', controller.id);

    Object.defineProperty(controller, 'focused', {
      enumerable: true,
      get: function () {
        return this.getAttribute('tabindex') === '0';
      }
    });
    Object.defineProperty(controller, 'panel', {
      enumerable: true,
      get: function () {
        return panel;
      }
    });
    Object.defineProperty(controller, 'selected', {
      enumerable: true,
      get: function () {
        return this.getAttribute('aria-selected') === 'true';
      },
      set: function (value) {
        var val = Boolean(JSON.parse(value));
        this.setAttribute('aria-selected', val);
      }
    });
    Object.defineProperty(panel, 'controller', {
      enumerable: true,
      get: function () {
        return controller;
      }
    });
    Object.defineProperty(panel, 'shown', {
      enumerable: true,
      get: function () {
        return this.getAttribute('tabindex') === '0';
      },
      set: function (value) {
        var val = Boolean(JSON.parse(value));
        this.setAttribute('tabindex', val ? 0 : -1);
      }
    });

    controller.addEventListener('blur', onblur);
    controller.addEventListener('click', onclick);
    controller.addEventListener('focus', onfocus);
    controller.addEventListener('keydown', onkeydown);
  });

  if (list.selectedIndex < 0) {
    list.selectedIndex = 0;
  }
});
