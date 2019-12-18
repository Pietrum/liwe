const gl = require('../context');

const GLTexture = require('../texture');

class GLTexture2D extends GLTexture {
  constructor(image = null) {
    super();

    image instanceof Image ? this.useImage(image) : this.useColor();

    // set the filtering so we don't need mipmap
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  useColor(r = 255, g = 255, b = 255) {
    this.width = 1;
    this.height = 1;

    gl.bindTexture(gl.TEXTURE_2D, this.m_ID);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
      this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE,
      new Uint8Array([r, g, b]));
  }

  useImage(image) {
    this.width = image.width;
    this.height = image.height;

    gl.bindTexture(gl.TEXTURE_2D, this.m_ID);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
}

/**
 * Expose.
 *
 * @type {GLTexture2D}
 */
module.exports = GLTexture2D;
