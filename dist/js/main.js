import GameObj from "./Game";
const Game = new GameObj();

const initApp = () => {
    // all time data
    initAllTimeData();
    // update scoreboard
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

