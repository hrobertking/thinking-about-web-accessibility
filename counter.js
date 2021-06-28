/* this relies on the input.js function that defines a characterCount and wordCount on input elements */

[].slice.call(document.querySelectorAll('[data-counter]'))
.forEach(function CounterInterface(el) {
  var type = el.getAttribute('data-counter'),
    input = [].slice.call(el.getElementsByTagName('input'))
      .concat([].slice.call(el.getElementsByTagName('textarea')))
      .shift(),
    descriptors = input ? input.getAttribute('aria-describedby').split(' ') : [],
    counter = descriptors
      .filter(function (id) {
        var node = document.getElementById(id),
          live = node ? node.getAttribute('aria-live') : '',
          role = node ? node.getAttribute('role') : '';
        return ['assertive','polite'].includes(live) ||
            ['alert', 'status'].includes(role);
      })
      .map(function (id) {
        return document.getElementById(id);
      })
      .pop(),
    replacer = function (num, msg) {
      counter.innerHTML = msg
        ? msg.replace(/\d+/, num)          
        : counter.innerHTML.replace(/-?\d+/, num);
    },
    defaultMessage,
    len,
    maxLength;
  
  switch (type) {
    case 'character':
      len = function () { return input.characterCount; };
      maxLength = input.maxLength;
      break;
    case 'word':
      len = function () { return input.wordCount; };
      maxLength = el.getAttribute('data-max-words');
      break;
    default:
  }

  if (input) {
    defaultMessage = counter.innerHTML || maxLength + ' ' + type + 's remaining';
    input.addEventListener('input', function(evt) {
      if (len() <= maxLength) {
        replacer(maxLength - len());
      } else {
        throw new Error('Length Error');
      }
    });
    input.addEventListener('focus', function() {
      replacer(maxLength - len(), defaultMessage);
    });
  }
});
