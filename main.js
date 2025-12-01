// import { circle } from './circle.js'

let p = new player(300,300,50,lime_green,-1,-1,1,1,1);
let e = new enemy(300,200,20,orange_color,-1,-1,1,1,1);
//let c1 = new circle(300,300,50,lime_green,-1,-1,1,1);
// let c2 = new circle(200,100,30,orange_color,1,1,2,2);
// let circles = [ c2];

function animate_circle() {
    // let id = requestAnimationFrame(animate_circle);
    id = requestAnimationFrame(animate_circle);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed > FPS_INTERVAL || FRAME_COUNT == 0) {
        // check_collision();
        then = now - (elapsed % FPS_INTERVAL);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(let c of circles) {
            c.move();
            c.draw();
        }
        ++FRAME_COUNT;
    }
    if (FRAME_COUNT == TOTAL_FRAMES) {
        cancelAnimationFrame(id);
    }
}

function start_anime() {
    console.log("start");
    animate_circle();
}

function stop_anime() {
    console.log("stop");
    cancelAnimationFrame(id);
}

// PLAYER MOVEMENT
// key events: keydown, keyup, keypress
document.addEventListener('keydown',
    function(event) {
        switch (event.key) {
            case 'w' :
                console.log("Keydown:",event.key);
                c1.move_y(-5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                c1.draw();
                break;
            case 's' :
                c1.move_y(5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                c1.draw();
                break;
            case 'a' :
                c1.move_x(-5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                c1.draw();
                break;
            case 'd' :
                c1.move_x(5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                c1.draw();
                break;
        }
    }
)



// c1 = (x1,y1,r1)      x1, y1 are center coords
// c2 = (x2, y2, r2)    x1, y1 are center coords
// c1 and c2 intersect if the following is true
// (r1 - r1)^2 <= ((x1-x2) ^2 + (y1-y2) ^2) <= (r1+r2) ^2
/*
function check_collision() {
    calc1 = Math.pow((c1.getr() - c2.getr()),2);
    calc2 = Math.pow((c1.getx()-c2.getx()),2) + Math.pow((c1.gety()-c2.gety()),2);
    calc3 = Math.pow((c1.getr() + c2.getr()),2);
    if (calc1 <= calc2 && calc2 <= calc3) {
        console.log("collision c1 c2!");
    }       
}
*/
function main() {
    init_gl();
    p.speak();
    p.draw();
    e.speak();
    e.draw();
    // animate_circle();
}   

main();