const Matrix44 = require('../util/matrix/mat4');

class Camera {
  constructor(projectionMatrix = Matrix44.IDENTITY(), viewMatrix = Matrix44.IDENTITY()) {
    this.m_ProjectionMatrix = projectionMatrix;
    this.m_ViewMatrix = viewMatrix;
  }

  get projectionMatrix() { return this.m_ProjectionMatrix; }
  set projectionMatrix(mat4) { this.m_ProjectionMatrix = mat4; }

  get viewMatrix() { return this.m_ViewMatrix; }
  set viewMatrix(mat4) { this.m_ViewMatrix = mat4; }
}

/**
 * Expose.
 *
 * @type {Camera}
 */
module.exports = Camera;
