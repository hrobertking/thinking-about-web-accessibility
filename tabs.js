[].slice.call(document.getElementsByClassName('tabs'))
.forEach(function TabsInterface(tabs) {
  var activePanel, activeTab, anchors = [],
    list = tabs ? tabs.getElementsByTagName('ol').item(0) : null,
    items = list ? [].slice.call(list.getElementsByTagName('li')) : [];

  function activateTab(anchor) {
    if (anchor) {
      if (activeTab) {
        activeTab.setAttribute('aria-selected', false);
      }
      anchor.setAttribute('aria-selected', true);
      activatePanel(anchor);
      activeTab = anchor;
    }
  }
  function activatePanel(anchor) {
    var href = anchor ? anchor.getAttribute('href') : '',
      panel = document.getElementById(href.substr(1));

    if (panel) {
      if (activePanel) {
        activePanel.setAttribute('aria-hidden', true);
      }
      panel.setAttribute('aria-hidden', false);
      activePanel = panel;
    }
  }

  function first() {
    move(items[0]);
  }

  function last() {
    move(items[items.length - 1]);
  }

  function move(item) {
    var anchor = item.getElementsByTagName('a').item(0);
    if (anchor) {
      anchor.focus();
    }
  }

  function next(anchor) {
    var index = Number(anchor.getAttribute('data-index')) + 1;
    if (index > items.length - 1) {
      index = 0;
    }
    move(items[index]);
  }

  function prev(anchor) {
    var index = Number(anchor.getAttribute('data-index')) - 1;
    if (index < 0) {
      index = items.length - 1;
    }
    move(items[index]);
  }
  function onClick(e) {
    activateTab(e.target);
  }

  function onKeyDown(e) {
    var key = (e.key || e.keyCode).toString();
    switch (key) {
      case 'ArrowDown':  case '40':
      case 'ArrowRight': case '39':
        return next(e.target);
      case 'ArrowLeft':  case '37':
      case 'ArrowUp':    case '38':
        return prev(e.target);
      case 'End':        case '35':
        return last();
      case 'Home':       case '36':
        return first();
      default:
    }
  }

  items.forEach(function initTab(li, c) {
    var a = li.getElementsByTagName('a').item(0);
    if (a) {
      a.setAttribute('data-index', c);
      a.addEventListener('click', onClick);
      a.addEventListener('keydown', onKeyDown);

      if (a.getAttribute('aria-selected') === 'true') {
        activateTab(a);
      }
    }
  });
});
