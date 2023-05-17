import GameObj from "./Game.js";
const Game = new GameObj();

const initApp = () => {
    // all time data
    initAllTimeData();
    // update scoreboard
    updateScoreboard();
    // listen for player choice
    listenForPlayerChoice();
    // listen for enter key
    listenForEnterKey();
    // listen for play again choice
    listenForPlayAgain();
    // lock in gameboard height
    lockComputerGameBoardHeight();
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
    const p1Images = document.querySelectorAll(".playerBoard .gameBoard__square img");
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

const listenForEnterKey = () => {
    window.addEventListener("keydown", (event) => {
        if (event.code === "Enter" && event.target.tagName === "IMG") {
            event.target.click();
        }
    });
}

const listenForPlayAgain = () => {
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        resetBoard(); //TODO:
    });
}

const lockComputerGameBoardHeight = () => {
    const cpGameBoard = document.querySelector(".computerBoard .gameBoard");
    const cpGameBoardStyles = getComputedStyle(cpGameBoard);
    const height = cpGameBoardStyles.getPropertyValue("height");
    cpGameBoard.style.minHeight = height;
}

const updateP1Message = (choice) => {
    let p1Message = document.getElementById("p1Message").textContent;
    p1Message += ` ${choice[0].toUpperCase()}${choice.slice(1)}!`;
    document.getElementById("p1Message").textContent = p1Message;
}