class Vector3 {
  constructor(x = 0, y, z) {
    this.x = x;
    this.y = typeof y === 'number' ? y : x;
    this.z = typeof z === 'number' ? z : x;
  }

  get r() { return this.x; }
  set r(v) { this.x = v; }
  get g() { return this.y; }
  set g(v) { this.y = v; }
  get b() { return this.z; }
  set b(v) { this.z = v; }
}

/**
 * Expose.
 *
 * @type {Vector3}
 */
module.exports = Vector3;
