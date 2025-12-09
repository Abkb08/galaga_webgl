// import { circle } from './circle.js'

// variables for player x and y, which also determine bullet x and y
let cooldown = false;

// player image stuff
const PLAYER_IMG = new Image();
PLAYER_IMG.src = "Sprite_map.PNG";

PLAYER_IMG.onload = () => {
    console.log("Image fully loaded:", PLAYER_IMG.width, PLAYER_IMG.height);

    // Create player after image loads
    p = new player(playerx, playery, 35, magenta_color, -1, 1, 1, 1, PLAYER_IMG);
};

const projectiles = [];
const enemy_projectiles = [];
//initialized Formation
let f;
let enemy_map = [];
let step_cooldown = false;


// to track left and right keypress better
const keys = {
    left: false,
    right: false
};

function spawn_enemies() {
    enemy_map = [];
    for(let i = 0; i < num_columns; i++) {
        for(let j=0; j<num_rows; j++) {
            enemy_map.push(new enemy(i, j, enemy_radius, orange_color));
        }
    }
    f = new Formation(enemy_map, form_x, form_y, 1);
    // f.draw_enemies();
}
//let string = ("Score: ", player_score);

// start screen
function start_screen(){
    c.fillStyle = "yellow";
    //c.font = "50px Fantasy";
    //c.fillText("in a", 150, 230);
    c.font = "100px Lucida Caveat";
    c.fillText("GALAXY", 250, 300);
}
// score text draw...
function draw_text(){
    c.fillStyle = "yellow";
    c.font = "20px Arial";
    c.fillText("SCORE: ", 400, 50);
    c.fillText(player_score, 500, 50);
}

// 
function remove_proj(){

}

function game_over(){
    cancelAnimationFrame(id);
    gl.clear(gl.COLOR_BUFFER_BIT);
    c.clearRect(0,0, canvas.width, canvas.height);
    // insert text
    c.clearRect(0,0,p_canvas.width, p_canvas.height);
    c.fillStyle = "yellow";
    c.font = "30px Arial";
    c.fillText("Game Over",225, 250);
    c.fillStyle = "yellow";
    c.font = "20px Arial";
    c.fillText("Score:",225, 280);
    c.fillText(player_score, 300, 280);
}

function start_anime() {
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // c.clearRect(0,0, canvas.width, canvas.height);
    spawn_enemies();
    animate();
}

function stop_anime() {
    console.log("stop");
    cancelAnimationFrame(id);
}

function resume(){
    id = requestAnimationFrame(animate);
}

function animate(){
    // button to be removed - start button
    document.querySelector("#Start").style.display = "none";
    // console.log("Animating...");
    id = requestAnimationFrame(animate);

    // CLEARING BOTH CANVASES
    gl.clear(gl.COLOR_BUFFER_BIT);
    c.clearRect(0,0, canvas.width, canvas.height);

    // DRAWING ENEMIES, PLAYER, PROJECTILES
    f.move();
    f.shoot();
    f.draw_enemies();
    if (keys.left)
        p.move_x(-4);
    if (keys.right)
        p.move_x(4);
    p.draw();
    p.draw_sprite(c)
    draw_text();
    
    projectiles.forEach(projectile => {
        projectile.update();
    })  
    enemy_projectiles.forEach(projectile => {
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
        if(!enemy.alive) return;

        // calculate distance between enemy and projectile using centers
        calc1 = Math.pow((enemy.getr() - projectile.getr()),2);
        calc2 = Math.pow((enemy.getx()-projectile.getx()),2) + Math.pow((enemy.gety()-projectile.gety()),2);
        calc3 = Math.pow((enemy.getr() + projectile.getr()),2);

        if (calc1 <= calc2 && calc2 <= calc3) {
            console.log("Enemy Hit!");
            enemy.alive = false;
            projectiles.splice(proj_index, 1);          // pop current index from projectiles
            player_score = player_score + 50;           // player score increment
            if(!f.check_alive()) {
                console.log("Enemies are all dead");
                setTimeout(() => {
                    f.reset();
                }, 3000); // 3000 milliseconds = 3 seconds
            }
            enemies_killed++;
            f.step_delay = Math.max(200, 600 - (enemies_killed % (num_rows * num_columns)) * 10);
            f.shot_delay = Math.max(200, 900 - (enemies_killed % (num_rows * num_columns)) * 12);
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
        if (!enemy.alive)
            return;

        calc1 = Math.pow((enemy.getr() - p.getr()),2);
        calc2 = Math.pow((enemy.getx()-p.getx()),2) + Math.pow((enemy.gety()-p.gety()),2);
        calc3 = Math.pow((enemy.getr() + p.getr()),2);
        if (calc1 <= calc2 && calc2 <= calc3) {
            console.log("Enemy&Player collide!");
            stop_anime();
            game_over();
        }  
    })  // end of collision b/w enemy and player

    // Lives check for when enemy shooting works
    if (p.lives <= 0) {
        stop_anime();
        game_over;
    }
}// end of animate()

// PLAYER MOVEMENT - left and right
// key events: keydown, keyup, keypress
document.addEventListener("keydown", e => {
    if(e.key === "a") 
        keys.left = true;
    if(e.key === "d")
        keys.right = true;
});
document.addEventListener("keyup", e =>{
    if(e.key === "a")
        keys.left = false;
    if(e.key === "d")
        keys.right = false;
    
});

document.addEventListener('keydown',
    function(event) {
        switch (event.key) {
            case 'w':
                console.log("Bullet shot!");
                const move = {
                    x: 0, y: -5
                }
                if (cooldown == false){
                    projectiles.push(new Projectile(
                        playerx+10,
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
                // enemy_map.forEach((enemy, index)=>{
                // enemy_projectiles.push(new Projectile(
                //     enemy.getx(),
                //     enemy.gety(),
                //     5, 
                //     'red',
                //     move2
                // ))
            // })    
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
    // animate();
    // f.hello();
    start_screen();
    //test_img();
}   

main();