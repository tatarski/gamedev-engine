// 0. Suzdavame promenlivi
let myX,
    myY;

function init() {
    // 1. Kodut tuk se izpulnqva vednuj - predi draw ili update
    myX = 300;
    myY = 300;
}
function update() {
    // 2. Kodut tuk se izpulnqva 100 puti v sekunda
    myX = myX + (mouseX - myX) / 10;
    myY = myY + (mouseY - myY) / 10;
}

function draw() {
    // 3. Tuk naprogramirai kakvo da se risuva
    drawImage(backDesert, 0, 0, 800, 600);
    drawImage(femaleAction, myX, myY, 60, 80);
}

function keyup(key) {
    // 4. Pechatai koda na natisnatiq klavish
    console.log("Pressed", key);
}

function mouseup() {
    // 5. Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
}
