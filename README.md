# ng draggable widgets

Draggable widgets for Angular. No jQuery dependency.

## Usage

Each draggable widget gets an attribute of draggable-widget and must contain an element with a draggable-widget-handle attribute.

      <body ng-controller="dragController">
        <div ng-repeat="widget in widgets" draggable-widget>
          <div draggable-widget-handle>drag handle</div>
          Widget content
        </div>
      </body>

Dragging the handle sets position absolute on the element causing it to drop out of the layout flow. 
