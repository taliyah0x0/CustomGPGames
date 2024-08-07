precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main(void) {
    vec4 color = texture2D(uMainSampler, outTexCoord);
    gl_FragColor = vec4(1.0 - color.rgb, color.a);
}