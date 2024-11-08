import Dinosaurdle from "./Dinosaurdle.js";
import {WORDS} from "./words.js";

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-modal-close]");
const closeWinPopup = document.querySelectorAll("[data-modal-close]");
const closeDinoPopup = document.querySelectorAll("[data-modal-close]");
const closeLosePopup = document.querySelectorAll("[data-modal-close]");
const overlay = document.getElementById("overlay");
const overlay1 = document.getElementById("overlay1");
const overlay2 = document.getElementById("overlay2");
const overlay3 = document.getElementById("overlay3");
const winbox = document.getElementById("win");
const dinobox = document.getElementById("dino_win");
const lostbox = document.getElementById("lost");

openModalButtons.forEach(function(button){
    button.addEventListener("click",function(){
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    });
});

closeModalButtons.forEach(function(button){
    button.addEventListener("click",function(){
        const modal = button.closest(".instruction");
        closeModal(modal);
    });
});

closeWinPopup.forEach(function(button){
    button.addEventListener("click",function(){
        const modal = button.closest(".win");
        closeWin(modal);
    });
});

closeDinoPopup.forEach(function(button){
    button.addEventListener("click",function(){
        const modal = button.closest(".dino_win");
        closeDino(modal);
    });
});

closeLosePopup.forEach(function(button){
    button.addEventListener("click",function(){
        const modal = button.closest(".lost");
        closeLose(modal);
    });
});

function openModal(modal){
    if (modal == null){
        return;
    }
    modal.classList.add("active");
    overlay.classList.add("active");
}

function closeModal(modal){
    if (modal == null){
        return;
    }
    modal.classList.remove("active");
    overlay.classList.remove("active");
}

function closeWin(modal){
    if (modal == null){
        return;
    }
    modal.classList.remove("active");
    overlay1.classList.remove("active");
}

function closeLose(modal){
    if (modal == null){
        return;
    }
    modal.classList.remove("active");
    overlay3.classList.remove("active");
}

function closeDino(modal){
    if (modal == null){
        return;
    }
    modal.classList.remove("active");
    overlay2.classList.remove("active");
}

overlay.addEventListener("click",function(){
    const modals = document.querySelectorAll(".instructions.active");
    modals.forEach(function(modal){
        closeModal(modal);
    });
});

overlay1.addEventListener("click",function(){
    const modals = document.querySelectorAll(".instructions.active");
    modals.forEach(function(modal){
        closeWin(modal);
    });
});

overlay2.addEventListener("click",function(){
    const modals = document.querySelectorAll(".instructions.active");
    modals.forEach(function(modal){
        closeDino(modal);
    });
});

overlay3.addEventListener("click",function(){
    const modals = document.querySelectorAll(".instructions.active");
    modals.forEach(function(modal){
        closeLose(modal);
    });
});

function showNotification({top = 0, left = 0, html}){
    let notification = document.createElement("div");
    notification.className = "notification";
    notification.style.top = top + "%";
    notification.style.left = left + "%";
    notification.innerHTML = html;
    document.body.append(notification);

    setTimeout(function(){
        notification.remove();
    },3000);
}

const game_state = {
    answer: WORDS[Math.floor(Math.random()*WORDS.length)],
    word_board: Dinosaurdle.emptyBoard(),
    number_board: Dinosaurdle.emptyBoard(),
    currentRow: 0,
    currentCol: 0,
    game_con: false,
    score: 0,
    wins: 0,
    dinosaur_score: 0
};

setInterval(function(){
    let newDinoScore = Dinosaurdle.dinoScore(game_state);
    newDinoScore = game_state.dinosaur_score;
    updateDinoProgressBar(game_state.dinosaur_score);
    if (game_state.dinosaur_score >= 100){
        goodGame();
    }
},1000);

const button_list = ["q","w","e","r","t","y","u","i","o","p",
"a","s","d","f","g","h","j","k","l","z","x","c","v","b","n",
"m"];

