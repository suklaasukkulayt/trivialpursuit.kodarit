const CATEGORIES = [
    {id:"maantieto", name:"Geography"},
    {id:"yleistieto", name:"General knowledge"},
    {id:"historia", name:"History"},
    {id:"taide ja kulttuuri", name:"Art and culture"},
    {id:"tiede", name:"Science"},
    {id:"urheilu", name:"Sports"}
]

const BOARD_SIZE = 18;

const API_URL = "https://oma-trivia-api-0f8ffa1eed2e.herokuapp.com/api/questions";

const boardElement = document.querySelector("#board");
const diceElement = document.querySelector("#dice");
const questionText = document.querySelector("#question-text");
const categoryText = document.querySelector("#category-text");
const answersElement = document.querySelector("#answers");
const gameState = {
    player: {
        name: "Player",
        position:0,
    }
};

diceElement.addEventListener("click", rollDice);


createBoard();
updateTokens();

function createBoardCoordinates(){
    const coordinates = [];

    for(let column = 1; column <= 7; column += 1){
        coordinates.push({row:1, column});
    }

    for(let row = 2; row <= 4; row += 1){
        coordinates.push({row, column: 7});
    }

    for(let column = 6; column >= 1; column -= 1){
        coordinates.push({row:4, column});
    }

    for(let row = 3; row >= 2; row -= 1){
        coordinates.push({row, column: 1});
    }

    console.log(coordinates);
    return coordinates;
}

function createBoard(){
    const coordinates = createBoardCoordinates();

    for(let index = 0; index < BOARD_SIZE; index +=1){
        
        const category = CATEGORIES[index % CATEGORIES.length];
        const coordinate = coordinates[index];
        const space = document.createElement("div");
        space.className = "space";
        space.dataset.spaceIndex = index;

        space.style.gridColumn = coordinate.column;
        space.style.gridRow = coordinate.row;
        space.dataset.category = category.id;
        space.textContent = category.name;
        boardElement.append(space);
    }
}

function updateTokens() {
    document.querySelectorAll(".token").forEach((token) => {
        token.remove();
    });
    const currentSpace = document.querySelector(`[data-space-index = "${gameState.player.position}"]`);
    const token = document.createElement("span");

    token.className = "token player-token";
    token.textContent = "P";
    currentSpace.append(token);
}

async function rollDice(){
    diceElement.inert = true;
    console.log("Rolled dice! :O");
    const result = Math.floor(Math.random() * 6) + 1;
    console.log(result);

    for (let roll = 0; roll < 10; roll += 1) {
        diceElement.textContent = Math.floor(Math.random() * 6) + 1;
        await new Promise(resolve => setTimeout(resolve, 80));
    }

    diceElement.textContent = result;
    await new Promise(resolve => setTimeout(resolve, 300));
    await movePlayer(result);
}

async function movePlayer(steps){
    diceElement.inert = true;
    questionText.textContent = "Generating question..."
    const player = gameState.player;
    let category = getCategoryAtPosition(player.position);;

    for (let stepsMoved = 0; stepsMoved < steps; stepsMoved += 1) {
        player.position = (player.position + 1) % BOARD_SIZE;
        updateTokens();
        category = getCategoryAtPosition(player.position);
        console.log(category);
        categoryText.textContent = category.name;

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    try {
        const question = await fetchQuestion(category.id);
        console.log(question);
        showQuestion(question, category);
        
    } catch(error) {
        console.log(error);
        questionText.textContent = "ABORT MISSION: " + error + " (Question load failed!)";
    }
    diceElement.inert = false;
}

function showQuestion(question, category){
    questionText.textContent = question.question;

    question.answers.forEach((answer, index)=>{
        const button = document.createElement("button");
        answersElement.append(button);
        button.textContent = answer;
    });
}

function getCategoryAtPosition(position){
    return CATEGORIES[position % CATEGORIES.length];
}

const difficultySelect = document.getElementById("difficulty");

async function fetchQuestion(category) {
    const response = await fetch(API_URL,{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            category: category,
            difficulty: difficultySelect.value,
            ageGroup: "10-12",
            count: 1,
            language: "englanti"
        })
    });

    if(!response.ok){
        questionText.textContent = `Question search failed with error: ${response.status}`;
        diceElement.inert = false;
        throw new Error(
            `Question search failed with error: (${response.status})`
        );
    }

    const data = await response.json();
    console.log(data);

    return data.questions[0];
}