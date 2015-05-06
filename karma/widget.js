describe('ng-draggable-widgets', function() {

  var scope, el;

  beforeEach(module('ng-draggable-widgets'));

  beforeEach(inject(function($rootScope, $compile) {
    el = angular.element([
      '<div>',
      '</div>'
    ].join(''));
    scope = $rootScope.$new();
    $compile(el)(scope);
    scope.$digest();
  }));

  it('can be initialised', function() {
    widget.initDrag(el);
    expect(el[0].style.position).toBe('absolute');
  });

  it('can be positioned', function() {
    widget.setPosition(el, 100, 100, 20, 20);
    expect(el[0].style.left).toBe('60px');
    expect(el[0].style.top).toBe('60px');
  });

  it('can be unintialised', function() {
    widget.stopDrag(el);
    expect(el[0].style.position).toBe('');
    expect(el[0].style.left).toBe('');
    expect(el[0].style.top).toBe('');
  });

  it('can have a size locked', function() {
    widget.lockSize(el);
    expect(el[0].style.width).toBe('0px');
    expect(el[0].style.height).toBe('0px');
  });

  it('can have a size unlocked', function() {
    widget.unlockSize(el);
    expect(el[0].style.width).toBe('');
    expect(el[0].style.height).toBe('');
  })

});
