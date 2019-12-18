const Scene = require('../scene');

const BatchRenderer = require('../renderer/batch');
const OrthographicCamera = require('../camera/orthographic');

class Scene2D extends Scene {
  constructor(initialize = true) {
    super(new BatchRenderer(), new OrthographicCamera());

    if (initialize) {
      this.init();
    }
  }
}

/**
 * Expose.
 *
 * @type {Scene2D}
 */
module.exports = Scene2D;
