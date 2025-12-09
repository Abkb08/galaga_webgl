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

        // this.img = new Image();
        // this.img.src = img;
        // this.loaded = false;
        // this.img.onload = () => { this.loaded = true; };


        this.unitCircle=[];
        for (let d=0; d<360; d+=1) {
            let r = d * Math.PI / 180;
            this.unitCircle.push(Math.cos(r), Math.sin(r));
        }
    }
    // for image

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

    //     if(!this.loaded) return; // skip if image not ready
    //     // sprite drawing
    //     c.drawImage(this.img,
    //                 23, 43, 50, 50,        // source
    //                 playerx, playery, 50, 50);               // destination
                    
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
        playerx +=x;
    }
    move_y(y) {
        this.centery += y;
        playery +=y;
    }

    check_collision() {
        // checking with edge of the canvas
        if( (this.centerx - this.radius <= 0 || this.centerx + this.radius >= 600) ||
            (this.centerx + this.radius >= width)) {
            return true;
        }
        if( (this.centery - this.radius <= 0) ||
            (this.centery + this.radius >= height)){
            return false;
        }
    }

    getx() { return this.centerx; }
    gety() { return this.centery; }
    getr() { return this.radius; }
}

// child - player class
class player extends circle {
    constructor(centerx,centery,radius,color,
        xdir, ydir, xspeed, yspeed, img){
        super(centerx,centery,radius,color,
            xdir,ydir, xspeed, yspeed);
        // ----- SET VARIABLES -----
       // console.log("img parameter in constructor =", img);
        this.ydir = 0;
        this.yspeed = 0;

        this.img = img;
        this.loaded = this.img.complete && this.img.naturalWidth > 0;
        
    }
    draw_hitbox(){
        super.draw();
    }
    draw_sprite(c){
        console.log("Hello from player!")
        // sprite drawing
        const destWidth = 75;
        const destHeight = 150;
        const drawX = this.centerx - destWidth / 2.85;
        const drawY = this.centery - destHeight / 3.5;
        c.drawImage(this.img,
                    0, 0, 190, 250,        // source
                    drawX, drawY, destWidth, destHeight);               // destination
                    
    }

}
// child - enemy class
class enemy extends circle {
    constructor(row_index, col_index, radius, color) {
        super(0,0,radius,color,0,0,0,0);

        this.row_index = row_index;
        this.col_index = col_index;

        this.offsetx = this.row_index * row_spacing;
        this.offsety = this.col_index * col_spacing;

        this.alive = true;
    }

    draw_from_Formation(Formation) {
        this.centerx = Formation.form_x + this.offsetx;
        this.centery = Formation.form_y + this.offsety;
        this.draw();
    }
    
    speak() {
        console.log("Hello from enemy!")
    }
    }


class Formation {
    constructor(enemy_list, form_x, form_y, xdir) {
        this.enemy_list = enemy_list;
        this.base_x = form_x;       //to reset x var of Formation
        this.base_y = form_y;       //to reset y var of Formation
        this.form_x = form_x;       //x position of Formation (updated with movement)
        this.form_y = form_y;       //y position of Formation (updated with movement)
        this.xdir = xdir;
        this.min_offset_x = 0;
        this.min_offset_y = 0;
        this.max_offset_x = 0;
        this.max_offset_y = 0;
        this.speed = enemy_speed;

        // For stepping rather than smooth movement
        this.last_step = Date.now()
        this.step_delay = 600        //400 milliseconds
        this.step_distance = 8
    }

    calcOffset() {
        this.min_offset_x = Infinity;
        this.max_offset_x = -Infinity;

        for(let e of this.enemy_list) {
            if(!e.alive) continue;

            if(e.offsetx < this.min_offset_x) {
                this.min_offset_x = e.offsetx;
            }
            if(e.offsetx > this.max_offset_x) {
                this.max_offset_x = e.offsetx;
            }
        }
    }
   
    draw_enemies() {
        for(let e of this.enemy_list) {
            if (e.alive == true) {
                e.draw_from_Formation(this);
            }
        }
    }
    
    move() {
        let current_time = Date.now()
        if(current_time - this.last_step < this.step_delay)
            return;
        this.last_step = current_time;
        this.calcOffset();

        let left = this.form_x + this.min_offset_x - enemy_radius;
        let right = this.form_x + this.max_offset_x + enemy_radius;
        
        // Code to make formation bounce on edge hit
        if(left <= 0 || right >= width) {
            this.xdir = -this.xdir;
            this.form_y += 30;
            this.speed += 0.4;
        }
        // Old way: consistent smooth movement
        // this.form_x += this.xdir * this.speed;

        // New way: stepping
        this.form_x += this.xdir * this.step_distance;
        // this.step_delay = max(200, 600 - enemies_killed  * 10)
    }

    hello() {
        console.log("Hello from Formation!");
        console.log(this.min_offset_x + "," + this.max_offset_x);
    }
    
    check_alive() {
        let ret = false;
        for(let e of this.enemy_list) {
            if(e.alive == true) {
                ret = true;
            }
        }
        return ret;
        

    }

    reset() {
        this.form_x = form_x;
        this.form_y = form_y;
        this.xdir = 1;
        this.speed = enemy_speed;
        this.enemy_list.forEach((enemy, index) => {
            enemy.alive = true;
        });
    }
}

// projectile class
class Projectile{
    constructor(x,y,radius,color, move){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.move = move;
    }
    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update(){
        this.draw();
        this.x = this.x + this.move.x;
        this.y = this.y + this.move.y;
    }
    getx(){
        return this.x;
    }
    gety(){
        return this.y;
    }
    getr(){
        return this.radius;
    }
}