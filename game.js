const CATEGORIES = [
    {id:"maantieto", name:"Maantieto"},
    {id:"yleistieto", name:"Yleistieto"},
    {id:"historia", name:"Historia"},
    {id:"kulttuuri", name:"Kulttuuri"},
    {id:"tiede", name:"Tiede"},
    {id:"urheilu", name:"Urheilu"}
]

const BOARD_SIZE = 18;
const boardElement = document.querySelector("#board");


createBoard();

function createBoardCoordinates(){
    const coordinates = [];

    for(let column = 1; column <= 7; column += 1){
        coordinates.push({row:1, column});
    }

    for(let row = 2; row <= 4; row += 1){
        coordinates.push({row:1, column: 7});
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
        console.log(category);
        //boardElement.append(space);
    }
}