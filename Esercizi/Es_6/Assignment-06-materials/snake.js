let body = document.body;
let table = document.createElement("table");
table.style.width = "600px"; // Imposta la larghezza della tabella
table.style.height = "600px"; // Imposta l'altezza della tabella
table.style.borderCollapse = "collapse"; // Rimuove gli spazi tra le celle

let currentScore = 0;
let score  = document.createElement("h1");
score.setAttribute("id", "show");
score.innerHTML = "il punteggio è : " + currentScore;
let counter = 0;
body.append(score);

let button = document.createElement("button");
button.setAttribute("onClick", "move(event)");
body.append(button);

for(let i = 0; i < 20; i++) {
    let tr = document.createElement("tr");
    tr.setAttribute("id", "row" + i);
    for(let j = 0; j < 20; j++) {
        let td = document.createElement("td");
        td.setAttribute("onClick", "action(event)");
        td.setAttribute("pressed", "false");
        td.setAttribute("id", "cell" + i + "-" + j);
        td.style.width = "10px"; // Imposta la larghezza delle celle
        td.style.height = "10px"; // Imposta l'altezza delle celle
        tr.append(td);
    }
    table.append(tr);
}
body.append(table);
let win = false;
let crash = false;
let snakeHeadPosition = { x: 10, y: 10 };
let snakeHead = document.getElementById("cell" + snakeHeadPosition.x + "-" + snakeHeadPosition.y);
snakeHead.style.backgroundColor = "green"; // Colore della testa del serpente

let snakeBodyPositions = [
    { x: 10, y: 11 },
    { x: 10, y: 12 },
];
let snakeBody = [document.getElementById("cell" + snakeBodyPositions[0].x + "-" + snakeBodyPositions[0].y), document.getElementById("cell" + snakeBodyPositions[1].x + "-" + snakeBodyPositions[1].y)];
snakeBody[0].style.backgroundColor = "blue"; // Colore del corpo del serpente
snakeBody[1].style.backgroundColor = "blue"; // Colore del corpo del serpente



//setInterval(move, 100); // Esegue la funzione ogni secondo
function action(event){
    if(event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }else if(event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }else if(event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    }else if(event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }
}


function move(event) {
    snakeHeadPosition = { x: snakeHeadPosition.x, y: snakeHeadPosition.y -- };
    snakeHead.style.backgroundColor = "blue"; 
    snakeBody[0] = document.getElementById("cell" + snakeHeadPosition.x + "-" + snakeHeadPosition.y);
    for(let i = snakeBody.length; i > 1; i++) {
        snakeBody[i] = snakeBody[i - 1];
        snakeBody[i].style.backgroundColor = "blue";
    }
    

    
}



