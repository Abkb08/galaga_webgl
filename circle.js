"use strict";

// export class circle {
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

    

    // draw() {
    //     let rad, circx, circy, xyc;
    //     for(let d = 0; d < 360; d +=1) {
    //         rad = d*Math.PI/180;
    //         circx = this.radius*Math.cos(rad) + this.centerx;
    //         circy = this.radius*Math.sin(rad) + this.centery;
    //         xyc = to_clip_coord(circx,circy);
    //         draw_point(xyc, this.color);
    //     }
    // }

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
        if( (this.centerx - this.radius <= 0) ||
            (this.centerx + this.radius >= width))
            this.xdir = -this.xdir;
        
        if( (this.centery - this.radius <= 0) ||
            (this.centery + this.radius >= height))
            this.ydir = -this.ydir;

        this.centerx += this.xdir * this.xspeed;
        this.centery += this.ydir * this.yspeed;
    }

    move_x(x) {
        this.centerx += x;
    }
    move_y(y) {
        this.centery += y;
    }

    getx() { return this.centerx; }
    gety() { return this.centery; }
    getr() { return this.radius; }
}