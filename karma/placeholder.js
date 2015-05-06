describe('ng-draggable-widgets', function() {

  var scope, el, widgetEl;

  beforeEach(module('ng-draggable-widgets'));

  beforeEach(inject(function($rootScope, $compile) {
    el = angular.element([
      '<div>',
        '<div class="widget">',
        '</div>',
      '</div>'
    ].join(''));
    scope = $rootScope.$new();
    widgetEl = angular.element(el[0].getElementsByClassName('widget')[0]);
    $compile(el)(scope);
    scope.$digest();
  }));

  it('has an element', function() {
    expect(placeholder.el).toBeDefined();
  });

  it('can be shown', function() {
    console.log(widgetEl);
    placeholder.show(widgetEl);
    expect(placeholder.el[0].hidden).toBe(false);
    expect(placeholder.el[0].style.width).toBe('0px');
    expect(placeholder.el[0].style.width).toBe('0px');
  });

  it('can be hidden', function() {
    placeholder.hide();
    expect(placeholder.el[0].hidden).toBe(true);
  });

});
