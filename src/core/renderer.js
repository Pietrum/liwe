const GLRenderer = require('../gl/renderer');
const GLShader = require('../gl/shader');

class Renderer {
  constructor(vss, fss) {
    this.m_Shader = new GLShader(vss, fss);
  }

  init(width = 640, height = 480) {
    GLRenderer.init();
    GLRenderer.viewport(0, 0, width, height);
  }

  static clear() {
    GLRenderer.clearColor(0, 0.2, 0.5);
    GLRenderer.clear();
  }

  static draw(count) {
    GLRenderer.draw(count);
  }

  submit(entity) {
    if (!entity.hasChilds) {
      return;
    }

    entity.childs.forEach((child) => {
      this.submit(child);
    });
  }

  preRender(camera) {
    // bind shader
    this.m_Shader.bind();
    this.m_Shader.uploadUniformMat4('u_ProjectionMatrix', camera.projectionMatrix);
    this.m_Shader.uploadUniformMat4('u_ViewMatrix', camera.viewMatrix);
    this.m_Shader.uploadUniform1iv('u_Textures', [ 0, 1, 2, 3, 4, 5, 6, 7 ]);

    // @todo bind textures
  }

  postRender() {
    this.m_Shader.constructor.unbind();
    GLRenderer.finish();
  }
}

/**
 * Expose.
 *
 * @type {Renderer}
 */
module.exports = Renderer;
