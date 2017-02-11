export function getContext(canvas, options={}) {
  let contexts = ["webgl", "experimental-webgl"];
  let context = null;

  contexts.some(name=>{
    try{
      context = canvas.getContext(name,options);
    }catch(e){};
    return context!=null;
  });

  if(context==null){
    document.body.classList.add("no-webgl");
  }

  return context;
}

export function createProgram(gl,vertexScript,fragScript){
  let vertexShader = createShader(gl, vertexScript, gl.VERTEX_SHADER);
  let fragShader = createShader(gl, fragScript, gl.FRAGMENT_SHADER);

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
      var lastError = gl.getProgramInfoLog(program);
      error("Error in program linking: " + lastError);
      gl.deleteProgram(program);
      return null;
  }

  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Create a buffer for the position of the rectangle corners.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  return program;
}

export function createShader(gl,script,type){
  let shader = gl.createShader(type);
  gl.shaderSource(shader,script);
  gl.compileShader(shader);

  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!compiled) {
    let lastError = gl.getShaderInfoLog(shader);
    error("Error compiling shader '" + shader + "':" + lastError);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
export function createTexture(gl,source,i){
  var texture = gl.createTexture();
  activeTexture(gl,i);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	if ( source == null ) {
		return texture;
	} else {
		updateTexture(gl,source);
	}

  return texture;
}
export function createUniform(gl,program,type,name,...args){
  let location=gl.getUniformLocation(program,"u_"+name);
  gl["uniform"+type](location,...args);
}
export function activeTexture(gl,i){
  gl.activeTexture(gl["TEXTURE"+i]);
}
export function updateTexture(gl,source){
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}
export function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

function error(msg){
  console.error(msg);
}
