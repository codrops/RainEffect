import 'core-js';
import RainRenderer from "./rain-renderer";
import Raindrops from "./raindrops";
import loadImages from "./image-loader";
import createCanvas from "./create-canvas";
import times from "./times";
import {random} from "./random";

let textureFgImage, textureBgImage,
  dropColor, dropAlpha, dropShine;

let raindrops,
  renderer,
  canvas;

function loadTextures(){
  loadImages([
    {name:"dropShine",src:"img/drop-shine2.png"},
    {name:"dropAlpha",src:"img/drop-alpha.png"},
    {name:"dropColor",src:"img/drop-color.png"},

    {name:"textureFg",src:"img/water/texture-fg.png"},
    {name:"textureBg",src:"img/water/texture-bg.png"},
  ]).then((images)=>{
    textureFgImage = images.textureFg.img;
    textureBgImage = images.textureBg.img;

    dropShine = images.dropShine.img;
    dropColor = images.dropColor.img;
    dropAlpha = images.dropAlpha.img;

    init();
  });
}
loadTextures();

function init(){
  canvas=document.querySelector('#container');

  let dpi=window.devicePixelRatio;

  raindrops=new Raindrops(
    canvas.width,
    canvas.height,
    1,
    dropAlpha,
    dropColor,
    {
      minR:20,
      maxR:60,
      rainChance:0.3,
      rainLimit:10,
      dropletsRate:0,
      globalTimeScale:0.45,
      trailRate:1.1,
      dropFallMultiplier:0.2,
      trailScaleRange:[0.2,0.35],
      autoShrink:false,
      spawnArea:[-0.3,0.3],
      collisionRadius:0.45,
      collisionRadiusIncrease:0,
      collisionBoost:0.35,
      collisionBoostMultiplier:0.025,
    }
  );

  times(80,(i)=>{
    raindrops.addDrop(
      raindrops.createDrop({
        x:random(canvas.width),
        y:random(canvas.height),
        r:random(10,20)
      })
    )
  });
  renderer = new RainRenderer(
    canvas,
    raindrops.canvas,
    textureFgImage,
    textureBgImage,
    dropShine,
    {
      renderShadow:true,
      minRefraction:150,
      maxRefraction:512,
      alphaMultiply:7,
      alphaSubtract:3
    }
  );
}
