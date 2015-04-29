# ng draggable widgets

Draggable widgets for Angular. No jQuery dependency.

## Usage

Each draggable widget gets an attribute of draggable-widget and must contain an element with a draggable-widget-handle attribute.

      <body ng-controller="dragController">
        <div drag-group='widgets'>
            <div ng-repeat="widget in widgets" draggable-widget draggable-widget-callback='moveWidget'>
              <div draggable-widget-handle>drag handle</div>
              Widget content
            </div>
        </div>
      </body>

Dragging the handle sets position absolute on the element causing it to drop out of the layout flow. On completion the callback is executed.

## Drag-group

If you want automatic updating you must specify at least one drag group that points to an array in scope.

## Callback

Specify a callback function with the draggable-widget-callback attribute. The callback will receive a drag object that contains references to the old and new arrays (assuming you have dragged between groups, and the insertion point. See the demo app for examples.

## Classes

* Elements gain a class of dragging while being dragged.

## The Placeholder

A div with a class of placeholder will be inserted into the DOM at the drop point. This will have the correct width and height. You may wish to style this div to match your widgets.

## Browser compatibility

IE9+ only please. Mobile support not guaranteed.

## Licence

MIT license, use it as you see fit. I'm not going to sue you.

