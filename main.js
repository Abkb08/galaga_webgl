// import { circle } from './circle.js'

// variables for player x and y, which also determine bullet x and y
let cooldown = false;
const p = new player(playerx,playery,40,magenta_color,-1,-1,1,1,1);
// ----- OLD CIRCLE ENEMY CLASS -----
// for(let i = 100; i <= 500; i += 100){
//     enemy_map.push(new enemy(i, 200, 25, orange_color, enemy_xdir, 
//                         enemy_ydir, enemy_xspeed, enemy_yspeed));
// }


// ----- OLD WAY OF SPAWNING ENEMIES (WORKING) -- MOVED TO SPAWN_ENEMIES FUNCTION -----
// for(let i = 0; i < num_columns; i++) {
//     for(let j=0; j<num_rows; j++) {
//         enemy_map.push(new enemy(i, j, enemy_radius, orange_color));
//     }
// }
// let f = new Formation(enemy_map, 50, 100, 1);

// let e = new enemy(300,200,20,orange_color,-1,-1,1,1,1);

const projectiles = [];
const enemy_projectiles = [];
//initialized Formation
let f;
let enemy_map = [];

function spawn_enemies() {
    for(let i = 0; i < num_columns; i++) {
        for(let j=0; j<num_rows; j++) {
            enemy_map.push(new enemy(i, j, enemy_radius, orange_color));
        }
    }
    f = new Formation(enemy_map, form_x, form_y, 1);
    f.draw_enemies();
}
//let string = ("Score: ", player_score);

// start screen
function start_screen(){
    c.fillStyle = "yellow";
    c.font = "50px Fantasy";
    c.fillText("in a", 150, 230);
    c.font = "80px Fantasy";
    c.fillText("GALAXY", 300, 300);
}
// score text draw...
function draw_text(){
    c.fillStyle = "yellow";
    c.font = "15px Arial";
    c.fillText("Score: ", 500, 550);
    c.fillText(player_score, 550, 550);
}

// 
function remove_proj(){

}

function game_over(){
    cancelAnimationFrame(id);
    gl.clear(gl.COLOR_BUFFER_BIT);
   // c.clearRect(0,0, canvas.width, canvas.height);
    // insert text
    c.clearRect(0,0,p_canvas.width, p_canvas.height);
    c.fillStyle = "yellow";
    c.font = "30px Arial";
    c.fillText("Game Over",225, 250);
}

function animate_enemies() {
    id = requestAnimationFrame(animate_enemies);
    let now = Date.now()
    let elapsed = now - then;
    if (elapsed > FPS_INTERVAL || FRAME_COUNT == 0) {
        then = now - (elapsed % FPS_INTERVAL);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(let e of enemy_map) {
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    c.clearRect(0,0, canvas.width, canvas.height);
    spawn_enemies();
    animate();
}

function stop_anime() {
    console.log("stop");
    cancelAnimationFrame(id);
}

function animate(){
    // console.log("Animating...");
    id = requestAnimationFrame(animate);

    // CLEARING BOTH CANVASES
    gl.clear(gl.COLOR_BUFFER_BIT);
    c.clearRect(0,0, canvas.width, canvas.height);

    // DRAWING ENEMIES, PLAYER, PROJECTILES
    f.draw_enemies();
    p.draw();
    f.move();
    f.draw_enemies();
    draw_text();
    
    projectiles.forEach(projectile => {
        projectile.update();
    })  
    // ENEMIES SHOOTING PROJECTILES
    /*enemy_map.forEach((enemy) => {
    enemy_projectiles.forEach(projectile => {
        if (Formation.enemy_list[0][i] == 0){

            projectile.update();
        }
    })
}
)*/
    // score console log check
    // console.log("Player Score: ", player_score);

    // COLLISION DETECTION! B/W ENEMY AND PROJECTILE
    enemy_map.forEach((enemy, index)=>{
        projectiles.forEach((projectile, proj_index) => {

        // calculate distance between enemy and projectile using centers
        calc1 = Math.pow((enemy.getr() - projectile.getr()),2);
        calc2 = Math.pow((enemy.getx()-projectile.getx()),2) + Math.pow((enemy.gety()-projectile.gety()),2);
        calc3 = Math.pow((enemy.getr() + projectile.getr()),2);

        if (calc1 <= calc2 && calc2 <= calc3 && enemy.alive == true) {
            console.log("Enemy Hit!");
            enemy.alive = false;
            projectiles.splice(proj_index, 1);          // pop current index from projectiles
            player_score = player_score + 50;           // player score increment
        }  
        })
    })  // end of collision detection b/w enemy and projectile


    // COLLISION DETECTION! B/W ENEMY AND PLAYER (functional)
    // player loses a life / game over
    enemy_map.forEach((enemy, index)=>{
        /*const dist = Math.hypot(p.centerx - enemy.centerx, 
            p.centery - enemy.centery);
        // incorporate radiuses to accurately check collision
        if (dist - enemy.radius - p.radius < 1)
        {
            console.log("Enemy&Player collide!");
            enemy_map.splice(index, 1);             // pop current index from enemy_map (enemies)
            stop_anime();

            game_over();
        } */
        calc1 = Math.pow((enemy.getr() - p.getr()),2);
        calc2 = Math.pow((enemy.getx()-p.getx()),2) + Math.pow((enemy.gety()-p.gety()),2);
        calc3 = Math.pow((enemy.getr() + p.getr()),2);
        if (calc1 <= calc2 && calc2 <= calc3 && enemy.alive == true) {
            console.log("Enemy&Player collide!");
            stop_anime();
            game_over();
        }  
    })  // end of collision b/w enemy and player

    if(!f.check_alive()) {
        console.log("Enemies are all dead");
    }

}// end of animate()

// PLAYER MOVEMENT - left and right
// key events: keydown, keyup, keypress
document.addEventListener('keydown',
    function(event) {
        switch (event.key) {
            case 'a' :
                p.move_x(-7);
                gl.clear(gl.COLOR_BUFFER_BIT);
                p.draw();
                break;
            case 'd' :
                p.move_x(7);
                gl.clear(gl.COLOR_BUFFER_BIT);
                p.draw();
                break;
            // projectiles shooting up
            case 'w':
                console.log("Bullet shot!");
                /* trying to add some delay...
                setTimeout(()=>{
                    console.log("Waited 3 seconds!");}
                    , 3000);
                */
                const move = {
                    x: 0, y: -5
                }
                if (cooldown == false){
                    projectiles.push(new Projectile(
                        playerx,
                        playery,
                        5, 
                        'red',
                        move
                    ))
                cooldown = true;
                setTimeout(() => cooldown = false, 500);

                }
                // testing adding projectiles for enemies
                const move2 = {
                    x: 0, y: 5
                }
                enemy_map.forEach((enemy, index)=>{
                enemy_projectiles.push(new Projectile(
                    enemy.getx(),
                    enemy.gety(),
                    5, 
                    'red',
                    move2
                ))
            })    
                break;
        }
    }
)
function main() {
    init_gl();
    //p.speak();
    //p.spawn();
    // e.speak();
    // e.draw();
    // animate_circle();
    // ----- OLD ENEMY CLASS DRAW
    // for(let e of enemy_map) {
    //     e.draw();
    // }
    // f.draw_enemies();
    // animate_enemies();
    // animate();
    // f.hello();
    start_screen();
}   

main();