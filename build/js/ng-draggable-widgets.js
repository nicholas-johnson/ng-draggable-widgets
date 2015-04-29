// Nicholas Johnson (www.nicholasjohnson.com)
// Forward Advance Training (www.forwardadvance.com)
// MIT licence

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
      var i, groups, widgets, widget, rect;
      widgets = document.querySelectorAll('[draggable-widget]:not(.dragging)');
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
    insertBefore: function(el) {
      el.parentElement.insertBefore($placeholder[0], el)
    },
    insertAfter: function(el) {
      angular.element(el).after($placeholder);
    },
    // insertBefore: function(el) {
    //   angular.element(el).parent()[0].insertBefore(el, $placeholder[0]);
    // }
  };

  // controller for the drag directive.
  // initialises the drag
  var dragController = function($scope) {
    var drag = $scope.drag = {};
    drag.start = function(e) {
      drag.initDrag(e);
    };
    drag.end = function(e) {
      drag.destroyDrag();
    };
  };
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
            var setPosition = function(e) {
              el.css({
                left: e.pageX - scope.drag.offsetX - 20 + 'px',
                top: e.pageY - scope.drag.offsetY - 20 + 'px'
              });
            };

            drag.callback = attrs.draggableWidgetCallback;

            // Set up the DOM for dragging
            drag.initDrag = function(e) {
              console.log('start drag');
              drag.offsetX = e.offsetX;
              drag.offsetY = e.offsetY;
              setPosition(e);
              el.addClass('dragging');
              el.css({
                position:'absolute',
                'z-index':100000
              });
              placeholder.show(el);
              scope.drag.source = {
                group: scope.dragGroup,
                index: scope.$index // TODO not zero!
              };
              angular.element(window).on('mousemove', function(e) {
                setPosition(e);
                var dest = hitZones.check(e);
                console.log(dest);
                if (dest) {
                  scope.drag.dest = dest;
                }
              });
            };

            // Unset the DOM for dragging
            scope.drag.destroyDrag = function() {
              var widget;
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
              if (scope.drag.dest) {
                widget = scope.drag.source.group[scope.drag.source.index];
                scope.drag.source.group.splice(scope.drag.source.index, 1);
                scope.drag.dest.group.splice(scope.drag.dest.index, 0, widget);
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
          pre: function(scope, el, attrs) {
            el.on('mousedown', function(e) {
              scope.drag.initDrag(e);
            });
            el.on('mouseup', function(e) {
              scope.drag.destroyDrag(e);
            });
          }
        }
      };
    });
})();
