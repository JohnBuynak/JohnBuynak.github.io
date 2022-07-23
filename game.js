

var selectedCard;
var cardCollection = [];
var reverse = false;
var drawCount = 0;
var gameDrawNumber = 0;
var myTurn = false;
var gameStarted = false;
var mustPlayDrawTwo = false;

class Card{


    constructor(forceNumber=false, forceBlank = false){

        if(!forceBlank){

            if(!forceNumber){

                let randomNumber = Math.random();
                this.type = "";

                if(randomNumber <= 0.50){
                    this.type = "number";
                }else if(randomNumber <= 0.62){
                    this.type = "skip";
                }else if(randomNumber <= 0.74){
                    this.type = "reverse";
                }else if(randomNumber <= 0.84){
                    this.type = "draw2";
                }else if(randomNumber <= 0.94){
                    this.type = "alldraw3";
                }else{
                    this.type = "draw4";
                }
            }else{
                this.type = "number";
            }

            if(this.type != "draw4" && this.type != "alldraw3"){
                let colors = ["red","blue","green","yellow"];
                this.color = colors[getRandomInt(4)];
            }else{
                this.color = "multi";
            }

            if(this.type == "number"){
                let numbers = ["1","2","3","4","5","6","7","8","9"]
                this.type = numbers[getRandomInt(9)];
            }
        }else{
            this.type = "blank";

        }


        this.id = this.color + this.type + getRandomInt(1000);



    }

