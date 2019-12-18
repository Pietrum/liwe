const gl = require('./context');

const Vector2 = require('../util/vector/vec2');

class GLTexture {
  constructor() {
    this.m_ID = gl.createTexture();
    this.m_Size = Vector2.ZERO();
  }

  destructor() {
    gl.deleteTexture(this.m_ID);
  }

  bind(slot = 0) {
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, this.m_ID);
  }

  static unbind(slot = 0) {
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  get width() { return this.m_Size.w; }
  set width(w) { this.m_Size.w = w; }

  get height() { return this.m_Size.h; }
  set height(h) { this.m_Size.h = h; }
}

/**
 * Expose.
 *
 * @type {GLTexture}
 */
module.exports = GLTexture;
