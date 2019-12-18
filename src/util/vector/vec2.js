class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get w() { return this.x; }
  set w(v) { this.x = v; }
  get h() { return this.y; }
  set h(v) { this.y = v; }
}

/**
 * Expose.
 */
module.exports = vec2 = (x, y) => {
  return new Vector2(x, y);
};
vec2.ZERO = () => (new Vector2(0, 0));
vec2.IDENTITY = () => (new Vector2(1, 1));
