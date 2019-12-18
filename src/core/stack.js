class Stack {
  constructor(size) {
    this.m_Scenes = [];
    this.m_Size = size;
    this.m_LastSceneIndex = 0;
  }

  push(scene, overlayer = false) {
    if (overlayer) {
      this.m_Scenes.push(scene);
    } else {
      this.m_Scenes.splice(this.m_LastSceneIndex, 0, scene);
      this.m_LastSceneIndex += 1;
    }
    scene.attach(this.m_Size);
  }

  pop(scene, overlayer = false) {
    const idx = this.m_Scenes.indexOf(scene);
    if (idx !== -1) {
      scene.detach();
      this.m_Scenes.splice(idx, 1);
      if (!overlayer) {
        this.m_LastSceneIndex -= 1;
      }
    }
  }
}

module.exports = Stack;
