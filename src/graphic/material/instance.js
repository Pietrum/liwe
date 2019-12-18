const Material = require('../material');

class MaterialInstance {
  constructor() {
    this.m_Materials = {};
  }

  loadImage(name, filepath) {
    this.m_Materials[name] = new Material();
    return this.m_Materials[name].loadImage(filepath);
  }

  bind(name, slot) {
    if (!this.m_Materials[name]) return;
    this.m_Materials[name].bind(slot);
  }

  bindAll() {
  }

  get(name) {
    if (!this.m_Materials[name]) return;
    return this.m_Materials[name];
  }
}

/**
 * Expose.
 *
 * @type {MaterialInstance}
 */
module.exports = new MaterialInstance();
