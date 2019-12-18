const gl = require('./context');

class GLVertexBuffer {
  constructor(vertices, usage) {
    this.m_ID = gl.createBuffer();
    this.m_Usage = gl.NONE;

    switch (usage) {
      case 'dynamic_draw':
        this.m_Usage = gl.DYNAMIC_DRAW;
        break;
      case 'static_draw':
      default:
        this.m_Usage = gl.STATIC_DRAW;
        break;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_ID);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, this.m_Usage);
  }

  destructor() {
    gl.deleteBuffer(this.m_ID);
  }

  bind() {
    if (GLVertexBuffer.s_ID === this.m_ID) {
      return;
    }

    GLVertexBuffer.s_ID = this.m_ID;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_ID);
  }

  static unbind() {
    GLVertexBuffer.s_ID = null;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  static subData(offset, data) {
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
  }
}

/**
 * Expose.
 *
 * @type {GLVertexBuffer}
 */
module.exports = GLVertexBuffer;
