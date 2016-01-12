// Nicholas Johnson (www.nicholasjohnson.com)
// Forward Advance Training (www.forwardadvance.com)
// MIT licence

(function() {
// Hitzones are positioned on the left and right of widgets
// We call check to see if the current drag location is in a hitzone
// If so we move the placeholder and update the drag destination.
var hitZones = {
  size: 10,
  check: function(e) {
    var i, groups, widgets, widget, rect, width;
    groups = document.querySelectorAll('[drag-group]');
    for (var j = 0; j < groups.length; j++) {
      widgets = groups[j].querySelectorAll('[draggable-widget]:not(.dragging)');
      for (i = 0; i < widgets.length; i++) {
        widget = widgets[i];
        rect = widget.getBoundingClientRect();
        width = widget.offsetWidth;
        if ((e.pageY > rect.top) &&
            (e.pageY < rect.bottom) &&
            (e.pageX > rect.left) &&
            (e.pageX < rect.right - (width / 2))) {
          placeholder.insertBefore(widget);
          console.log(i);
          return {
            group: angular.element(widget).scope().dragGroup,
            index: i
          };
        }
        if ((e.pageY > rect.top) &&
            (e.pageY < rect.bottom) &&
            (e.pageX > rect.left + (width / 2)) &&
            (e.pageX < rect.right)) {
          placeholder.insertAfter(widget);
          console.log(i+1);
          return {
            group: angular.element(widget).scope().dragGroup,
            index: i+1
          };
        }
      }
    }
  }
};

var widget = {
  initDrag: function(el) {
    el.addClass('dragging');
    el.css({
      position:'absolute',
      'z-index':100000
    });
  },
  setPosition: function(el, x, y, offsetX, offsetY) {
    el.css({
      left: x - offsetX - 20 + 'px',
      top: y - offsetY - 20 + 'px'
    });
  },
  stopDrag: function(el) {
    el.removeClass('dragging');
    el.css({
      position:'',
      left: '',
      top: '',
      'z-index': ''
    });
  },
  lockSize: function(el) {
    el.css({
      width: el[0].offsetWidth + 'px',
      height: el[0].offsetHeight + 'px'
    });
  },
  unlockSize: function(el) {
    el.css({
      width: '',
      height: ''
    });
  }
};

// The placeholder object is a little rectangle with the same dimensions as the dragged widget
// It gives the user a preview of page layout.
// We can show or hide it, and insert it before or after another widget.
var placeholder = {
  el: angular.element([
    '<div class="widget-placeholder">',
    '</div>'
  ].join('')),
  show: function(el) {
    placeholder.el[0].hidden = false;
    placeholder.el.css({
      width: el[0].clientWidth +'px',
      height: el[0].clientHeight +'px'
    });
    el.after(placeholder.el);
  },
  hide: function() {
    placeholder.el[0].hidden = true;
  },
  insertBefore: function(el) {
    el.parentElement.insertBefore(placeholder.el[0], el);
  },
  insertAfter: function(el) {
    angular.element(el).after(placeholder.el);
  }
};

// controller for the drag directive.
// initialises the drag
var dragController = /*@ngInject*/["$scope", function($scope) {
  var drag = $scope.drag = {};
  drag.start = function(e) {
    drag.initDrag(e);
  };
  drag.end = function() {
    drag.destroyDrag();
  };
}];
dragController.$inject = ["$scope"];

angular.module('ng-draggable-widgets', [])
  .directive('dragGroup', ["$parse", function($parse) {
    return {
      scope:true,
      restrict: 'A',
      link: {
        pre: function(scope, el, attrs) {
          scope.dragGroup = {};
          scope.dragGroup = $parse(attrs.dragGroup)(scope);
        }
      }
    };
  }])

  .directive('draggableWidget', ["$rootScope", function($rootScope) {
    return {
      scope:true,
      restrict: 'A',
      controller: dragController,
      link: {
        pre: function(scope, el, attrs) {
          var drag = scope.drag;

          drag.callback = attrs.draggableWidgetCallback;

          // Set up the DOM for dragging
          drag.initDrag = function(e) {
            var dest;
            console.log('start drag');
            drag.offsetX = e.offsetX;
            drag.offsetY = e.offsetY;
            widget.lockSize(el);
            widget.initDrag(el);
            widget.setPosition(el, e.pageX, e.pageY, scope.drag.offsetX, scope.drag.offsetY);
            placeholder.show(el);
            scope.drag.source = {
              group: scope.dragGroup,
              index: scope.$index
            };
            angular.element(window).on('mousemove', function(e) {
              widget.setPosition(el, e.pageX, e.pageY, scope.drag.offsetX, scope.drag.offsetY);
              dest = hitZones.check(e);
              if (dest) {
                scope.drag.dest = dest;
                console.log('dest', dest);
              }
            });
          };

          // Unset the DOM for dragging
          scope.drag.destroyDrag = function() {
            var obj;
            console.log('stop drag');
            angular.element(window).off('mousemove');
            widget.stopDrag(el);
            widget.unlockSize(el);
            placeholder.hide();
            if (scope.drag.dest) {
              obj = scope.drag.source.group[scope.drag.source.index];
              scope.drag.source.group.splice(scope.drag.source.index, 1);
              scope.drag.dest.group.splice(scope.drag.dest.index, 0, obj);
            }
            if (drag.callback) {
              scope[drag.callback](scope.drag);
            }
            $rootScope.$apply();
          };
        }
      }
    };
  }])

  .directive('draggableWidgetHandle', function() {
    return {
      scope:true,
      restrict: 'A',
      link: {
        pre: function(scope, el) {
          el.on('mousedown', function(e) {
            scope.drag.initDrag(e);
            angular.element(document).one('mouseup', function(e) {
              scope.drag.destroyDrag(e);
            });
          });
        }
      }
    };
  });

})();