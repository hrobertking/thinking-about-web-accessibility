[].slice.call(document.getElementsByClassName('meter'))
.forEach(function MeterInterface(meter) {
  var segments = meter.getElementsByTagName('li'),
    i = segments.length - 1;

  /* calculate the left position of the current value within the range */
  function configSegment(li) {
    if (!li) { return; }

    var min = li.getAttribute('data-min'),
      max = li.getAttribute('data-max'),
      node = li.getElementsByTagName('*').item(0),
      value = node ? node.innerText : '',
      range, offset;

    if (min && max && value) {
      range = Number(max) - Number(min);
      offset = range ?
        ((Number(value) - Number(min)) / range) *
          node.parentNode.offsetWidth :
        0;
      offset += node.offsetLeft;
      node.style.left = `${offset}px`;
    }
  }

  while (i > -1) {
    configSegment(segments.item(i));
    i -= 1;
  }
});
