import GameObj from "./Game.js";
const Game = new GameObj();

const initApp = () => {
    initAllTimeData();
    updateScoreboard();
    listenForPlayerChoice();
    listenForEnterKey();
    listenForPlayAgain();
    lockComputerGameBoardHeight();
    document.querySelector("h1").focus();
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
            computerAnimationSequence(playerChoice);
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
        resetBoard(); 
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
    p1Message += ` ${properCase(choice)}!`;
    document.getElementById("p1Message").textContent = p1Message;
}

const computerAnimationSequence = (playerChoice) => {
    let interval = 1000;
    setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval);
    setTimeout(() => computerChoiceAnimation("cp_paper", 2), interval += 500);
    setTimeout(() => computerChoiceAnimation("cp_scissors", 3), interval += 500);
    setTimeout(() => countdownFade(), interval += 750);
    setTimeout(() => {
        deleteCountdown();
        finishGameFlow(playerChoice);
    }, interval += 1000);
    setTimeout(() => askUserToPlayAgain(), interval += 1000);

}

const computerChoiceAnimation = (elementId, number) => {
    const element = document.getElementById(elementId);
    element.firstElementChild.remove();
    const p =document.createElement("p");
    p.textContent = number;
    element.appendChild(p);
}

const countdownFade = () => {
    const countdown = document.querySelectorAll(".computerBoard .gameBoard__square p");
    countdown.forEach(el => {
        el.className = "fadeOut";
    });
}

const deleteCountdown = () => {
    const countdown = document.querySelectorAll(".computerBoard .gameBoard__square p");
    countdown.forEach(el => {
        el.remove();
    });
}

const finishGameFlow = (playerChoice) => {
    const computerChoice = getComputerChoice();
    const winner = determineWinner(playerChoice, computerChoice);
    const actionMessage = buildActionMessage(
        winner,
        playerChoice,
        computerChoice
    );
    displayActionMessage(actionMessage);
    updateAriaResult(actionMessage, winner);
    updateScoreState(winner);
    updatePersistenData(winner);
    updateScoreboard();
    // Update winner message
    // Display computer choice
}

const getComputerChoice = () => {
    const randomNumber = Math.floor(Math.random() * 3);
    const rpsArray = ["rock", "paper", "scissors"];
    return rpsArray[randomNumber];
}

const determineWinner = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) return "Tie Game.";
    if (
        playerChoice === "rock" && computerChoice === "paper" || 
        playerChoice === "paper" && computerChoice === "scissors" || 
        playerChoice === "scissors" && computerChoice === "rock"
    ) return "Computer Wins!";
    return "Player One Wins!;"
}

const buildActionMessage = (winner, playerChoice, computerChoice) => {
    if (winner === "tie") return "Tie Game.";
    if (winner === "computer") {
        const action = getAction(computerChoice);
        return `${properCase(computerChoice)} ${action} ${properCase(playerChoice)}.`;
    } else {
        const action = getAction(playerChoice);
        return `${properCase(playerChoice)} ${action} ${properCase(computerChoice)}.`;
    }
}

const getAction = (choice) => {
    return choice === "rock" ? "smashes" : chocie === "paper" ? "covers" : "cuts";
}

const properCase = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}

const displayActionMessage = (actionMessage) => {
    const cpMessage = document.getElementById("cpMessage");
    cpMessage.textContent = actionMessage;
}

const updateAriaResult = (result, winner) => {
    const ariaResult = document.getElementById("playAgain");
    const winMessage = 
        winner === "player"
        ? "Congratulations, you win."
        : winner === "computer" 
            ? "The computer wins."
            : "";
    ariaResult.ariaLabel = `${result} ${winMessage} Click or press enter to play again.`;
}

const updateScoreState = (winner) => {
    if (winner === "tie") return;
    winner === "computer" ? Game.cpWins() : Game.p1Wins();
}

const updatePersistenData = (winner) => {
    const store = winner === "computer" ? "cpAllTime" : "p1AllTime";
    const score = winner === "computer" ? Game.getCpAllTime() : Game.getP1AllTime();
    localStorage.setItem(store, score);
}

const askUserToPlayAgain = () => {
    const playAgain = document.getElementById("playAgain");
    playAgain.classList.toggle("hidden");
    playAgain.focus();
}

const resetBoard = () => {
    const gameSquares = document.querySelectorAll(".gameBoard div");
    gameSquares.forEach(el => {
        el.className = "gameBoard__square";
    });
    const cpSquares = document.querySelectorAll(".computerBoard .gameBoard__square");
    cpSquares.forEach(el => {
        if (el.firstElementChild) el.firstElementChild.remove();
        if (el.id === "cp_rock") createGameImage("rock", el);
        if (el.id === "cp_paper") createGameImage("paper", el);
        if (el.id === "cp_scissors") createGameImage("scissors", el);
    });
    document.getElementById("p1Message").textContent = "Player One Chooses...";
    document.getElementById("cpMessage").textContent = "Computer Chooses...";
    const ariaResult = document.getElementById("playAgain");
    ariaResult.ariaLabel = "Player One Chooses";
    document.getElementById("p1Message").focus();
    document.getElementById("playAgain").classList.toggle("hidden");
    Game.endGame();
}

const createGameImage = (icon, appendToElement) => {
    const image = document.createElement("img");
    image.src = `img/${icon}.png`;
    image.alt = icon;
    appendToElement.appendChild(image);
}