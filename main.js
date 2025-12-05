// import { circle } from './circle.js'

let player_score = 0; let player_lives = 3;

let row_1 = [];
// variables for player x and y, which also determine bullet x and y
let playerx = 300;
let playery = 500;
const p = new player(playerx,playery,40,magenta_color,-1,-1,1,1,1);
// ----- OLD CIRCLE ENEMY CLASS -----
// for(let i = 100; i <= 500; i += 100){
//     row_1.push(new enemy(i, 200, 25, orange_color, enemy_xdir, 
//                         enemy_ydir, enemy_xspeed, enemy_yspeed));
// }
for(let i = 0; i < num_columns; i++) {
    for(let j=0; j<num_rows; j++) {
        row_1.push(new enemy(i, j, enemy_radius, orange_color));
    }
}

let f = new formation(row_1, 50, 100, 1);

// let e = new enemy(300,200,20,orange_color,-1,-1,1,1,1);

const projectiles = [];
const enemy_projectiles = [];

//let c1 = new circle(300,300,50,lime_green,-1,-1,1,1);
// let c2 = new circle(200,100,30,orange_color,1,1,2,2);
// let circles = [ c2];

// function animate_circle() {
//     // let id = requestAnimationFrame(animate_circle);
//     id = requestAnimationFrame(animate_circle);
//     let now = Date.now();
//     let elapsed = now - then;
//     if (elapsed > FPS_INTERVAL || FRAME_COUNT == 0) {
//         // check_collision();
//         then = now - (elapsed % FPS_INTERVAL);
//         gl.clear(gl.COLOR_BUFFER_BIT);
//         for(let c of circles) {
//             c.move();
//             c.draw();
//         }
//         ++FRAME_COUNT;
//     }
//     if (FRAME_COUNT == TOTAL_FRAMES) {
//         cancelAnimationFrame(id);
//     }
// }

function game_over(){
    gl.clear(gl.COLOR_BUFFER_BIT);
   // c.clearRect(0,0, canvas.width, canvas.height);
    // insert text
    c.clearRect(0,0,p_canvas.width, p_canvas.height);
    c.fillStyle = "yellow";
    c.font = "10px Arial";
    c.fillText("Game Over",225, 250);
}

function animate_enemies() {
    id = requestAnimationFrame(animate_enemies);
    let now = Date.now()
    let elapsed = now - then;
    if (elapsed > FPS_INTERVAL || FRAME_COUNT == 0) {
        then = now - (elapsed % FPS_INTERVAL);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(let e of row_1) {
            // e.move();
            e.draw();
        }
        ++FRAME_COUNT;
    }
    if (FRAME_COUNT == TOTAL_FRAMES) {
        cancelAnimationFrame(id);
    }
}

function start_anime() {
    console.log("start");
    animate();
    // animate_enemies();
}

function stop_anime() {
    console.log("stop");
    cancelAnimationFrame(id);
}

function animate(){
    console.log("Animating...");
    id = requestAnimationFrame(animate);

    // clearing both Canvases
    gl.clear(gl.COLOR_BUFFER_BIT);
    c.clearRect(0,0, canvas.width, canvas.height);

    // drawing enemies, player, projectiles
    f.draw_enemies();
    p.draw();
    f.move();
    f.draw_enemies();
    projectiles.forEach(projectile => {
        projectile.update();
    })  
    // make enemies shoot projectiles
  /*  const move = {
        x: 0, y: 5
    }
    enemy_projectiles.push(new Projectile(
        enemy.row_index,    
        enemy.col_index,
        5, 
        'green',
        move))
*/
    // score console log check
    console.log("Player Score: ", player_score);

    // COLLISION DETECTION! B/W ENEMY AND PROJECTILE
    row_1.forEach((enemy, index)=>{
        projectiles.forEach((projectile, proj_index) => {
        // calculate distance between enemy and projectile using centers
        const dist = Math.hypot(projectile.x - enemy.centerx,
            projectile.y - enemy.centery);
        // incorporate radiuses to accurately check collision
        if (dist - enemy.radius - projectile.radius < 1)
        {
            console.log("Enemy Hit!");
            row_1.splice(index, 1);             // pop current index from row_1 (enemies)
            projectiles.splice(proj_index, 1);  // pop current index from projectiles

            // player score increment
            player_score = player_score + 50;
        }
        })
    })  // end of collision detection b/w enemy and projectile
    // COLLISION DETECTION! B/W ENEMY AND PLAYER (nonfunctional)
   /* row_1.forEach((enemy, index)=>{
        const dist = Math.hypot(player.centerx - enemy.centerx, 
            player.centery - enemy.centery);
        // incorporate radiuses to accurately check collision
        if (dist - enemy.radius - player.radius < 1)
        {
            console.log("Enemy&Player collide!");
            row_1.splice(index, 1);             // pop current index from row_1 (enemies)
            game_over();
        }    
    })*/

}// end of animate()
// PLAYER MOVEMENT - left and right
// key events: keydown, keyup, keypress
document.addEventListener('keydown',
    function(event) {
        switch (event.key) {
            case 'a' :
                p.move_x(-5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                p.draw();
                break;
            case 'd' :
                p.move_x(5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                p.draw();
                break;
            // projectiles shooting up
            case 'w':
                console.log("Bullet shot!");
                //projectile1.draw();
                const move = {
                    x: 0, y: -5
                }
                projectiles.push(new Projectile(
                    playerx,
                    playery,
                    5, 
                    'red',
                    move
                ))
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
    p.spawn();
    // e.speak();
    // e.draw();
    // animate_circle();
    // ----- OLD ENEMY CLASS DRAW
    // for(let e of row_1) {
    //     e.draw();
    // }
    // f.draw_enemies();
    // animate_enemies();
    // animate();
    f.hello();
}   

main();