[].slice.call(document.getElementsByClassName('search'))
.forEach(function SearchInterface(el) {
  var button = el.getElementsByClassName('icon').item(0),
    input = el.getElementsByTagName('input').item(0),
    results = el.getElementsByClassName('results').item(0);
  
  el.search = function () {
    var data = input.value,
      url = el.getAttribute('data-url'),
      good = Number(el.getAttribute('data-returned')),
      failed = Number(el.getAttribute('data-failed'));

    fetch(url, { method: 'post', body: data })
      .then(function (response) {
        el.setAttribute('data-returned', good + 1);
        
        /*
         * the results, typically returned in the response _body_,
         * should be placed in the _results_ element
         */
        results.innerHTML = response.status;
      })
      .catch(function (reason) {
        el.setAttribute('data-failed', failed + 1);

        /*
         * the reason the search failed should be communicated,
         * by placing the _reason_ in the _results_ element
         */
        results.innerHTML = reason;
      });
  };
  
  button.addEventListener('click', el.search);
});
