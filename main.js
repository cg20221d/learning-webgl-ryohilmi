function main() {
  let canvas = document.getElementById("kanvas");
  let gl = canvas.getContext("webgl");

  // Vertex shader
  const vertexShaderCode = `
    void main() {
      float x = 0.0;
      float y = 0.0;
      gl_PointSize = 10.0;
      gl_Position = vec4(x, y, 0.0, 1.0);
    }
  `;

  // Fragment shader
  const fragmentShaderCode = `
    precision mediump float;
    void main() {
      float r = 0.0;
      float g = 0.0;
      float b = 1.0;   
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  let vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderObject, vertexShaderCode);
  gl.compileShader(vertexShaderObject);

  let fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
  gl.compileShader(fragmentShaderObject);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShaderObject);
  gl.attachShader(shaderProgram, fragmentShaderObject);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  gl.clearColor(1.0, 0.65, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 1);
}
