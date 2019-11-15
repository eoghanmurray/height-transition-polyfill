// start max-height -> height polyfill
(function() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode("[height-locked] { height: 0 !important;}"));
  document.head.appendChild(style);

  function test_direction(el, starting_maxh) {
    var self = function() {
      var cs = getComputedStyle(el);
      if (cs['maxHeight'] == starting_maxh) {
        requestAnimationFrame(self);
      } else {
        var tr = cs['transition'];
        if (parseFloat(cs['maxHeight']) < parseFloat(starting_maxh)) {
          // shrinking
          if (el.style.height == '') {
            el.style.height = cs['height'];
            void el.offsetWidth; // needed for transition to 'take'
          }
          el.setAttribute('height-locked', true);
        } else {
          // growing
          el.setAttribute('height-locked', true);
          el.style.height = el.scrollHeight + 'px';
          void el.offsetWidth; // transition happens now between zero (height-locked) to style.height
          el.removeAttribute('height-locked');
        }
      }
    }
    // need requestAnimationFrame to detect the direction of the max-height transition
    requestAnimationFrame(self);
  }

  document.addEventListener('transitionstart', function(e) {
    if (e.propertyName == 'max-height') {
      var el = e.target;
      if (el.hasAttribute('height-locked')) {
        el.removeAttribute('height-locked');
      } else {
        var cs = getComputedStyle(el);
        var tr = cs['transition'];
        var add_h_transition = tr.match(/max-(height[^,]+)/)[1];
        if (el.style.transition.indexOf(add_h_transition) === -1) {
          el.style.transition = tr + ', ' + add_h_transition;
        }
        test_direction(el, cs['maxHeight']);
      }
    }
  });

  document.addEventListener('transitionend', function(e) {
    if (e.propertyName == 'height') {
      var el = e.target;
      var cs = getComputedStyle(el);
      if (cs['height'] == el.style.height) {
        el.style.height = '';
        el.style.transition = '';
      }
    }
  });
}());
