const GLTexture2D = require('../gl/texture/2d');
const Logger = require('../degugger/logger');

class Material {
  constructor() {
    this.m_Texture = undefined;
  }

  loadImage(filepath) {
    const image = new Image();

    return new Promise((resolve) => {
      image.src = filepath;
      image.onload = (err) => {
        this.m_Texture = new GLTexture2D(image);
        this.bind = this.m_Texture.bind.bind(this.m_Texture);
        resolve(name);
      };
      image.onerror = () => {
        Logger.warn(`[ Material ] image file not found! [ ${filepath} ]`);
        resolve(name);
      };
    });
  }

  get width() { return this.m_Texture.m_Size.w; }
  get height() { return this.m_Texture.m_Size.h; }
}

/**
 * Expose.
 *
 * @type {Material}
 */
module.exports = Material;
