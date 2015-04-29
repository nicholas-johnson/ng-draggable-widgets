(function() {

  var widgetGroups = [
    [
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
    ],
    [
      {
        title:'Hocks of Rumps',
        class: 'hocks'
      },
      {
        title:'Cats with Woks',
        class: 'woks'
      },
      {
        title:'Pops in Pumps',
        class: 'pops'
      }
    ]
  ];

  angular.module('app', ['ng-draggable-widgets'])
    .controller('dragController', function($scope) {
      $scope.widgetGroups = widgetGroups;
      $scope.moveWidget = function(drag) {
        console.log(drag);
      }
    });
})();