function drawBox(container, row, col, letter = ""){
    const box = document.createElement("div");
    box.className = "box";
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement("div");
    grid.className = "grid";
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function keyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (Dinosaurdle.isLetter(key)){
            addLetter(key);
        }
        if (key === "Backspace"){
            removeLetter();
        }
        if (key === "Enter"){
            if (game_state.currentCol === 5){
                const word = Dinosaurdle.getCurrentWord(game_state.word_board[
                    game_state.currentRow]);
                if (Dinosaurdle.checkValid(word, WORDS)){
                    revealWord(word);
                    game_state.currentRow++;
                    game_state.currentCol = 0;
                    if (game_state.game_con === true){
                        game_state.dinosaur_score -= 30;
                        let timing = 2000;
                        setTimeout(function(){
                            gameWon();
                        },timing);
                    }
                    if (game_state.currentRow === 6 && game_state.game_con
                         === false){
                        goodGame();
                    }
                }
                else {
                    showNotification({
                        top: 12,
                        left: 50,
                        html: "GUESS IS INVALID"
                    });
                }
            }
        }
        updateGrid();
    };
}

function revealWord(word){
    let word_array = Dinosaurdle.makeArray(word);
    let answer_array = Dinosaurdle.makeArray(game_state.answer);
    let answer_map = Dinosaurdle.answerDictionary(answer_array);
    let number_array = Dinosaurdle.correctLetter(word_array, answer_array,
        answer_map);
    game_state.number_board[game_state.currentRow] = number_array;
    const row = game_state.currentRow;
    keyboardColour(word_array,number_array);
    if (Dinosaurdle.checkAnswer(word,game_state.answer)){
        colourRevealAnimated(row);
        game_state.game_con = true;
        let multiplied_score = Dinosaurdle.multiplierScore(game_state);
        game_state.score += multiplied_score;
        if (game_state.score >= 100){
            game_state.game_con = false;
            setTimeout(function(){
                goodGame();
            },2000);
        }
        updatePlayerProgressBar(game_state.score);
    }
    else {
        colourReveal(row);
        let new_score = Dinosaurdle.addUserScore(number_array);
        game_state.score += new_score;
        if (game_state.score >= 100){
            setTimeout(function(){
                goodGame();
            },2000);
        }
        updatePlayerProgressBar(game_state.score);
    }
}


function colourReveal(row){
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        if (game_state.number_board[row][i] === 2){
            box.classList.add("right");
        }
        if (game_state.number_board[row][i] === 1){
            box.classList.add("wrong");
        }
        if (game_state.number_board[row][i] === 0){
            box.classList.add("empty");
        }
    }
}

function colourRevealAnimated(row){
    const animation_duration = 700; //ms
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        setTimeout(function() {
            box.classList = ("box right");
        }, ((i + 1) * animation_duration) / 2);
        box.classList.add("animated");
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }
}

function colourDefault(row){
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        box.classList = ("box default");
    }
}

