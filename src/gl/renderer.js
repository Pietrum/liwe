const gl = require('./context');

/**
 * Expose.
 *
 * @type {GLRenderer}
 */
module.exports ={
  clear: () => {
    // eslint-disable-next-line no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },

  clearColor: (r, g, b, a = 1) => {
    gl.clearColor(r, g, b, a);
  },

  draw: (count) => {
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_INT, 0);
  },

  finish: () => {
    gl.finish();
  },

  init: () => {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  },

  viewport: (x, y, w, h) => {
    gl.viewport(x, y, w, h);
  },
};
