[].slice.call(document.getElementsByClassName('request'))
.forEach(function RequestButtonInterface(el) {
  var isButton = el.nodeName.toLowerCase() === 'button' ||
      el.type.toLowerCase() === 'button' ||
      el.type.toLowerCase() === 'submit';
      
  if (isButton) {
    var btnStatus = el.nextElementSibling,
      url = el.getAttribute('data-url');

    while (
      btnStatus &&
      !/^(status|alert)$/i.test(btnStatus.getAttribute('role'))
    ) {
      btnStatus = btnStatus.nextElementSibling;
    }

    el.send = function onRequest() {
      if (el.getAttribute('aria-busy') !== 'true') {
        /* you may optionally disable the button here,
           but it's not necessary */
        el.setAttribute('aria-busy', true);
        el.disabled = true;

        /* this is the function to execute when the request is issued */
        fetch(url).then(function onSuccess(response) {
          /* process the response */
          if (btnStatus) {
            btnStatus.innerHTML = el.getAttribute('data-oncomplete');
          }
        }).catch(function onFailure(error) {
          /* process the error */
          if (btnStatus) {
            btnStatus.innerHTML =  el.getAttribute('data-onfail');
          }
        }).finally(function done(status) {
          /* twenty seconds should be sufficient for people
             to read the status */
          var seconds = 20;

          /* turn the 'busy' indicator off */
          el.setAttribute('aria-busy', false);
          
          /* set a timeout so the status message displays for a set
             period of time before disappearing */
          setTimeout(function () {
            el.setAttribute('aria-busy', '');
            el.disabled = false;
          }, seconds * 1000);
        });
      }
    };

    el.addEventListener('click', el.send);
  }
});
