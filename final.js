"use strict";

// 2d canvas
const canv = document.querySelector('canvas');
const c = canv.getContext('2d');          // context stored in c

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


// ----- INDIVIDUAL ENEMY VARIABLES -----
let enemy_speed = 1;
let enemy_xdir = 1;
let enemy_ydir = 0;
let enemy_xspeed = 2;
let enemy_yspeed = 0;
let enemy_radius = 20;


// ----- ENEMY GROUP FORMATION VARIABLES -----
let form_x;
let form_y;
let row_index = 0;
let row_spacing = 100;
let col_index = 0;
let col_spacing = 100;
let group_position = 0;
let num_rows= 1;
let num_columns = 5;
//To edit: group_position + (row_index * row_spacing)


function create_gl_program() {
    let vs = gl.createShader(gl.VERTEX_SHADER);
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, vsc);
    gl.shaderSource(fs, fsc);
    gl.compileShader(vs);
    gl.compileShader(fs);
    gl_prog = gl.createProgram();
    gl.attachShader(gl_prog, vs);
    gl.attachShader(gl_prog, fs);
    gl.linkProgram(gl_prog);
}

function init_gl() {
    canvas = document.getElementById("webgl_canvas");
    width = canvas.width;
    height = canvas.height;
    gl = canvas.getContext("webgl");
    create_gl_program();
    gl.useProgram(gl_prog);
    
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);    

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    let attr_vpos = gl.getAttribLocation(gl_prog, "vpos");
    gl.vertexAttribPointer(attr_vpos, N_DIM, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_vpos);

    unif_vcolor = gl.getUniformLocation(gl_prog, "vcolor");
}

//canvas coordinates to lcip coordinates
function to_clip_coord(x,y) {
    let clip_x = 2 * x / width - 1;
    let clip_y = 1 - 2 * y / height;
    return [clip_x, clip_y, 1];
}

function draw_point(point,color) {
    gl.uniform4f(unif_vcolor, color[0],color[1],color[2],1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, 1); 
}



