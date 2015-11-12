export default function createCanvas(width,height){
  let canvas=document.createElement("canvas");
  canvas.width=width;
  canvas.height=height;
  return canvas;
}
