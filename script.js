// ---VARIABLES SETUP---

// HTML elements

const combat_toggle_ELEM = document.querySelector(".combat-toggle");
const combat_status_ELEM = document.querySelector(".combat-status");
const energy_cell_img_ELEM = document.querySelector(".energy-cell-img");
const shield_boost_cooldown_ELEM = document.querySelector(".shield-boost-cooldown");
const your_shield_points_ELEM = document.querySelector(".your-shield-points");
const your_hull_points_ELEM = document.querySelector(".your-hull-points");
const your_damage_ELEM = document.querySelector(".your-damage");
const enemy_ship_name_ELEM = document.querySelector(".enemy-ship-name");
const enemy_shield_points_ELEM = document.querySelector(".enemy-shield-points");
const enemy_hull_points_ELEM = document.querySelector(".enemy-hull-points");
const enemy_damage_ELEM = document.querySelector(".enemy-damage");

// Enemy ship attribute arrays (to choose randomly from)

const enemy_factions = ["Pirate","Aur","Living Xeno"];
const enemy_names = ["Raider","Scout","Frigate","Looter","Slaughter Ship","Blood Vessel"];

// Enemy attributes

let enemy_shield_max_points = null;
let enemy_shield_damage_taken = null;
let enemy_hull_max_points = null;
let enemy_hull_damage_taken = null;
let enemy_damage_min = null;
let enemy_damage_max = null;

// Your attributes

let your_shield_max_points = null;
let your_shield_damage_taken = null;
let your_hull_max_points = null;
let your_hull_damage_taken = null;
let your_damage_min = null;
let your_damage_max = null;
let your_shield_cells = null;

// Energy Cell

let energy_cell_timer = null;

// Interval variables

let combat_interval = null;
let energy_cell_cooldown_interval = null;

// ---FUNCTIONS SETUP---

function Initialize() {

    Generate_Enemy();

    // Set player stats
    your_shield_max_points = 5000;
    your_hull_max_points = 5000;
    your_damage_min = 50;
    your_damage_max = 150;

    // We update player damage display here, since we only have to do it once
    your_damage_ELEM.innerHTML = your_damage_min + "-" + your_damage_max;

    // And then we update everything else
    Update_Display();

};

function Return_Random_Between(a,b) {
    return Math.floor(Math.random() * (b - a) + a);
};

function Generate_Enemy() {

    // Generate name
    enemy_ship_name_ELEM.innerHTML = enemy_factions[Math.floor(Math.random() * 3)] + " " + enemy_names[Math.floor(Math.random() * 6)];

    // Generate Shield between 1000 and 2500
    enemy_shield_max_points = Return_Random_Between(1000,2500);
    
    // Generate Hull between 500 and 3000
    enemy_hull_max_points = Return_Random_Between(500,3000);

    // Generate Damage, min from 1 to 50, max from 20 to 130
    enemy_damage_min = Return_Random_Between(1,50);
    if(enemy_damage_min < 20) {
        enemy_damage_max = Return_Random_Between(20,130);
    }
    else {
        enemy_damage_max = Return_Random_Between(enemy_damage_min + 1,130);
    }

    // We update enemy damage display here, since we only have to do it once per enemy

    enemy_damage_ELEM.innerHTML = enemy_damage_min + "-" + enemy_damage_max;

};

function Update_Display() {

    // Shields
    your_shield_points_ELEM.innerHTML = your_shield_max_points - your_shield_damage_taken + " (" + Math.floor(((your_shield_max_points - your_shield_damage_taken) * 100) / your_shield_max_points) + "%)";
    enemy_shield_points_ELEM.innerHTML = enemy_shield_max_points - enemy_shield_damage_taken + " (" + Math.floor(((enemy_shield_max_points - enemy_shield_damage_taken) * 100) / enemy_shield_max_points) + "%)";

    // Hull
    your_hull_points_ELEM.innerHTML = your_hull_max_points - your_hull_damage_taken + " (" + Math.floor(((your_hull_max_points - your_hull_damage_taken) * 100) / your_hull_max_points) + "%)";
    enemy_hull_points_ELEM.innerHTML = enemy_hull_max_points - enemy_hull_damage_taken + " (" + Math.floor(((enemy_hull_max_points - enemy_hull_damage_taken) * 100) / enemy_hull_max_points) + "%)";

};

