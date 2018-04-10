function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement; 
      }

      var ul = document.getElementById('carBrandDropdown');
      ul.onclick = function(event) {
      var target = getEventTarget(event);
      target.className += " is-visible";
