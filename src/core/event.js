const Stage = require('./stage');

const Event = {
  MOUSE_BUTTON_PRESSED: 'mousedown',
  MOUSE_BUTTON_RELEASED: 'mouseup',
  MOUSE_POINTER_MOVE: 'mousemove',
};

Event.on = function(type, callback) {
  Stage.getCanvas().addEventListener(type, (event) => {
    if (type === this.MOUSE_POINTER_MOVE) {
      callback(event.layerX, event.layerY);
    }
  });
};

/**
 * Expose.
 *
 * @type {{}}
 */
module.exports = Event;
