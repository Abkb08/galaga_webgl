"use strict";

// vertex shader code (vsc)
const vsc = "attribute vec2 vpos;" +
"void main() {" +
"gl_Position = vec4(vpos, 0.0, 1.0);" +
"gl_PointSize = 1.0;" +
"}";

// fragment shader code (fsc)
const fsc = "precision lowp float;" +
"uniform vec4 vcolor;" +
"void main() {" +
"gl_FragColor = vcolor;" +
"}";

//80s colors
const magenta_color = [1,0,1];
const yellow_color = [1,1,0];
const cyan_color = [0,1,1]; 

//halloween colors
const orange_color = [1,0.65,0];
const brown_color = [.58,.29,0];
const lime_green = [0,1,0];

let gl;
let gl_prog;
let canvas;
const N_DIM = 3;    // 2D homogeneous coordinates
let unif_vcolor;
let width, height;


// for animation
let FRAME_COUNT = 0;
let TOTAL_FRAMES = 2000;
let FPS = 60;
let FPS_INTERVAL = 100/FPS;
let then = Date.now();          //date is built in javascript to get date and time.

let id;