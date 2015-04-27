// Nicholas Johnson (www.nicholasjohnson.com)
// Forward Advance Training (www.forwardadvance.com)
// MIT licence

(function() {
  var dragController = function($scope) {
    var drag = {};
    drag.start = function(e) {
      console.log('start drag');
      drag.initDrag(e);
    };
    drag.end = function(e) {
      drag.destroyDrag();
    };
    $scope.drag = drag;
  };
  dragController.$inject = ["$scope"];

  var dragLink = function(scope, el, attrs) {

    var $window = angular.element(window);

    var setPosition = function(e) {
      el.css({
        left: e.pageX - scope.drag.offsetX - 20 + 'px',
        top: e.pageY - scope.drag.offsetY - 20 + 'px'
      });
      console.log('mousemove');
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
      $window.on('mousemove', setPosition);
    };

    scope.drag.destroyDrag = function() {
      console.log('stop drag');
      el.removeClass('dragging');
      $window.off('mousemove');
      el.css({
        position:'',
        left: '',
        top: '',
        'z-index':''
      });
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
