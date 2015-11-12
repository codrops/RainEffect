precision mediump float;

// textures
uniform sampler2D u_waterMap;
uniform sampler2D u_textureShine;
uniform sampler2D u_textureFg;
uniform sampler2D u_textureBg;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
uniform vec2 u_resolution;
uniform vec2 u_parallax;
uniform float u_parallaxFg;
uniform float u_parallaxBg;
uniform float u_textureRatio;
uniform bool u_renderShine;
uniform bool u_renderShadow;
uniform float u_minRefraction;
uniform float u_refractionDelta;
uniform float u_brightness;
uniform float u_alphaMultiply;
uniform float u_alphaSubtract;

// alpha-blends two colors
vec4 blend(vec4 bg,vec4 fg){
  vec3 bgm=bg.rgb*bg.a;
  vec3 fgm=fg.rgb*fg.a;
  float ia=1.0-fg.a;
  float a=(fg.a + bg.a * ia);
  vec3 rgb;
  if(a!=0.0){
    rgb=(fgm + bgm * ia) / a;
  }else{
    rgb=vec3(0.0,0.0,0.0);
  }
  return vec4(rgb,a);
}

vec2 pixel(){
  return vec2(1.0,1.0)/u_resolution;
}

vec2 parallax(float v){
  return u_parallax*pixel()*v;
}

vec2 texCoord(){
  return vec2(gl_FragCoord.x, u_resolution.y-gl_FragCoord.y)/u_resolution;
}

// scales the bg up and proportionally to fill the container
vec2 scaledTexCoord(){
  float ratio=u_resolution.x/u_resolution.y;
  vec2 scale=vec2(1.0,1.0);
  vec2 offset=vec2(0.0,0.0);
  float ratioDelta=ratio-u_textureRatio;
  if(ratioDelta>=0.0){
    scale.y=(1.0+ratioDelta);
    offset.y=ratioDelta/2.0;
  }else{
    scale.x=(1.0-ratioDelta);
    offset.x=-ratioDelta/2.0;
  }
  return (texCoord()+offset)/scale;
}

// get color from fg
vec4 fgColor(float x, float y){
  float p2=u_parallaxFg*2.0;
  vec2 scale=vec2(
    (u_resolution.x+p2)/u_resolution.x,
    (u_resolution.y+p2)/u_resolution.y
  );

  vec2 scaledTexCoord=texCoord()/scale;
  vec2 offset=vec2(
    (1.0-(1.0/scale.x))/2.0,
    (1.0-(1.0/scale.y))/2.0
  );

  return texture2D(u_waterMap,
    (scaledTexCoord+offset)+(pixel()*vec2(x,y))+parallax(u_parallaxFg)
  );
}

void main() {
  vec4 bg=texture2D(u_textureBg,scaledTexCoord()+parallax(u_parallaxBg));

  vec4 cur = fgColor(0.0,0.0);

  float d=cur.b; // "thickness"
  float x=cur.g;
  float y=cur.r;

  float a=clamp(cur.a*u_alphaMultiply-u_alphaSubtract, 0.0,1.0);

  vec2 refraction = (vec2(x,y)-0.5)*2.0;
  vec2 refractionParallax=parallax(u_parallaxBg-u_parallaxFg);
  vec2 refractionPos = scaledTexCoord()
    + (pixel()*refraction*(u_minRefraction+(d*u_refractionDelta)))
    + refractionParallax;

  vec4 tex=texture2D(u_textureFg,refractionPos);

  if(u_renderShine){
    float maxShine=490.0;
    float minShine=maxShine*0.18;
    vec2 shinePos=vec2(0.5,0.5) + ((1.0/512.0)*refraction)* -(minShine+((maxShine-minShine)*d));
    vec4 shine=texture2D(u_textureShine,shinePos);
    tex=blend(tex,shine);
  }

  vec4 fg=vec4(tex.rgb*u_brightness,a);

  if(u_renderShadow){
    float borderAlpha = fgColor(0.,0.-(d*6.0)).a;
    borderAlpha=borderAlpha*u_alphaMultiply-(u_alphaSubtract+0.5);
    borderAlpha=clamp(borderAlpha,0.,1.);
    borderAlpha*=0.2;
    vec4 border=vec4(0.,0.,0.,borderAlpha);
    fg=blend(border,fg);
  }

  gl_FragColor = blend(bg,fg);
}
