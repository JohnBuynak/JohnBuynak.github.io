

var selectedCard = undefined;
var cardCollection = [];
var gameboardCard = undefined;
var reverse = false;
var drawCount = 0;

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
    document.getElementById("gameboardcard").src = "/images/" + gameboardCard.getCard() + ".png"
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
            case(nCards <= 20):
                marginRight = "-40px";
                break;
            case(nCards > 20):
                marginRight = "-50px";
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
            case(nCards <= 15):
                marginRight = "-20px";
                break;
            case(nCards <= 20):
                marginRight = "-30px";
                break;
            case(nCards <= 25):
                marginRight = "-40px";
                break;
            case(nCards > 30):
                marginRight = "-50px";
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
function getPlayOrder(){} 
function passDrawTwoFour(){}



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
                            gameboardCard = selectedCard;
                            updateGameCard();
                            removeCard(selectedCard.id);
                            updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                            gameRef.update({
                                gameCard:gameboardCard
                             })
                        }
                    }
                }

                selectedCard = card;
                console.log(selectedCard);
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
                        return true;
                    }else{
                        console.log("GAME STARTED STATUS:False");
                        return false;
                    }
                    
                } else {
                    console.log("GAME STARTED REF DOESNT EXIST");
                    return false;
                }
            });
        }
        

        //DOM within Init

        document.getElementById("startGame").onclick = function(){

            //Game = Started
            //Deal Cards to All Players -> set trigger
            //Set GameboardCard

            if(!isGameStarted()){
                gameRef.update({
                    gameStarted:true
                });
    
                
                Object.keys(players).forEach(key => {
                    firebase.database().ref(`game/players/${key}`).update({
                        drawCount:5
                    });
                  });

                // players.forEach((id) => {
                //     firebase.database().ref(`game/players/${id}`).update({
                //         drawCount:5
                //     })
                // })
            }
        }

        //PLAY CARD
        document.getElementById("gameboardcard").onclick = function(){

            if(selectedCard != undefined){

                if(selectedCard.color == "multi"){
                    showColorPicker();

                }else if(selectedCard.color == gameboardCard.color || selectedCard.type == gameboardCard.type){

                    //Play Card
                    gameboardCard = selectedCard;
                    updateGameCard();
                    removeCard(selectedCard.id);
                    updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
                    gameRef.update({
                        gameCard:gameboardCard
                     })

                }
            }

        }


        document.getElementById("drawButton").onclick = function(){

            onDraw();
            updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
        }


        //COLOR PICKER Buttons

        document.getElementById("pickred").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/redblank.png"
            gameboardCard = new Card(false, true);
            gameboardCard.color = "red";
            hideColorPicker();
            removeCard(selectedCard.id);
            updateCCDB(); //playerGameRef  cards:cardCollection  drawCount 0
        }
        document.getElementById("pickblue").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/blueblank.png"
            gameboardCard = new Card(false, true);
            gameboardCard.color = "blue";
            hideColorPicker();
            removeCard(selectedCard.id);
            updateCCDB();
        }
        document.getElementById("pickyellow").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/yellowblank.png"
            gameboardCard = new Card(false, true);
            gameboardCard.color = "yellow";
            hideColorPicker();
            removeCard(selectedCard.id);
            updateCCDB();
        }
        document.getElementById("pickgreen").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/greenblank.png"
            gameboardCard = new Card(false, true);
            gameboardCard.color = "green";
            hideColorPicker();
            removeCard(selectedCard.id);
            updateCCDB();
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
        firebase.database().ref(`gameCard`).get().then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("GAME Card DOESNT EXIST");
                //set new gameboard card
                gameboardCard = new Card(forceNumber=true);

                gameRef.update({
                    reverse:false,
                    drawNumber:0,
                    gameStarted:false,
                    gameCard:gameboardCard
                });
            }
        });


        



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
                console.log("GAME EXISTS!")
                console.log(snapshot.val().gameStarted)
                if(!snapshot.val().gameStarted){
                    //game hasnt started
                    gameboardCard = new Card(forceNumber = true);
                    updateCCDB(); //cards:cardCollection
                }
            } else {

                gameRef.update({
                    reverse:false,
                    drawNumber:0,
                    gameStarted:false
                });
            }
        });


        playerGameRef.on("value", (snapshot) => {

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

            try{gameboardcard.type = snapshot.val().gameCard.type;
                gameboardcard.color = snapshot.val().gameCard.color;
            }catch(error){
                gameboardCard = new Card(forceNumber=true);
            }
            
            //Updates Src for Image
            updateGameCard();
        })

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

                playerGameRef.set({
                    id:playerId,
                    turn:false,
                    cards:[],
                    time,
                    date,
                    drawCount:0
                });

                playerGameRef.onDisconnect().remove();


                

                if(newUser){

                    let name = createName();
                    //playerNameInput.value = name; //updates input field in DOM
                    let time =  Date.now();

                    //updates database, adds player info
                    playerRef.set({
                        id:playerId,
                        name,
                        cards:[],
                        turn:false,
                        time,
                        onlineStatus:true,
                        wins:0
        
                    });

                }else{
                    //If the entry was deleted, parameters will need to be set
                    //ID automatically set

                    //set name
                    firebase.database().ref(`players/${playerId}/name`).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());
                        } else {
            
                            playerRef.update({
                                name:createName()
                            });
                        }
                    });

                    //set cards
                    firebase.database().ref(`players/${playerId}/cards`).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());
                        } else {
            
                            playerRef.update({
                                cards:[]
                            });
                        }
                    });

                    //set wins
                    firebase.database().ref(`players/${playerId}/wins`).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log(snapshot.val());
                        } else {
            
                            playerRef.update({
                                wins:0
                            });
                        }
                    });

                    
                    let time =  Date.now();
    
                    playerRef.update({
                        turn:false,
                        time,
                        onlineStatus:true,
                    })
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
        playerRef.update({
            name:newName
        });
    };
    //Player Name Change
    playerNameInput.addEventListener("change", (e)=>{
        const newName = e.target.value || createName();
        //playerNameInput.value = newName;
        playerRef.update({
            name:newName
        });
    })



    //RUN
    userSignIn();
    //hideColorPicker();

    

})();

