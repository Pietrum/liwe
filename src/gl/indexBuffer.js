const gl = require('./context');

class GLIndexBuffer {
  constructor(indices) {
    this.m_ID = gl.createBuffer();
    this.m_Count = indices.length;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_ID);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  destructor() {
    gl.deleteBuffer(this.m_ID);
  }

  bind() {
    if (GLIndexBuffer.s_ID === this.m_ID) {
      return;
    }

    GLIndexBuffer.s_ID = this.m_ID;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_ID);
  }

  static unbind() {
    GLIndexBuffer.s_ID = null;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}

/**
 * Expose.
 *
 * @type {GLIndexBuffer}
 */
module.exports = GLIndexBuffer;
