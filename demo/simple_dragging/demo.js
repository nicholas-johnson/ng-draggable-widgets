(function() {

  var widgets = [
    {
      title:'Cats with Woks',
      class: 'woks'
    },
    {
      title:'Socks on Sticks',
      class: 'socks'
    },
    {
      title:'Mocks of Macs',
      class: 'mocks'
    },
    {
      title:'Pops in Pumps',
      class: 'pops'
    },
    {
      title:'Hocks of Rumps',
      class: 'hocks'
    }
  ];

  angular.module('app', ['ng-draggable-widgets'])
    .controller('dragController', function($scope) {
      $scope.widgets = widgets;
    });
})();
