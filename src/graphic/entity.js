const Vector2 = require('../util/vector/vec2');
const Vector3 = require('../util/vector/vector3');
const Vector4 = require('../util/vector/vector4');

class Entity {
  constructor() {
    this.m_Color = new Vector4(1);
    this.m_Position = new Vector3(0);
    this.m_Size = Vector2(32);
    this.m_UV = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
    this.m_TextureID = 0;
  }

  get color() { return this.m_Color; }
  set color(v) {
    if (typeof v === 'number') {
      this.m_Color.r = v >> 16 & 0xff;
      this.m_Color.g = v >>  8 & 0xff;
      this.m_Color.b = v >>  0 & 0xff;
      this.m_Color.a = 255;
      this.m_Color.devide(255);
    } else {
      this.m_Color.r = v.r;
      this.m_Color.g = v.g;
      this.m_Color.b = v.b;
      this.m_Color.a = v.a;
    }
  }

  get position() { return this.m_Position; }
  set position(v) {
    this.m_Position.x = v.x;
    this.m_Position.y = v.y;
    this.m_Position.z = v.z;
  }

  get size() { return this.m_Size; }
  set size(v) {
    this.m_Size.w = v.w;
    this.m_Size.h = v.h;
  }

  get uv() { return this.m_UV; }
  set uv(v) { this.m_UV = v; }

  get textureID() { return this.m_TextureID; }
  set textureID(v) { this.m_TextureID = v; }
}

/**
 * Expose.
 *
 * @type {Entity}
 */
module.exports = Entity;
