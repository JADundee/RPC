import GameObj from "./Game";
const Game = new GameObj();

const initApp = () => {
    // all time data
    initAllTimeData();
    // update scoreboard
    updateScoreboard();
    // listen for player choice
    // listen for enter key
    // listen for play again choice
    // lock in gameboard height
    // set focus to start new game
}

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeData = () => {
    Game.setP1AllTime(parseInt(localStorage.getItem("p1AllTime")) || 0);
    Game.setCpAllTime(parseInt(localStorage.getItem("cpAllTime")) || 0);
}

const updateScoreboard = () => {
    const p1AllTimeScore = document.getElementById("p1_all_time_score");
    p1AllTimeScore.textContent = Game.getP1AllTime();
    p1AllTimeScore.ariaLabel = `Player One has ${Game.getP1AllTime()} all time wins.`;

    const cpAllTimeScore = document.getElementById("cp_all_time_score");
    cpAllTimeScore.textContent = Game.getCpAllTime();
    cpAllTimeScore.ariaLabel = `The computer has ${Game.getCpAllTime()} all time wins.`;

    const p1SessionScore = document.getElementById("cp_all_time_score");
    p1SessionScore.textContent = Game.getP1Session();
    p1SessionScore.ariaLabel = `Player One has ${Game.getP1Session()} wins this session.`;

    const cpSessionScore = document.getElementById("cp_all_time_score");
    cpSessionScore.textContent = Game.getCpSession();
    cpSessionScore.ariaLabel = `The computer has ${Game.getCpSession()} wins this session.`;
}

const listenForPlayerChoice = () => {
    const p1Images = document.querySelectorAll(".playerBoard .gameboard__square img");
    p1Images.forEach(img => {
        img.addEventListener("click", (event) => {
            if (Game.getActiveStatus()) return;
            Game.startGame();
            const playerChoice = event.target.parentElement.id;
            updateP1Message(playerChoice);
            p1Images.forEach(img => {
                if (img === event.target) {
                    img.parentElement.classList.add("selected");
                } else {
                    img.parentElement.classList.add("not-selected");
                }
            });
            // animation
        })
    })
}

const updateP1Message = (choice) => {
    let p1Message = document.getElementById("p1Message").textContent;
    p1Message += ` ${choice[0].toUpperCase()}${choice.slice[1]}!`;
    document.getElementById("p1Message").textContent = p1Message;
}