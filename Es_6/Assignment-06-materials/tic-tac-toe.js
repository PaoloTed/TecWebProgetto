let body = document.body;
let table = document.createElement("table");
table.style.width = "450px"; // Imposta la larghezza della tabella
table.style.height = "450px"; // Imposta l'altezza della tabella
table.style.borderCollapse = "collapse"; // Rimuove gli spazi tra le celle

let currentAction = "x";
let showAction  = document.createElement("h1");
showAction.setAttribute("id", "show");
showAction.innerHTML = "l'azione corrente è: " + currentAction;
let counter = 0;
body.append(showAction);

for(let i = 0; i < 3; i++) {
    let tr = document.createElement("tr");
    tr.setAttribute("id", "row" + i);
    for(let j = 0; j < 3; j++) {
        let td = document.createElement("td");
        td.setAttribute("onClick", "action(event)");
        td.setAttribute("pressed", "false");
        td.setAttribute("id", "cell" + i + "-" + j);
        td.style.width = "150px"; // Imposta la larghezza delle celle
        td.style.height = "150px"; // Imposta l'altezza delle celle
        tr.append(td);
    }
    table.append(tr);
}
body.append(table);

function action(event) {
    let cell = event.target;
    if(cell.getAttribute("pressed") === "true") 
        return;

    counter++;
    cell.innerHTML = currentAction
    cell.setAttribute("pressed", "true"); 
    
    if(checkVictory(event)) 
        return;
    checkDraw(event);

    currentAction = currentAction === "x" ? "o" : "x";
    showAction.innerHTML = "l'azione corrente è: " + currentAction;    
}

function checkDraw(event) {
    if (counter === 9) {
        alert("Pareggio!");
        document.location.reload();
    }
}

function checkVictory(event) {
    for(let i = 0; i < 3; i++) {
        let trTest = table.children[i]
        if(trTest.children[0].innerHTML === currentAction && trTest.children[1].innerHTML === currentAction && trTest.children[2].innerHTML === currentAction) {
            alert("Hai vinto! " + currentAction);
            document.location.reload();
            return true;
        }
        if(table.children[0].children[i].innerHTML === currentAction && table.children[1].children[i].innerHTML === currentAction && table.children[2].children[i].innerHTML === currentAction) {
            alert("Hai vinto! " + currentAction);
            document.location.reload();
            return true ;
        }
        if(table.children[0].children[0].innerHTML === currentAction && table.children[1].children[1].innerHTML === currentAction && table.children[2].children[2].innerHTML === currentAction) {
            alert("Hai vinto! " + currentAction);
            document.location.reload();
            return true;
        }
    }
    return false;
}
