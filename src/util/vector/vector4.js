class Vector4 {
  constructor(x = 0, y, z, w) {
    this.x = x;
    this.y = typeof y === 'number' ? y : x;
    this.z = typeof z === 'number' ? z : x;
    this.w = typeof w === 'number' ? w : x;
  }

  devide(value) {
    this.x /= value;
    this.y /= value;
    this.z /= value;
    this.w /= value;

    return this;
  }

  get r() { return this.x; }
  set r(v) { this.x = v; }
  get g() { return this.y; }
  set g(v) { this.y = v; }
  get b() { return this.z; }
  set b(v) { this.z = v; }
  get a() { return this.w; }
  set a(v) { this.w = v; }
}

/**
 * Expose.
 *
 * @type {Vector4}
 */
module.exports = Vector4;
