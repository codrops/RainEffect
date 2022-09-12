import 'core-js';
import RainRenderer from "./rain-renderer";
import Raindrops from "./raindrops";
import loadImages from "./image-loader";
import createCanvas from "./create-canvas";
import times from "./times";
import { random } from "./random";

let textureFgImage, textureBgImage,
  dropColor, dropAlpha, dropShine;

let textureFg,
  textureFgCtx,
  textureBg,
  textureBgCtx;

let textureBgSize = {
  width: 384,
  height: 256
}
let textureFgSize = {
  width: 96,
  height: 64
}
let raindrops,
  renderer,
  canvas;

function loadTextures() {
  loadImages([
    { name: "dropShine", src: "/themes/custom/danlobo/img/drop-shine13.png" },
    { name: "dropAlpha", src: "/themes/custom/danlobo/img/drop-alpha.png" },
    { name: "dropColor", src: "/themes/custom/danlobo/img/drop-color.png" },

    { name: "textureFg", src: "/themes/custom/danlobo/img/water/texture-fg2.png" },
    { name: "textureBg", src: "/themes/custom/danlobo/img/water/texture-bg2.png" },
  ]).then((images) => {
    textureFgImage = images.textureFg.img;
    textureBgImage = images.textureBg.img;

    dropShine = images.dropShine.img;
    dropColor = images.dropColor.img;
    dropAlpha = images.dropAlpha.img;

    init();
  });
}
loadTextures();

function init() {
  var canvas = document.querySelector('#container');

  var dpi = window.devicePixelRatio;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // canvas.style.width = window.innerWidth + "px";
  // canvas.style.height = window.innerHeight + "px";

  raindrops = new Raindrops(
    canvas.width,
    canvas.height,
    dpi,
    dropAlpha,
    dropColor, {
      minR: 20,
      maxR: 60,
      rainChance: 0.3,
      rainLimit: 10,
      dropletsRate: 0,
      globalTimeScale: 0.45,
      trailRate: 1.1,
      dropFallMultiplier: 0.2,
      trailScaleRange: [0.2, 0.35],
      spawnArea: [-0.3, 0.3],
      collisionRadius: 0.45,
      collisionRadiusIncrease: 0,
      collisionBoost: 0.35,
      collisionBoostMultiplier: 0.025,
    }
  );

  // function reportWindowSize() {
  //   let dpi = window.devicePixelRatio;

  //   const heightOutput = document.querySelector('#height');
  //   const widthOutput = document.querySelector('#width');

  //   heightOutput.textContent = window.innerHeight * dpi;
  //   widthOutput.textContent = window.innerWidth * dpi;;

  // }

  // window.addEventListener('resize', reportWindowSize);

  textureFg = createCanvas(textureFgSize.width, textureFgSize.height);
  textureFgCtx = textureFg.getContext('2d');
  textureBg = createCanvas(textureBgSize.width, textureBgSize.height);
  textureBgCtx = textureBg.getContext('2d');

  generateTextures(textureBgImage, textureFgImage);

  times(80, (i) => {
    raindrops.addDrop(
      raindrops.createDrop({
        x: random(canvas.width),
        y: random(canvas.height),
        r: random(10, 20)
      })
    )
  });
  renderer = new RainRenderer(
    canvas,
    raindrops.canvas,
    textureFgImage,
    textureBgImage,
    dropShine, {
      renderShadow: true,
      minRefraction: 150,
      maxRefraction: 512,
      alphaMultiply: 7,
      alphaSubtract: 3
    }
  );
}

function generateTextures(fg, bg, alpha = 1) {
  textureFgCtx.globalAlpha = alpha;
  textureFgCtx.drawImage(fg, 0, 0, textureFgSize.width, textureFgSize.height);

  textureBgCtx.globalAlpha = alpha;
  textureBgCtx.drawImage(bg, 0, 0, textureBgSize.width, textureBgSize.height);
}