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
        left: e.pageX - scope.drag.offsetX - 20,
        top: e.pageY - scope.drag.offsetY - 20
      });
    };

    scope.drag.initDrag = function(e) {
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
      $(window).off('mousemove');
      el.css({
        position:'',
        left: '',
        top: '',
        'z-index':''
      });
    };
  };

  angular.module('ng-draggable-widgets', [])
    .directive('draggable-widget', function() {
      return {
        scope:true,
        restrict: 'A',
        controller: dragController,
        link: dragLink
      };
    });

})();
