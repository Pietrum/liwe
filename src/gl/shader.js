const gl = require('./context');

class GLShader {
  constructor(vertexShaderSource, fragmentShaderSource) {
    const vs = GLShader.compile(vertexShaderSource, gl.VERTEX_SHADER);
    const fs = GLShader.compile(fragmentShaderSource, gl.FRAGMENT_SHADER);

    this.m_ID = gl.createProgram();

    gl.attachShader(this.m_ID, vs);
    gl.attachShader(this.m_ID, fs);
    gl.linkProgram(this.m_ID);
    gl.detachShader(this.m_ID, fs);
    gl.detachShader(this.m_ID, vs);

    // @todo switch into UniformBuffer
    this.m_Locations = {};
  }

  destructor() {
    gl.deleteProgram(this.m_ID);
  }

  bind() {
    if (GLShader.s_ID === this.m_ID) {
      return;
    }

    GLShader.s_ID = this.m_ID;
    gl.useProgram(this.m_ID);
  }

  static unbind() {
    GLShader.s_ID = null;
    gl.useProgram(null);
  }

  static compile(source, type) {
    const id = gl.createShader(type);

    gl.shaderSource(id, source);
    gl.compileShader(id);

    const status = gl.getShaderParameter(id, gl.COMPILE_STATUS);
    if (!status) {
      throw new Error(`Shader compile error! : \n${gl.getShaderInfoLog(id)}`);
    }

    return id;
  }

  uniformLocationId(name) {
    if (this.m_Locations[name]) {
      return this.m_Locations[name];
    }

    this.m_Locations[name] = gl.getUniformLocation(this.m_ID, name);
    return this.m_Locations[name];
  }

  uploadUniformMat4(name, matrix) {
    const locationId = this.uniformLocationId(name);
    gl.uniformMatrix4fv(locationId, false, matrix.toFloat32Array());
  }

  uploadUniform1iv(name, value) {
    const locationId = this.uniformLocationId(name);
    gl.uniform1iv(locationId, value);
  }
}

/**
 * Expose.
 *
 * @type {GLShader}
 */
module.exports = GLShader;
