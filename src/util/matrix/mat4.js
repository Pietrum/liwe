class Matrix44 {
  constructor(value = 0) {
    this.m_Data = Array(16).fill(0);

    // diagonal
    this.m_Data[        0] = value;
    this.m_Data[1 +     4] = value;
    this.m_Data[2 + 2 * 4] = value;
    this.m_Data[3 + 3 * 4] = value;
  }

  toFloat32Array() {
    return new Float32Array(this.m_Data);
  }
}

/**
 * Expose.
 */
module.exports = {
  IDENTITY: () => (new Matrix44(1)),
  orthographic: (left, right, top, bottom, near, far) => {
    const matrix = new Matrix44(1);

    const lr = 1.0 / ( left - right );
    const bt = 1.0 / ( bottom - top );
    const nf = 1.0 / ( near - far );

    matrix.m_Data[0 + 0 * 4] = -2.0 * lr;
    matrix.m_Data[1 + 1 * 4] = -2.0 * bt;
    matrix.m_Data[2 + 2 * 4] = -2.0 * nf;

    matrix.m_Data[0 + 3 * 4] = ( left + right ) * lr;
    matrix.m_Data[1 + 3 * 4] = ( top + bottom ) * bt;
    matrix.m_Data[2 + 3 * 4] = ( near + far ) * nf;

    return matrix;
  },
  perspective: () => {
    return new Matrix44(1);
  },
};