    getCard(){
        return this.color + this.type
    }
}

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function createName() {
    const prefix = randomFromArray([
    "JACKED",
    "DIRTY",
    "BASTARD",
    "BIG",
    "LAME",
    "LUMPY",
    "FAT",
    "UGLY",
    "LARDASS",
    "DUMB",
    "CHINESE",
    "TURD",
    "BITCHIN'",
    "SAGGY",
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "COOL",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
    ]);
    const animal = randomFromArray([
    "HAM",
    "TURTLE",
    "TIGER",
    "TOAD",
    "HIPPO",
    "SHIT",
    "ORC",
    "BOOB",
    "WHALE",
    "PIG",
    "FART",
    "BEAR",
    "DOG",
    "CAT",
    "FOX",
    "LAMB",
    "LION",
    "BOAR",
    "GOAT",
    "VOLE",
    "SEAL",
    "PUMA",
    "MULE",
    "BULL",
    "BIRD",
    "BUG"
    ]);
    return `${prefix} ${animal}`;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


var gameboardCard = new Card(false,true);
gameboardCard.color = "red";

/*
DOM - Document Object Model
*/

const mediaQuery = window.matchMedia('(max-width: 800px)');

function showColorPicker(){
    var x = document.getElementById("colorPicker");
    x.style.display = "block";
}

function hideColorPicker(){
    var x = document.getElementById("colorPicker");
    x.style.display = "none";
}

function updateGameCard(){
    document.getElementById("gameboardcard").src = "/images/" + gameboardCard.getCard() + ".png";

    document.getElementById("infoTag").innerHTML=`${gameStarted} ${gameboardCard.type} ${gameboardCard.color}`;
}

function removeCard(id){
    
    console.log(document.getElementById(id));
    document.getElementById("scroller").removeChild(document.getElementById(id));
    selectedCard = undefined;


    function f2(item,index){
        if(item.id == id){
            cardCollection.splice(index,1);
            //delete cardCollection[index]
        }
    }

    cardCollection.forEach(f2);
    updateCardMargins();

}

function updateCardMargins(){

    let nCards = cardCollection.length;
    let marginRight = "0px";

    
    if (mediaQuery.matches)
    {
        //smaller screen
        switch(true){
            case(nCards <= 5):
                marginRight = "5px";
                break;
            case(nCards <= 10):
                marginRight = "-20px";
                break;
            case(nCards <= 15):
                marginRight = "-30px";
                break;
            case(nCards > 15):
                marginRight = "-40px";
                break;
        }
    }
    else
    {
        //bigger screen
        switch(true){
            case(nCards <= 10):
                marginRight = "5px";
                break;
            case(nCards <= 18):
                marginRight = "-20px";
                break;
            case(nCards <= 28):
                marginRight = "-30px";
                break;
            case(nCards > 28):
                marginRight = "-40px";
                break;
        }
    }
    
    const collection =  document.getElementsByClassName("cardImage");
    
        for(let i = 0; i < collection.length; i++){
            collection[i].style.marginRight = marginRight;
            collection[i].style.top = "0px"
            collection[i].style.zIndex = i.toString();
        }
}



//TODO
//players local object ids and times
//reverse local ref to reverse db
//sort players id by time, (reverse?) find your name, get next




/*
This is a self-executing anonymous function. 
The first set of parentheses contain the expressions to be executed, 
and the second set of parentheses executes those expressions.

It is a useful construct when trying to hide variables from the parent namespace. 
All the code within the function is contained in the private scope of the function, 
meaning it can't be accessed at all from outside the function, making it truly private.

ex: (function(){})();
*/

(function(){

    let playerId; //This will be Your unique id
    let playerRef; //firebase reference to players node
    let playerGameRef; //firebase ref to you within game, initializing creates the Game node
    const gameRef = firebase.database().ref(`game`);
    const gamePlayersRef = firebase.database().ref(`game/players`); //all players

    
    let players = {}; //local list of players
    let playerElements = {}; //DOM elements for each player

    
    //DOM references
    const gameContainer = document.querySelector(".game-container");
    const playerContainer = document.querySelector("#chairs");
    const playerNameInput = document.querySelector("#player-name");


    function initGame(){
        const allPlayersRef = firebase.database().ref(`players`);
        //const gameRef = firebase.database().ref(`game`);
        //const gamePlayersRef = firebase.database().ref(`game/players`)

        function updateCCDB(){
            //updates Your cardcollection in db
            //resets draw Count
            playerGameRef.update({
                cards:cardCollection,
                drawCount:0
            });
            document.getElementById("infoTag").innerHTML=`${gameStarted} ${gameboardCard.type} ${gameboardCard.color}`;
        }


        function completeTurn(){
            //updates Your cardcollection in db
            //resets draw Count
            //turn = false
            myTurn = false;

            playerGameRef.update({
                cards:cardCollection,
                drawCount:0,
                turn:false
            });
        }

        //everyone draws three cards
        function drawThree(){
            Object.keys(players).forEach(key => {

                firebase.database().ref(`game/players/${key}`).update({
                    drawCount:3
                });
                

              });
        }


        function drawFour(){

            if(reverse){
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]}).reverse();
            }else{
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]});
            }
            
            let index = keysSorted.findIndex(id => id == playerId);
            let nextPlayerId = keysSorted[index + 1] ?? keysSorted[0];

            firebase.database().ref(`game/players/${nextPlayerId}`).update({
                drawCount:4
            });
              
        }

        //increase game drawNumber
        //increase next player drawCount
        function drawTwo(){
            
            //does next player have drawTwo?
            //yes ?
            //increase game drawNumber
            //no ?
            //increase player drawCount -> 2 + Game DrawNumber
            //increasing their drawCount directly will trigger them to Draw
            //player is skipped.


            
            if(reverse){
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]}).reverse();
            }else{
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]});
            }
            
            let index = keysSorted.findIndex(id => id == playerId);
            let nextPlayerId = keysSorted[index + 1] ?? keysSorted[0];
            let doubleDeckIndex = keysSorted.findIndex(id => id == nextPlayerId);
            let doubleDeckPlayer = keysSorted[index + 1] ?? keysSorted[0];
            
            //Update Database
            console.log(nextPlayerId );

            firebase.database().ref(`game/players/${nextPlayerId}`).get().then((snapshot) => {
                if (snapshot.exists()) {

                    let player = snapshot.val();
                    let cards = player.cards;

                    let playerHasDraw2 = false;
                    cards.forEach((card)=>{
                        if(card.type == "draw2"){
                            playerHasDraw2 = true;
                        } 
                    })

                    if(playerHasDraw2){
                        let newDrawNumber = gameDrawNumber + 2;
                        gameRef.update({
                            drawNumber:newDrawNumber,
                            mustPlayDrawTwo:true
                        });
                    }else{
                        //player doesnt have draw 2
                        let newDrawNumber = gameDrawNumber + 2;
                        firebase.database().ref(`game/players/${nextPlayerId}`).update({
                            drawCount:newDrawNumber
                        });
                        firebase.database().ref(`game/players/${doubleDeckPlayer}`).update({
                            turn:true
                        });
                        firebase.database().ref(`game/players/${playerId}`).update({
                            turn:false
                        });

                        gameRef.update({
                            drawNumber:0,
                            mustPlayDrawTwo:false
                        });

                        myTurn = false;
                        

                    }


                }else{
                    console.log("player does not exist?")
                }
            });

            
            firebase.database().ref(`game/players/${nextPlayerId}`).update({
                        turn:true
            });


        }

        function reverseOrder(){
            reverse = !reverse;
            gameRef.update({
                reverse:reverse
            });
        }

        function skip(){

            if(reverse){
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]}).reverse();
            }else{
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]});
            }
            
            let index = keysSorted.findIndex(id => id == playerId);
            let nextPlayerId = keysSorted[index + 1] ?? keysSorted[0];
            let doubleDeckIndex = keysSorted.findIndex(id => id == nextPlayerId);
            let doubleDeckPlayer = keysSorted[index + 1] ?? keysSorted[0];

            firebase.database().ref(`game/players/${doubleDeckPlayer}`).update({
                turn:true
            });

            myTurn = false;
        }


        function onDraw(){
            let card = new Card(); // create new
            selectedCard = undefined; // reset selected card to undef
            cardCollection.push(card); //add to local collection

            let imageSource = "/images/" + card.getCard() + ".png" //image location
            let newCard = document.createElement("img");
            newCard.className = "cardImage";
            newCard.src = imageSource; 
            newCard.id = card.id

            //click on the DOM image
            newCard.onclick = function(){

                if(myTurn){

                    const collection =  document.getElementsByClassName("cardImage"); //all card images

                    //stack cards
                    for(let i = 0; i < collection.length; i++){
                        collection[i].style.top = "0px"
                        collection[i].style.zIndex = i.toString();
                    }
    
                    //selected card moves up
                    newCard.style.top = "-20px"
                    hideColorPicker();

                    //is clicked card already selected?
                    if(selectedCard == card){
                        if(selectedCard != undefined){
                            if(selectedCard.color == "multi"){
                                showColorPicker();
    
                            }else if(selectedCard.color == gameboardCard.color || selectedCard.type == gameboardCard.type){
                                //Play Card

                                if(myTurn){
                                    if(mustPlayDrawTwo){
                                        if(selectedCard.type=="draw2"){
                                            gameboardCard = selectedCard;
                                            //update gamecard and gameref before other updates
                                            gameRef.update({
                                                gameCard:gameboardCard
                                            });
        
                                            updateGameCard(); //Updates Src for Image
                                            removeCard(selectedCard.id);

                                            if(gameboardCard.type == "draw2"){
                                                updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                                drawTwo();
                                            }else{
                                                getNextPlayer(); //updates DB, next player turn = true
                                                //updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                                completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                                            }
                                        }
                                    }else{
                                        gameboardCard = selectedCard;
                                        //update gamecard and gameref before other updates
                                        gameRef.update({
                                            gameCard:gameboardCard
                                        });
    
                                        updateGameCard(); //Updates Src for Image
                                        removeCard(selectedCard.id);
    
                                        if(gameboardCard.type == "draw2"){
                                            updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                            drawTwo();
                                        }else if(gameboardCard.type == "reverse"){
                                            reverseOrder(); //local reverse = !reverse, gameref updates reverse
                                        }else if(gameboardCard.type == "skip"){
                                            skip(); //double deck player update turn true, myTurn = false
                                        }else{
                                            getNextPlayer(); //updates DB, next player turn = true
                                            //updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                            completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                                        }
                                    }
                                    
                                }
                                
                            }
                        }
                    }

                    selectedCard = card;
                    console.log(selectedCard);
                }
            }

            document.getElementById("scroller").appendChild(newCard);
            updateCardMargins();

        }

        function isGameStarted(){
            firebase.database().ref(`game/gameStarted`).get().then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());

                    if(snapshot.val()){
                        console.log("GAME STARTED STATUS:True");
                        gameStarted = true;
                        return true;
                    }else{
                        console.log("GAME STARTED STATUS:False");
                        gameStarted =false;
                        return false;
                    }
                    
                } else {
                    console.log("GAME STARTED REF DOESNT EXIST");
                    return false;
                }
            });
        }

        function startGame(){

            if(!gameStarted){
                gameboardCard = new Card(forceNumber=true);
                    gameStarted = true;
                    gameRef.update({
                        gameStarted:true,
                        gameCard:gameboardCard
                    });
        
                    //Random Key turn = true
                    let rKey = Object.keys(players)[getRandomInt(Object.keys(players).length)];
                    

                    Object.keys(players).forEach(key => {

                        if(key == rKey){
                            //your turn
                            

                            firebase.database().ref(`game/players/${key}`).update({
                                drawCount:5,
                                turn:true
                            });
                        }else{
                            firebase.database().ref(`game/players/${key}`).update({
                                drawCount:5
                            });
                        }
                        

                    });
            }
        }



        async function restartGame(){

            // gameboardCard = new Card(false,true);
            // gameboardCard.color = "red";
            //     gameStarted = true;
            //     gameRef.update({
            //         gameStarted:false,
            //         gameCard:gameboardCard
            //     });

            // updateGameCard();

            Object.keys(players).forEach(key => {
                
                firebase.database().ref(`game/players/${key}`).remove();
                
            });
            
            //location.reload();
            await new Promise(r => setTimeout(r, 2000));

            startGame();

        }
        

        //DOM within Init

        document.getElementById("startGame").onclick = function(){

            startGame();
            //Game = Started
            //Deal Cards to All Players -> set trigger
            //Set GameboardCard
            

            // if(!gameStarted){

            //     gameboardCard = new Card(forceNumber=true);
            //     gameStarted = true;
            //     gameRef.update({
            //         gameStarted:true,
            //         gameCard:gameboardCard
            //     });
    
            //     //Random Key turn = true
            //     let rKey = Object.keys(players)[getRandomInt(Object.keys(players).length)];
                

            //     Object.keys(players).forEach(key => {

            //         if(key == rKey){
            //             //your turn
                        

            //             firebase.database().ref(`game/players/${key}`).update({
            //                 drawCount:5,
            //                 turn:true
            //             });
            //         }else{
            //             firebase.database().ref(`game/players/${key}`).update({
            //                 drawCount:5
            //             });
            //         }
                    

            //       });


            
        }

        document.getElementById("newGame").onclick = function(){

            restartGame();
            // gameboardCard = new Card(false,true);
            // gameboardCard.color = "red";
            //     gameStarted = true;
            //     gameRef.update({
            //         gameStarted:false,
            //         gameCard:gameboardCard
            //     });
            // updateGameCard();

            // Object.keys(players).forEach(key => {
                
            //     firebase.database().ref(`game/players/${key}`).remove();
                
            // });
            // location.reload();
        }

        //PLAY CARD
        document.getElementById("gameboardcard").onclick = function(){

            if(selectedCard != undefined){

                if(selectedCard.color == "multi"){
                    showColorPicker();

                }else if(selectedCard.color == gameboardCard.color || selectedCard.type == gameboardCard.type){

                    //Play Card
                    if(myTurn){
                        if(mustPlayDrawTwo){
                            if(selectedCard.type=="draw2"){
                                gameboardCard = selectedCard;
                                //update gamecard and gameref before other updates
                                gameRef.update({
                                    gameCard:gameboardCard
                                });

                                updateGameCard(); //Updates Src for Image
                                removeCard(selectedCard.id);

                                if(gameboardCard.type == "draw2"){
                                    updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                    drawTwo();
                                }else{
                                    getNextPlayer(); //updates DB, next player turn = true
                                    //updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                    completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                                }
                            }
                        }else{
                            gameboardCard = selectedCard;
                            //update gamecard and gameref before other updates
                            gameRef.update({
                                gameCard:gameboardCard
                            });


                            updateGameCard(); //Updates Src for Image
                            removeCard(selectedCard.id);

                            if(gameboardCard.type == "draw2"){
                                updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                drawTwo();
                            }else if(gameboardCard.type == "reverse"){
                                reverseOrder(); //local reverse = !reverse, gameref updates reverse
                            }else if(gameboardCard.type == "skip"){
                                skip(); //double deck player update turn true, myTurn = false

                            }else{
                                getNextPlayer(); //updates DB, next player turn = true
                                //updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                                completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                            }
                        }
                        
                    }

                }
            }

        }


        document.getElementById("drawButton").onclick = function(){

            onDraw();
            updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
        }

        document.getElementById("testButton").onclick = function(){

            firebase.database().ref(`game/players/${playerId}`).get().then((snapshot) => {
                if (snapshot.exists()) {

                    let player = snapshot.val();
                    let cards = player.cards;

                    let playerHasDraw2 = false;
                    cards.forEach((card)=>{
                        if(card.type == "draw2"){
                            playerHasDraw2 = true;
                        } 
                    })
                    //`${cards.length} ${cards[0]["type"]}`
                    document.getElementById("infoTag").innerHTML =  playerHasDraw2 ;
                }else{
                    console.log("player does not exist?");
                }
            });
        }
        //COLOR PICKER Buttons

        document.getElementById("pickred").onclick = function(){
            if(myTurn){
                document.getElementById("gameboardcard").src = "/images/redblank.png"
                let queueDrawThree = selectedCard.type == "alldraw3";
                let queueDrawFour = selectedCard.type == "draw4";
  
                gameboardCard = new Card(false, true);
                gameboardCard.color = "red";

                //update gamecard and gameref before other updates
                gameRef.update({
                    gameCard:gameboardCard
                });

                hideColorPicker();
                removeCard(selectedCard.id);
                getNextPlayer(); //updates DB, next player turn = true
                //updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                if(queueDrawThree){
                    drawThree();
                    console.log("*****   called drawThree   ******")
                }
                if(queueDrawFour){
                    drawFour();
                    console.log("*****   called drawThree   ******")
                }
                
            }
            
        }
        document.getElementById("pickblue").onclick = function(){
            if(myTurn){
                let queueDrawThree = selectedCard.type == "alldraw3";
                let queueDrawFour = selectedCard.type == "draw4";

                document.getElementById("gameboardcard").src = "/images/blueblank.png"
                gameboardCard = new Card(false, true);
                gameboardCard.color = "blue";

                gameRef.update({
                    gameCard:gameboardCard
                });
                hideColorPicker();
                removeCard(selectedCard.id);
                //updateCCDB();
                getNextPlayer(); //updates DB, next player turn = true
                completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                if(queueDrawThree){
                    drawThree();
                }
                if(queueDrawFour){
                    drawFour();
                    console.log("*****   called drawThree   ******")
                }
                
            }
            
        }
        document.getElementById("pickyellow").onclick = function(){
            if(myTurn){
                let queueDrawThree = selectedCard.type == "alldraw3";
                let queueDrawFour = selectedCard.type == "draw4";

                document.getElementById("gameboardcard").src = "/images/yellowblank.png"
                gameboardCard = new Card(false, true);
                gameboardCard.color = "yellow";

                gameRef.update({
                    gameCard:gameboardCard
                });
                hideColorPicker();
                removeCard(selectedCard.id);
                getNextPlayer(); //updates DB, next player turn = true
                //updateCCDB();
                completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                if(queueDrawThree){
                    drawThree();
                }
                if(queueDrawFour){
                    drawFour();
                    console.log("*****   called drawThree   ******")
                }
                
            }
            
        }
        document.getElementById("pickgreen").onclick = function(){
            if(myTurn){
                let queueDrawThree = selectedCard.type == "alldraw3";
                let queueDrawFour = selectedCard.type == "draw4";

                document.getElementById("gameboardcard").src = "/images/greenblank.png"
                gameboardCard = new Card(false, true);
                gameboardCard.color = "green";

                gameRef.update({
                    gameCard:gameboardCard
                });
                hideColorPicker();
                removeCard(selectedCard.id);
                getNextPlayer(); //updates DB, next player turn = true
                //updateCCDB();
                completeTurn(); //playerGameRef  cards:cardCollection  drawCount 0 turn false
                if(queueDrawThree){
                    drawThree();
                }
                if(queueDrawFour){
                    drawFour();
                    console.log("*****   called drawThree   ******")
                }
                
            }
            
        }





        //PROBLEM
        //both exist but say otherwise

        // firebase.database().ref(`game/${playerId}/cards`).get().then((snapshot) => {
        //     if (snapshot.exists()) {

        //         console.log(snapshot.val());
        //     } else {

        //         for(let i = 0; i < 5; i++){
        //             onDraw();
        //             if(i == 4){
        //                 updateCCDB(); //cards:cardCollection
        //             }
        //         }

        //         //playerGameRef.update({name:createName()});
        //     }
        // });


        // firebase.database().ref(`game/gameStarted`).get().then((snapshot) => {
        //     if (snapshot.exists()) {
        //         console.log(snapshot.val());
        //     } else {
        //         console.log("GAME STARTED DOESNT EXIST");
        //         //set new gameboard card
        //         gameboardCard = new Card(forceNumber=true);

        //         gameRef.update({
        //             reverse:false,
        //             drawNumber:0,
        //             gameStarted:false
        //         });
        //     }
        // });



        //TODO inspect
        // firebase.database().ref(`gameCard`).get().then((snapshot) => {
        //     if (snapshot.exists()) {
        //         console.log(snapshot.val());
        //     } else {
        //         console.log("GAME Card DOESNT EXIST");
        //         //set new gameboard card
        //         gameboardCard = new Card(forceNumber=true);

        //         gameRef.update({
        //             reverse:false,
        //             drawNumber:0,
        //             gameStarted:false,
        //             gameCard:gameboardCard
        //         });
        //     }
        // });


        



        //Listener for all changes to this node- Players



        // allPlayersRef.on("value", (snapshot) => { 
        //     console.log("ALL PLAYERS REF-- VALUE");
        //     console.log(snapshot.val());
        // });

        //allPlayersRef.on('child_added', (snapshot) => {});








        //Initialize Game Node, if it does not exist
        //Game -> Players -> ID:turn,cards,time joined,

        //UPDATE CHANGE TODO
        //gamestarted logic, remove
        //gameboard card logic, move to start game function
        gameRef.get().then((snapshot) => {
            if (snapshot.exists()) {
                // console.log("GAME EXISTS!")
                // console.log(snapshot.val().gameStarted)
                // if(!snapshot.val().gameStarted){
                //     //game hasnt started
                //     gameboardCard = new Card(forceNumber = true);
                //     updateCCDB(); //cards:cardCollection
                // }
            } else {

                gameRef.update({
                    mustPlayDrawTwo:true,
                    reverse:false,
                    drawNumber:0,
                    gameStarted:false
                });
            }
        });


        playerGameRef.on("value", (snapshot) => {

            //your turn?
            let yourTurn = snapshot.val().turn;
            //HANDLE TURN
            myTurn=yourTurn;

            let drawNum = snapshot.val().drawCount;
            console.log("DRAW NUMBER:");
            console.log(drawNum);


            //remove recurrency
            if(drawNum > 0){ 
                for(let i = 0; i < drawNum; i++){
                    onDraw();
                    if(i == drawNum - 1){
                        updateCCDB(); //cards:cardCollection  drawCount:0
                    }
                }
            }

            //Update PlayerRef

            //snapshot.val().name;

            playerRef.update({
                name:snapshot.val().name,
                cards:cardCollection,
                drawCount:0, // safe?
                turn: yourTurn,
                wins:snapshot.val().wins

            });
            

        })




        // gamePlayersRef.on("value", (snapshot) => { 
        //     console.log("GAME PLAYERS REF-- VALUE");
        //     console.log(snapshot.val());
        // });




        gamePlayersRef.on("child_added", (snapshot) => {

            console.log("GAME PLAYERS REF-- CHILD ADDED");
            console.log(snapshot.val());

            let addedPlayer = snapshot.val();


            //Keep a local list of Players
            //players.push(addedPlayer.id);

            //Switch from array to object
            players[addedPlayer.id] = addedPlayer.time;

            console.log("PLAYERS (LOCAL)");
            console.log(players);

            //player joined game
            //game is in progress? -> skip for now
            //playerorderlist -> pull times from db, order (reversed?) 
        });





        gamePlayersRef.on("child_removed", (snapshot) => {
            console.log("GAME PLAYERS REF-- CHILD Removed!");
            console.log(snapshot.val());

            let removedPlayer = snapshot.val();

            //Switch from array to object

            //Remove Player from Players:
            //let toBeRemoved = (id) => id == removedPlayer.id;
            //players.splice(players.findIndex(toBeRemoved),1);

            delete players[removedPlayer.id];



        });




        gameRef.on("value", (snapshot)=>{

            let game =  snapshot.val();
            try{gameboardCard.type = game.gameCard.type;
                gameboardCard.color = game.gameCard.color;

                
            }catch(error){
                //gameboardCard = new Card(forceNumber=true);
                console.error(error);
            }
            
            console.log("GAME REF VALUE CHANGED");
            gameStarted = game.gameStarted;
            gameDrawNumber = game.drawNumber;
            mustPlayDrawTwo = game.mustPlayDrawTwo;
            reverse = game.reverse;
            
            updateGameCard(); //Updates Src for Image
        })






        function getNextPlayer(myId = playerId){
            if(reverse){
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]}).reverse();
            }else{
                var keysSorted = Object.keys(players).sort(function(a,b){return players[a]-players[b]});
            }
            
            let index = keysSorted.findIndex(id => id == myId);
            let nextPlayerId = keysSorted[index + 1] ?? keysSorted[0];
            
            //Update Database
            console.log(nextPlayerId );

            
            firebase.database().ref(`game/players/${nextPlayerId}`).update({
                        turn:true
            });
            
        } 



    }


    


    

    //Handles the user signin
    //Calls Init Game
    async function userSignIn(){
        const userCredential = await firebase.auth().signInAnonymously();
        console.log('Additional user info: ', userCredential.additionalUserInfo);
        let newUser = userCredential.additionalUserInfo.isNewUser;

        //Attempt to Authorize User
        firebase.auth().onAuthStateChanged((user) =>{

            if(user){
                playerId = user.uid;
                playerRef = firebase.database().ref(`players/${playerId}`);
                playerGameRef = firebase.database().ref(`game/players/${playerId}`);


                let time =  Date.now();
                let date = new Date().toLocaleString();
                //drawCount -> number of cards to draw


                // //initial Set
                // playerGameRef.set({
                //     id:playerId,
                //     turn:false,
                //     cards:[],
                //     time,
                //     date,
                //     drawCount:0
                // });


                playerGameRef.onDisconnect().remove();


                

                if(newUser){

                    let name = createName();
                    //playerNameInput.value = name; //updates input field in DOM
                    let time =  Date.now();
                    let date = new Date().toLocaleString();


                    //updates database, adds player info
                    playerRef.set({
                        id:playerId,
                        name,
                        time,
                        onlineStatus:true,
                        wins:0,
                        cards:[],
                        turn:false,
                        drawCount:0
                    });


                    //initial Set
                    playerGameRef.set({
                        id:playerId,
                        turn:false,
                        cards:[],
                        time,
                        date,
                        drawCount:0
                    });


                }else{
                    //If the entry was deleted, parameters will need to be set
                    //ID automatically set

                    let playerRefName;
                    let playerRefCards;
                    let playerRefWins;
                    let playerRefTime;
                    let playerRefDate;

                    //set name
                    firebase.database().ref(`players/${playerId}/name`).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());

                            playerGameRef.update({
                                name: snapshot.val()
                            })

                        } else {
                            let name = createName();

                            playerRef.update({
                                name
                            });

                            playerGameRef.update({
                                name
                            })

                            
                        }
                    });



                    //set wins
                    firebase.database().ref(`players/${playerId}/wins`).get().then((snapshot) => {
                        if (snapshot.exists()) {

                            console.log(snapshot.val());

                            playerGameRef.update({
                                wins:snapshot.val()
                            });

                        } else {
                            playerRef.update({
                                wins:0
                            });

                            playerGameRef.update({
                                wins:0
                            });
                        }
                    });



                    firebase.database().ref(`players/${playerId}/time`).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());

                        } else {

                            playerRef.update({
                                time,
                                date:new Date(time).toLocaleString()
                            });

                        }
                    });



                    //PlayerRef, Game Specific -> Refresh Safety
                    
                    //set cards
                    firebase.database().ref(`players/${playerId}/cards`).get().then((snapshot) => {
                        if (snapshot.exists()) {

                            console.log(snapshot.val());

                            playerGameRef.update({
                                cards:snapshot.val()
                            });

                        } else {

                            playerRef.update({
                                cards:[]
                            });

                            playerGameRef.update({
                                cards:[]
                            });

                        }
                    });

                     //set turn
                     firebase.database().ref(`players/${playerId}/turn`).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());

                            playerGameRef.update({
                                turn:snapshot.val()
                            });


                        } else {

                            playerGameRef.update({
                                turn:false
                            });


                            playerRef.update({
                                cards:[]
                            });
                        }
                    });

                    //set drawCount
                    firebase.database().ref(`players/${playerId}/drawCount`).get().then((snapshot) => {
                        if (snapshot.exists()) {

                            console.log(snapshot.val());

                            playerGameRef.update({
                                drawCount:snapshot.val()
                            });


                        } else {

                            playerRef.update({
                                cards:[]
                            });

                            playerGameRef.update({
                                drawCount:0
                            });

                        }
                    });




                    playerRef.update({
                        onlineStatus:true,
                        turn:false // FIX
                    });


                    //Exisiting User
                    //initial Set
                    playerGameRef.update({
                        id:playerId,
                        time,
                        date,
                    });


                }

                //when the player disconnects
                playerRef.onDisconnect().update({
                    onlineStatus:false
                });

                //Begin the Game
                initGame();



            }else{
                console.log("FIREBASE AUTH, FAILED TO AUTHORIZE")
            }
        });

        //Anon log-in Failure
        firebase.auth().signInAnonymously().catch((error) =>{
            var errorCode = error.code;
            var errorMessage = error.message;
      
            console.log(errorCode,errorMessage);
          });


    }

    //Player Name Change
    document.getElementById("refreshName").onclick =function(){
        let newName = createName();
        //playerNameInput.value = newName;
        playerGameRef.update({
            name:newName
        });
    };
    //Player Name Change
    playerNameInput.addEventListener("change", (e)=>{
        const newName = e.target.value || createName();
        //playerNameInput.value = newName;
        playerGameRef.update({
            name:newName
        });
    })



    //RUN
    userSignIn();
    //hideColorPicker();

    

})();

