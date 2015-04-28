(function() {

  var $placeholder = angular.element([
    '<div class="widget-placeholder">',
    '</div>'
  ].join(''));

  // Hitzones are positioned to the left and right of widgets
  // We call check to see if the current drag location is next to a widget
  // If so we move the placeholder.
  var hitZones = {
    size: 10,
    check: function(e) {
      var i, draggables, draggable, rect;
      draggables = document.querySelectorAll('[draggable-widget]');
      for (i = 0; i < draggables.length; i++) {
        draggable = draggables[i];
        rect = draggable.getBoundingClientRect();
        if (hitZones.checkBefore(rect, e.pageX, e.pageY)) {
          placeholder.insertBefore(draggable);
        } else if (hitZones.checkAfter(rect, e.pageX, e.pageY)) {
          placeholder.insertAfter(draggable);
        }
      }
    },
    checkBefore: function(rect, x, y) {
      return ((y > rect.top) &&
              (y < rect.bottom) &&
              (x > rect.left - hitZones.size) &&
              (x < rect.left + hitZones.size));
    },
    checkAfter: function(rect, x, y) {
      return ((y > rect.top) &&
              (y < rect.bottom) &&
              (x > rect.right - hitZones.size) &&
              (x < rect.right + hitZones.size));
    }
  };

  // The placeholder object is a little rectangle with the same dimensions as the dragged widget
  // It gives the user a preview of page layout.
  // We can show or hide it, and insert it before or after another widget.
  var placeholder = {
    show: function(el) {
      $placeholder[0].hidden = false;
      $placeholder.css({
        width: el[0].clientWidth +'px',
        height: el[0].clientHeight +'px'
      });
      el.after($placeholder);
    },
    hide: function() {
      $placeholder[0].hidden = true;
    },
    insertAfter: function(el) {
      angular.element(el).after($placeholder);
    },
    insertBefore: function(el) {
      angular.element(el).parent()[0].insertBefore(el, $placeholder[0]);
    }
  };

  // controller for the drag directive.
  // initialises the drag
  var dragController = function($scope) {
    var drag = $scope.drag = {};
    drag.start = function(e) {
      console.log('start drag');
      drag.initDrag(e);
    };
    drag.end = function(e) {
      drag.destroyDrag();
    };
  };

  // link for the drag directive.
  // Makes the DOM changes needed when a drag event occurs
  var dragLink = function(scope, el, attrs) {
    var setPosition = function(e) {
      el.css({
        left: e.pageX - scope.drag.offsetX - 20 + 'px',
        top: e.pageY - scope.drag.offsetY - 20 + 'px'
      });
    };

    scope.drag.initDrag = function(e) {
      console.log('start drag');
      scope.drag.offsetX = e.offsetX;
      scope.drag.offsetY = e.offsetY;
      setPosition(e);
      el.addClass('dragging');
      el.css({
        position:'absolute',
        'z-index':100000
      });
      placeholder.show(el);
      angular.element(window).on('mousemove', function(e) {
        setPosition(e);
        hitZones.check(e);
      });
    };

    scope.drag.destroyDrag = function() {
      console.log('stop drag');
      el.removeClass('dragging');
      angular.element(window).off('mousemove');
      el.css({
        position:'',
        left: '',
        top: '',
        'z-index':''
      });
      placeholder.hide();
    };
  };

  var dragHandleLink = function(scope, el, attrs) {
    el.on('mousedown', function(e) {
      scope.drag.initDrag(e);
    });
    el.on('mouseup', function(e) {
      scope.drag.destroyDrag(e);
    });
  };

  angular.module('ng-draggable-widgets', [])
    .directive('draggableWidget', function() {
      return {
        scope:true,
        restrict: 'A',
        controller: dragController,
        link: {pre: dragLink}
      };
    })

    .directive('draggableWidgetHandle', function() {
      return {
        scope:true,
        restrict: 'A',
        link: {pre: dragHandleLink}
      };
    });
})();
