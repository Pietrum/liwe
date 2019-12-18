const gl = require('./context');

class GLVertexArray {
  constructor() {
    this.m_ID = gl.createVertexArray();
    this.m_IBO = null;
    this.m_VBO = null;
  }

  desctructor() {
    gl.deleteVertexArray(this.m_ID);
  }

  bind() {
    if (GLVertexArray.s_ID === this.m_ID) {
      return;
    }

    GLVertexArray.s_ID = this.m_ID;
    gl.bindVertexArray(this.m_ID);
  }

  static unbind() {
    GLVertexArray.s_ID = null;
    gl.bindVertexArray(null);
  }

  setVertexBuffer(vbo, layout) {
    vbo.bind();

    let offset = 0;
    const stride = layout.reduce((v, s) => (s + v), 0);
    layout.forEach((v, idx) => {
      gl.enableVertexAttribArray(idx);
      gl.vertexAttribPointer(idx, v / 4, gl.FLOAT, false, stride, offset);
      offset += v;
    });

    vbo.constructor.unbind();

    this.m_VBO = vbo;
  }

  setIndexBuffer(ibo) {
    this.m_IBO = ibo;
  }
}

/**
 * Expose.
 *
 * @type {GLVertexArray}
 */
module.exports = GLVertexArray;
