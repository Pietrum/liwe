const Renderer = require('../renderer');

const GLIndexBuffer = require('../../gl/indexBuffer');
const GLVertexBuffer = require('../../gl/vertexBuffer');
const GLVertexArray = require('../../gl/vertexArray');

class BasicRenderer extends Renderer {
  constructor() {
    const vertexShader = `#version 300 es
    layout(location = 0) in vec2 a_Position;
    layout(location = 1) in vec4 a_Color;
    
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;
    
    out vec4 v_Color;
    
    void main() {
      v_Color = a_Color;
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * vec4(a_Position, 0.0, 1.0);
    }`;

    const fragmentShader = `#version 300 es
    precision highp float;
    precision highp int;
    
    in vec4 v_Color;
    
    out vec4 color;
    
    void main() {
      color = v_Color;
    }`;

    super(vertexShader, fragmentShader);
  }

  draw() {
    // SUBMIT
    // index buffer
    const indices = [ 0, 1, 2, 2, 3, 0];
    const ibo = new GLIndexBuffer(new Uint16Array(indices));
    // vertex buffer
    const vertices = [
       50,  50, 1, 0, 0, 1,
       50, 100, 1, 1, 0, 1,
      100, 100, 1, 0, 1, 1,
      100,  50, 0, 1, 1, 1,
    ];
    const vbo = new GLVertexBuffer(new Float32Array(vertices));
    // vertex array
    this.m_VAO = new GLVertexArray();
    this.m_VAO.bind();
    this.m_VAO.setIndexBuffer(ibo);
    this.m_VAO.setVertexBuffer(vbo, [8, 16]);
    this.m_VAO.constructor.unbind();

    // DRAW
    // draw call
    this.m_VAO.bind();
    this.m_VAO.m_IBO.bind();
    this.m_VAO.m_VBO.bind();
    Renderer.draw(this.m_VAO.m_IBO.m_Count);
    this.m_VAO.m_VBO.constructor.unbind();
    this.m_VAO.m_IBO.constructor.unbind();
    this.m_VAO.constructor.unbind();
  }
}

/**
 * Expose.
 *
 * @type {BasicRenderer}
 */
module.exports = BasicRenderer;
