/*
By adding the aria-expanded attribute using JavaScript, there is no risk the component will be stuck in the collapsed state
*/
[].slice.call(document.getElementsByClassName('accordion'))
.forEach(function AccordionInterface(el) {
  var attr = 'aria-expanded',
    btn = document.createElement('button'),
    header = el.getElementsByTagName('header').item(0),
    labels = {
      'false': 'expand',
      'true': 'collapse'
    },
    sibling = header.nextElementSibling,
    onActivate = function activate(e) {
      var activate = !e.key || (e.key && /enter|space| /i.test(e.key)),
        expanded = btn.expanded === 'true';

      if (activate) {
        btn.expanded = String(!expanded);
      }
    };

  Object.defineProperty(btn, 'expanded', {
    enumerable: true,
    get: function () {
      return this.getAttribute(attr);
    },
    set: function (value) {
      this.setAttribute(attr, value);
      this.setAttribute('aria-label', labels[value]);
      sibling && sibling.setAttribute(attr, value);
    }
  });

  header.insertBefore(btn, header.firstChild);
  btn.addEventListener('click', onActivate);
  btn.expanded = 'false';
});
