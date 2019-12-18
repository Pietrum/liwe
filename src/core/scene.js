const Logger = require('../degugger/logger');

class Scene {
  constructor(renderer, camera) {
    this.m_Camera = camera;
    this.m_Renderer = renderer;

    if (this.m_Renderer.draw) {
      this.draw = this.m_Renderer.draw.bind(this.m_Renderer);
    }

    if (this.m_Renderer.submit) {
      this.submit = this.m_Renderer.submit.bind(this.m_Renderer);
    }
  }

  init() {
    Logger.log('[ %s ] initialized', this.constructor.name);
    const result = this.onInit();

    if (result instanceof Promise) {
      return result;
    }

    return Promise.resolve(result);
  }

  attach(size) {
    Logger.log('[ %s ] attached', this.constructor.name);
    this.m_Renderer.init(size.w, size.h);
    this.onAttach();
  }

  detach() {
    Logger.log('[ %s ] detached', this.constructor.name);
    this.onDetach();
  }

  render(dt) {
    this.m_Renderer.preRender && this.m_Renderer.preRender(this.m_Camera);
    this.onRender(dt);
    this.m_Renderer.postRender && this.m_Renderer.postRender();
  }

  // pure functions!
  onInit() {};
  onAttach() {};
  onDetach() {};
  onRender() {};
}


module.exports = Scene;
