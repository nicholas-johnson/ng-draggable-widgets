(function() {

  var widgets = [
    {
      title:'Cats with Woks'
    },
    {
      title:'Mocks of Macs'
    },
    {
      title:'Socks on Sticks'
    },
    {
      title:'Pops in Pumps'
    }
  ];

  angular.module('app', ['ng-draggable-widgets'])
    .controller('dragController', function($scope) {
      $scope.widgets = widgets;
    });
})();
