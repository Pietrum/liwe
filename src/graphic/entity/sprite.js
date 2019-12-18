const Entity = require('../entity');

class Sprite extends Entity {
  constructor() {
    super();
  }

  static createBasicColor(width = 32, height = 32, color = 0xff00ffff, x = 0, y = 0) {
    const sprite = new Sprite();

    // size
    sprite.m_Size.w = width;
    sprite.m_Size.h = height;
    // color
    sprite.m_Color.r = color >> 24 & 0xff;
    sprite.m_Color.g = color >> 16 & 0xff;
    sprite.m_Color.b = color >>  8 & 0xff;
    sprite.m_Color.a = color >>  0 & 0xff;
    sprite.m_Color.devide(255);
    // position
    sprite.m_Position.x = x;
    sprite.m_Position.y = y;

    return sprite;
  }

  static createFromTexture(filepath) {
    const texture = Asset.loadTexture(filepath);
    const sprite = new Sprite();
    sprite.m_Size = texture.m_Size;
    sprite.m_Texture = texture;

    return sprite;
  }

  static createFromAtlas(filepath, w, h) {
    const texture = Asset.loadTexture(filepath);
    const sprite = new Sprite();
    sprite.m_Size.w = w;
    sprite.m_Size.h = h;
    sprite.m_Texture = texture;

    return sprite;
  }
}

/**
 * Expose.
 *
 * @type {Sprite}
 */
module.exports = Sprite;
