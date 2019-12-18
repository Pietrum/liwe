const Camera = require('../camera');

const Matrix44 = require('../../util/matrix/mat4');

class OrthographicCamera extends Camera {
  constructor(width = window.innerWidth, height = window.innerHeight, near = -1, far = 1) {
    super(Matrix44.orthographic(0, width, 0, height, near, far));
  }
}

/**
 * Expose.
 *
 * @type {OrthographicCamera}
 */
module.exports = OrthographicCamera;
