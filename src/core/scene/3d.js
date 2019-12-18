const Scene = require('../scene');

const BasicRenderer = require('../renderer/basic');
const PerspectiveCamera = require('../camera/perspective');
const OrthographicCamera = require('../camera/orthographic');

class Scene3D extends Scene {
  constructor(init = true) {
    super(new BasicRenderer(), new OrthographicCamera());

    if (init) {
      this.init();
    }
  }
}

module.exports = Scene3D;
