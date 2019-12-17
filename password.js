[].slice.call(document.getElementsByClassName('password'))
.forEach(function PasswordInterface(field) {
  var button = document.createElement('button'),
    input = field.getElementsByTagName('input').item(0),
    labels = {
      password: {
        label: 'show',
        type: 'text'
      },
      text: {
        label: 'hide',
        type: 'password'
      }
    },
    listId = input.getAttribute('aria-describedby'),
    list = document.querySelectorAll('[id="' + listId + '"] > li'),
    itemStatus = function (item) {
      var pattern = item.getAttribute('data-pattern'),
        regex = new RegExp(pattern);

      if (pattern) {
        item.className = [
          item.className.replace(/(^| )completed( |$)/, ''),
          regex.test(input.value) ? 'completed' : ''
         ].join(' ').trim();
      }
    },
    valid = input.getAttribute('aria-invalid') || '';
  
  input.addEventListener('blur', function () {
    var invalid = input.value ?
      [].slice.call(list).some(function (item) {
        return !/\bcompleted\b/.test(item.className);
      }) :
      '';

    input.setAttribute('aria-invalid', invalid);
  })
  input.addEventListener('focus', function () {
    input.setAttribute('aria-invalid', '');
  })
  input.addEventListener('input', function () {
    [].slice.call(list).forEach(itemStatus);
  });
  input.setAttribute('aria-invalid', valid);

  button.innerHTML = '👁';
  button.setAttribute('aria-label', labels[input.type].label);
  button.addEventListener('click', function() {
    input.type = labels[input.type].type;
    button.setAttribute('aria-label', labels[input.type].label);
  });
 
  field.appendChild(button);
});