function updateGrid(){
    for (let i = 0; i < game_state.word_board.length; i++) {
        for (let j = 0; j < game_state.word_board[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = game_state.word_board[i][j];
        }
    }
}

function addLetter(letter){
    if (game_state.currentCol === 5){
        return;
    }
    game_state.word_board[game_state.currentRow]
    [game_state.currentCol] = letter;
    game_state.currentCol++;
}

function removeLetter(){
    if (game_state.currentCol===0){
        return;
    }
    game_state.word_board[game_state.currentRow]
    [game_state.currentCol - 1] = "";
    game_state.currentCol--;
}


function startup(){
    const game = document.getElementById("game");
    drawGrid(game);
    assignKeyboard();
    keyboardEvents();
}

function gameWon(){
    game_state.word_board = Dinosaurdle.emptyBoard();
    game_state.number_board = Dinosaurdle.emptyBoard();
    game_state.currentCol = 0;
    game_state.currentRow = 0;
    game_state.wins += 1;
    game_state.answer= WORDS[Math.floor(Math.random()*WORDS.length)];
    game_state.game_con = false;
    if (game_state.dinosaur_score < 0){
        game_state.dinosaur_score = 0;
    }
    updateDinoProgressBar(game_state.dinosaur_score);
    for (let j = 0; j < 6; j++) {
        colourDefault(j);
    }
    resetKeyboard();
    console.log(game_state.answer);
    updateGrid();
}

function goodGame(){
    if (game_state.currentRow === 6 && game_state.game_con
        === false){
        const lost_text = document.getElementById("word-placeholder");
        lost_text.textContent = game_state.answer;
        lostbox.classList.add("active");
        overlay3.classList.add("active");
    }
    else if (game_state.score >= 100){
        winbox.classList.add("active");
        overlay1.classList.add("active");
    }
    else if (game_state.dinosaur_score >= 100){
        const dino_text = document.getElementById("dino-placeholder");
        dino_text.textContent = game_state.answer;
        dinobox.classList.add("active");
        overlay2.classList.add("active");
    }
    game_state.word_board = Dinosaurdle.emptyBoard();
    game_state.number_board = Dinosaurdle.emptyBoard();
    game_state.currentCol = 0;
    game_state.currentRow = 0;
    game_state.game_con = false;
    game_state.score = 0;
    game_state.dinosaur_score = 0;
    game_state.wins = 0;
    for (let j = 0; j < 6; j++) {
        colourDefault(j);
    }
    resetKeyboard();
    updateDinoProgressBar(game_state.dinosaur_score);
    updatePlayerProgressBar(game_state.score);
    updateGrid();
    game_state.answer= WORDS[Math.floor(Math.random()*WORDS.length)];
    console.log(game_state.answer);
}

function keyboardColour(word_array,number_array){
    for (let i = 0; i < 5; i++) {
        let key = word_array[i];
        const button = document.getElementById(key);
        if (number_array[i] === 2){
            button.classList.remove("wrong","empty");
            button.classList.add("right");
        }
        if (number_array[i] === 1){
            if (button.className === "button right"){
                return
            }
            else{
                button.classList.remove("empty");
                button.classList.add("wrong");
            }
        }
        if (number_array[i] === 0){
            if (button.className === "button wrong" || button.className
             === "button right"){
                return
            }
            else{
                button.classList.add("empty")
            }
        }
    }
}

function resetKeyboard(){
    button_list.forEach((key) => {
        const button = document.getElementById(key)
        if (button.className === "button med" || button.className ===
         "button big"){
            return
        }
        else{
            button.className = "button"
        }
    })
}

function assignKeyboard(){
    button_list.forEach((key) => {
        const button = document.getElementById(key)
        button.onclick = function(){
            if (game_state.currentCol === 5){
                return;
            }
            game_state.word_board[game_state.currentRow]
            [game_state.currentCol] = button.id;
            game_state.currentCol++;
            updateGrid()
        }
    })
}

function keyEnter() {
    if (game_state.currentCol === 5){
        const word = Dinosaurdle.getCurrentWord(game_state.word_board
            [game_state.currentRow]);
        if (Dinosaurdle.checkValid(word, WORDS)){
            revealWord(word);
            game_state.currentRow++;
            game_state.currentCol = 0;
            if (game_state.game_con === true){
                let animation_duration = 2000; //ms;
                setTimeout(() => {
                    gameWon();
                },animation_duration);
            }
            if (game_state.currentRow === 6 && game_state.game_con
                 === false){
                setTimeout(function(){
                    goodGame();
                },2000)
            }
        }
        else {
            showNotification({
                top: 12,
                left: 50,
                html: "GUESS IS INVALID"
            });
        }
    }
}

function keyBackspace(){
    if (game_state.currentCol===0){
        return;
    }
    game_state.word_board[game_state.currentRow]
    [game_state.currentCol - 1] = "";
    game_state.currentCol--;
    updateGrid()
}

function updateDinoProgressBar(score){
    let progressElement = document.getElementById("dinosaur");
    progressElement.style.height = score + "%";
    return progressElement;
};

function updatePlayerProgressBar (score){
    let progressElement = document.getElementById("player");
    progressElement.style.height = score + "%";
    return progressElement;
};

const enter_button = document.getElementById("Enter")
enter_button.addEventListener("click",keyEnter)
const backspace_button = document.getElementById("Backspace")
backspace_button.addEventListener("click",keyBackspace)

console.log(game_state.answer)
startup();