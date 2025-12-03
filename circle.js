"use strict";
// parent - mother class
class circle {
    constructor(centerx,centery,radius, color, xdir, ydir, xspeed, yspeed) {
        this.radius = radius;
        this.centerx = centerx;
        this.centery = centery;
        this.color = color;
        this.xdir = xdir;
        this.ydir = ydir;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.unitCircle=[];
        for (let d=0; d<360; d+=1) {
            let r = d * Math.PI / 180;
            this.unitCircle.push(Math.cos(r), Math.sin(r));
        }
    }
    draw() {
        let pts = new Float32Array(360 * 3); // (x,y,1)
        for (let i=0; i<360; i++) {
            let ux = this.unitCircle[i * 2];
            let uy = this.unitCircle[i*2+1];

            let x = this.centerx + this.radius * ux;
            let y = this.centery + this.radius * uy;

            let clip = to_clip_coord(x,y);
            pts[i*3] = clip[0];
            pts[i*3+1] = clip[1];
            pts[i*3+2] = 1;
        }
        gl.uniform4f(unif_vcolor, this.color[0], this.color[1], this.color[2], 1);
        gl.bufferData(gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW);

        //one draw cell
        gl.drawArrays(gl.POINTS, 0, 360);
    }

    move() {
        // if(this.centerx == 0)
        //     this.xdir = -this.xdir;     //add this to radius to get edge
        // if(this.centery== 0)
        //     this.ydir = -this.ydir;

        // ----- CHECKING FOR EDGE TOUCHING -----
        if( (this.centerx - this.radius <= 0 || this.centerx + this.radius >= 600) ||
            (this.centerx + this.radius >= width)) {
            this.xdir = -this.xdir;
            this.centery = this.centery + 30;
        }
        if( (this.centery - this.radius <= 0) ||
            (this.centery + this.radius >= height)) {
            this.ydir = -this.ydir;
        }

        // ----- SHIFTING CENTER -----
        this.centerx += this.xdir * this.xspeed;
        this.centery += this.ydir * this.yspeed;
    }

    move_x(x) {
        this.centerx += x;
    }
    move_y(y) {
        this.centery += y;
    }

    check_collision() {
        if( (this.centerx - this.radius <= 0 || this.centerx + this.radius >= 600) ||
            (this.centerx + this.radius >= width)) {
            return true;
        }
        if( (this.centery - this.radius <= 0) ||
            (this.centery + this.radius >= height)) {
            return false;
        }
    }

    getx() { return this.centerx; }
    gety() { return this.centery; }
    getr() { return this.radius; }
}

// Notes:
// bdir - bullet direction. 
// bspeed is set and consistent for both enemy and player

// child - player class
class player extends circle {
    constructor(centerx,centery,radius,color,
        xdir, ydir, xspeed, yspeed){
        super(centerx,centery,radius,color,
            xdir,xspeed);
        // ----- SET VARIABLES -----
        this.bdir = 1;      // bullet direction
        this.bspeed = 5;    // bullet speed
        ydir = 0;
        yspeed = 0;
    }
    speak(){
        console.log("Hello from player!")
    }
    spawn(){
       p.draw(); 
    }
}

// child - enemy class
class enemy extends circle {
    // constructor(centerx, centery, radius, color, xdir, ydir, xspeed, yspeed) {
    //     // super(centerx, centery, radius, color, xdir, ydir, xspeed, yspeed);
    //     super(centerx, centery, radius, color, xspeed, yspeed);
    //     this.row_index = centerx;
    //     this.col_index = centery;
    //     this.xdir = xdir;
    //     this.ydir = ydir;
    //     this.offsetx = form_x + (this.row_index * row_spacing);
    //     this.offsety = form_y + (this.col_index * col_spacing);
    //     this.centerx += this.offsetx;
    //     this.centery += this.offsety;
    //     this.bdir = -1
    //     this.bspeed = -5;
    //     this.alive = true;
    // }
    constructor(row_index, col_index, radius, color) {
        super(0,0,radius,color,0,0,0,0);

        this.row_index = row_index;
        this.col_index = col_index;

        this.offsetx = this.row_index * row_spacing;
        this.offsety = this.col_index * col_spacing;

        this.alive = true;
    }
    draw_from_formation(formation) {
        this.centerx = formation.form_x + this.offsetx;
        this.centery = formation.form_y + this.offsety;
        this.draw();
    }
    speak() {
        console.log("Hello from enemy!")
    }
}

class formation {
    constructor(enemy_list, form_x, form_y, xdir) {
        this.enemy_list = enemy_list;
        this.form_x = form_x;
        this.form_y = form_y;
        this.xdir = xdir;
        // this.minOffsetX = this.enemy_list[0][0].centerx - this.enemy_list[0][0].radius;
        // this.minOffsetY = this.enemy_list[0][0].centery - this.enemy_list[0][0].radius;
    }

    calc_x_offset() {
        for(let e of this.enemy_list) {
            this.minOffsetX = Math.min(this.minOffsetX, e.offsetx);
        }
    }
    calc_y_offset() {
        for(let e of this.enemy_list) {
            this.minOffsetY = min(this.minOffsetY, e.offsety);
        }
    }

    draw_enemies() {
        for(let e of this.enemy_list) {
            if (e.alive == true) {
                e.draw_from_formation(this);
            }
        }
    }

    // check_collision() {
    //     if(this.minOffsetX <= 0 || this.minOffsetX >= width) {
    //         this.form_y -= 30;
    //         this.xdir = -this.xdir;
    //     }
    // }
    hello() {
        console.log("Hello from formation!");
    }
}

class formation {
    constructor(enemy_list, form_x, form_y, xdir) {
        this.enemy_list = enemy_list;
        this.form_x = form_x;
        this.form_y = form_y;
        this.xdir = xdir;
        // this.minOffsetX = this.enemy_list[0][0].centerx - this.enemy_list[0][0].radius;
        // this.minOffsetY = this.enemy_list[0][0].centery - this.enemy_list[0][0].radius;
    }

    calc_x_offset() {
        for(let e of this.enemy_list) {
            this.minOffsetX = Math.min(this.minOffsetX, e.offsetx);
        }
    }
    calc_y_offset() {
        for(let e of this.enemy_list) {
            this.minOffsetY = min(this.minOffsetY, e.offsety);
        }
    }

    draw_enemies() {
        for(let e of this.enemy_list) {
            if (e.alive == true) {
                e.draw_from_formation(this);
            }
        }
    }

    // check_collision() {
    //     if(this.minOffsetX <= 0 || this.minOffsetX >= width) {
    //         this.form_y -= 30;
    //         this.xdir = -this.xdir;
    //     }
    // }
    hello() {
        console.log("Hello from formation!");
    }
}