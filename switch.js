/*
Although JavaScript is not necessary for this design to work as expected, the example script will enhance the accessibility features for the Toggle by updating the described state using the existing position labels and switching the aria-describedby attribute to the base id plus the checked status of the input. As noted earlier, this script requires the input label to use the naming convention that specifies an input identifier followed by -label and the labeling element for the "off" or "false" position to be identified by the input identifer followed by -false and the labeling element for the "on" or "true" position to be identified by the input identifier followed by -true. For example, the "Push Notifications" element uses "mytoggle" as the input identifer, as do the "Off" and "On" labels with mytoggle-false and mytoggle-true, respectively.
*/

[].slice.call(document.getElementsByClassName('switch'))
.forEach(function SwitchInterface(toggle) {
  var onChange = function onChange(e) {
      var target = e.target,
        checked = target.checked,
        label = target.getAttribute('aria-labelledby') || '',
        description = label.replace(/-label$/, '-' + checked);

      if (description && document.getElementById(description)) {
        target.setAttribute('aria-describedby', description);
      }
    };

  [].slice.call(toggle.getElementsByTagName('input'))
  .forEach(function handle(input) {
    if (input.type === 'checkbox') {
      input.addEventListener('change', onChange);
    }
  });
});