function Combat_Tick() {
    
    let your_hit = 0;
    let enemy_hit = 0;

    // Player hits enemy, shield first
    your_hit = Return_Random_Between(your_damage_min,your_damage_max);
    if(your_hit > enemy_shield_max_points - enemy_shield_damage_taken) {
        your_hit = your_hit - (enemy_shield_max_points - enemy_shield_damage_taken);
        enemy_shield_damage_taken = enemy_shield_max_points;
        enemy_hull_damage_taken += your_hit;
    }
    else if(enemy_shield_max_points - enemy_shield_damage_taken == 0) {
        enemy_hull_damage_taken += your_hit;
    }
    else {
        enemy_shield_damage_taken += your_hit;
    }

    // Enemy hits player, shield first
    enemy_hit = Return_Random_Between(enemy_damage_min,enemy_damage_max);
    if(enemy_hit > your_shield_max_points - your_shield_damage_taken) {
        enemy_hit = enemy_hit - (your_shield_max_points - your_shield_damage_taken);
        your_shield_damage_taken = your_shield_max_points;
        your_hull_damage_taken += enemy_hit;
    }
    else if(your_shield_max_points - your_shield_damage_taken == 0) {
        your_hull_damage_taken += enemy_hit;
    }
    else {
        your_shield_damage_taken += enemy_hit;
    }

    // If the hull (yours or enemies') reaches zero, we stop combat

    if(your_hull_damage_taken >= your_hull_max_points) {
        your_hull_damage_taken = your_hull_max_points;
        Toggle_Combat();
    }
    else if(enemy_hull_damage_taken >= enemy_hull_max_points) {
        enemy_hull_damage_taken = enemy_hull_max_points;
        Toggle_Combat();
    }

    Update_Display();




};

function Toggle_Combat() {

    if(combat_status_ELEM.innerHTML == "Combat Inactive" && enemy_hull_damage_taken != enemy_hull_max_points && your_hull_damage_taken != your_hull_max_points){
        combat_status_ELEM.innerHTML = "Combat Active";
        combat_status_ELEM.style.color = "red";
        combat_interval = setInterval(Combat_Tick, 1000);
    }
    else {
        combat_status_ELEM.innerHTML = "Combat Inactive";
        combat_status_ELEM.style.color = "rgb(30, 189, 30)";
        clearInterval(combat_interval);
    }
    
};

function Energy_Cell() {

    if(shield_boost_cooldown_ELEM.innerHTML == "Ready"){
    energy_cell_img_ELEM.style.opacity = "20%";
    energy_cell_img_ELEM.style.border = "none";
    shield_boost_cooldown_ELEM.innerHTML = "10s";
    shield_boost_cooldown_ELEM.style.color = "red";
    shield_boost_cooldown_ELEM.style.animationName = "none";

    energy_cell_cooldown_interval = setInterval(Energy_Cell_Tick, 1000);

    energy_cell_timer = 10;

    your_shield_damage_taken -= 500;
    if(your_shield_damage_taken < 0) {
        your_shield_damage_taken = 0;
    };
    
    Update_Display();

    };
    
};

function Energy_Cell_Tick() {
    if(energy_cell_timer > 0) {
        energy_cell_timer--;
        shield_boost_cooldown_ELEM.innerHTML = energy_cell_timer + "s";
    }
    else {
        energy_cell_img_ELEM.style.opacity = null;
        energy_cell_img_ELEM.style.border = null;
        shield_boost_cooldown_ELEM.innerHTML = "Ready";
        shield_boost_cooldown_ELEM.style.color = null;
        shield_boost_cooldown_ELEM.style.animationName = null;

        clearInterval(energy_cell_cooldown_interval);
    };
};


// ---INITIALIZE---

Initialize();

// ---PLAYER INTERACTION---

combat_toggle_ELEM.addEventListener('click',Toggle_Combat);

energy_cell_img_ELEM.addEventListener('click',Energy_Cell);
