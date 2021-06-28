[].slice.call(document.getElementsByTagName('input'))
.concat([].slice.call(document.getElementsByTagName('textarea')))
.forEach(function TextInput(input) {
  Object.defineProperty(input, 'characterCount', {
    enumerable: true,
    get: function () { return this.value.length; }
  });
  Object.defineProperty(input, 'wordCount', {
    enumerable: true,
    get: function () { return this.value.trim().split(' ').length; }
  });
});
