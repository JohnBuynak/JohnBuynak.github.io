



class Card{

    //1-9
    //skip
    //reverse
    //draw 2


    //Multi-Colored:
    //wild
    //draw 4
    //dump 3 -> everyone draws three cards including player, player picks a color, next player is not skipped

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

  var gameboardcard = new Card(forceNumber=true);





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




var numberOfPlayers = 0;



  (function(){

    let playerId; //string of who you are logged in as 
    let playerRef; //firebase ref
    let players = {}; //local list of state
    let playerElements = {};

    let playerOrderList = {}; //play order

    //let gameRef; //firebase game ref

    const gameContainer = document.querySelector(".game-container");
    const playerContainer = document.querySelector("#chairs");
    const playerNameInput = document.querySelector("#player-name");
    //const playerColorButton
    
    

    function initGame(){

        const allPlayersRef = firebase.database().ref(`players`);
        //const allCoinsRef = firebase.database().ref(`coins`);
        const gameRef = firebase.database().ref(`game`);

        //console.log("--------GAME REF GAME CARD----------");
        //console.log("--------GAME REF GAME CARD----------");
        //console.log(gameRef.gameCard);
        //console.log(gameRef);


        //players[playerId].time = Date.now();
        //playerRef.set(players[playerId]);

        //INITIAL DRAW
        for(let i = 0; i < 5; i++){
            drawCard();
            //players[playerId].cards =cardCollection;
            //playerRef.set(players[playerId]);
        }
    
        function changeTurns(){
           // playerOrderList
        }

        function reverseTurns(){

            console.log("REVERSE TURNS!!");

            //playerOrderList[addedPlayer.id] = addedPlayer.time;
            var keysSorted = Object.keys(playerOrderList).sort(function(a,b){return playerOrderList[a]-playerOrderList[b]}).reverse();
            console.log(keysSorted);
        }


        function updateCCDB(){
            //updates Your cardcollection in db
            players[playerId].cards =cardCollection;
            playerRef.set(players[playerId]);
            console.log("CARD COLLECTION UPDATED")
        }

        document.getElementById("drawButton").onclick = function(){

            drawCard();
            //CLEAN
            updateCCDB();
        }



        //PLAY CARD
        document.getElementById("gameboardcard").onclick = function(){
            
            if(selectedCard != undefined){

                if(selectedCard.color == "multi"){
                    showColorPicker();
                    
                }else if(selectedCard.color == gameboardcard.color || selectedCard.type == gameboardcard.type){
        
                    gameboardcard = selectedCard;
                    updateGameCard();
                    removeCard(selectedId);
                    updateCCDB();

                    gameRef.update({
                       gameCard:gameboardcard
                    })
                    
                    //gameRef.gameCard = gameboardcard;
                }
            }
        
        }
        





        //DRAW CARD + SET CARD FUNCTION
        
function drawCard(){

    let card = new Card();
    cardCollection.push(card);

    selectedCard = undefined;

    console.log(cardCollection);

    console.log(card.color, card.type);

    let imageSource = "/images/" + card.getCard() + ".png"

    let newCard = document.createElement("img");
    newCard.className = "cardImage";
    newCard.src = imageSource;


    

    newCard.style.marginRight ="-40px";

    //newCard = document reference
    //card = card class ref
    newCard.id = card.id

    //newCard.id = document.getElementById("scroller").children.length.toString();
    //card.id = newCard.id;


    //Click Card, Select it

    newCard.onclick = function(){
        const collection =  document.getElementsByClassName("cardImage");
        console.clear();
        //stack cards
        for(let i = 0; i < collection.length; i++){
            collection[i].style.top = "0px"
            collection[i].style.zIndex = i.toString();
            //console.log(collection[i].style.zIndex);
        }

        newCard.style.top = "-20px"

        hideColorPicker();


        //From Game Board Card On Click:
        if(selectedCard == card){
            if(selectedCard != undefined){
                if(selectedCard.color == "multi"){
                    showColorPicker();
        
                }else if(selectedCard.color == gameboardcard.color || selectedCard.type == gameboardcard.type){
        
                    gameboardcard = selectedCard;
                    updateGameCard();
                    removeCard(selectedId);
                    updateCCDB();
                }
            }
        }

        
        selectedCard = card;
        selectedId = card.id;
        console.log("ID:" + card.id);
        console.log(selectedCard);
        
        
    }


    document.getElementById("scroller").appendChild(newCard);


    updateCardMargins();


}
        
        
        //COLOR PICKER Buttons
        
        document.getElementById("pickred").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/redblank.png"
            gameboardcard = new Card(false, true);
            gameboardcard.color = "red";
            //gameboardcard.type = "blank";
            hideColorPicker();
            removeCard(selectedId);
            console.log("----------PICK COLOR--------")
            console.log(gameboardcard); //game card changed by this point
            updateCCDB();
        }
        document.getElementById("pickblue").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/blueblank.png"
            gameboardcard = new Card(false, true);
            gameboardcard.color = "blue";
            hideColorPicker();
            removeCard(selectedId);
            console.log(gameboardcard);
            updateCCDB();
        }
        document.getElementById("pickyellow").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/yellowblank.png"
            gameboardcard = new Card(false, true);
            gameboardcard.color = "yellow";
            hideColorPicker();
            removeCard(selectedId);
            console.log(gameboardcard);
            updateCCDB();
        }
        document.getElementById("pickgreen").onclick = function(){
            document.getElementById("gameboardcard").src = "/images/greenblank.png"
            gameboardcard = new Card(false, true);
            gameboardcard.color = "green";
            hideColorPicker();
            removeCard(selectedId);
            console.log(gameboardcard);
            updateCCDB();
        }




        //init turn
        //INITIALIZE GAME REFERENCE
        //UPDATE DB GAMECARD

        gameboardcard = new Card(true);

        //updateGameCard();
        if(gameRef.gameCard==undefined){
            console.log("GAME REF CREATED!");


            gameRef.set({
                gameCard:gameboardcard,
                playerList:playerOrderList,
                reverse:false,
                drawNumber:0
            })

            //playerRef.update({
              //  turn:true
            //});

        }else{
            console.log("GAME REF IS NOT UNDEFINED!");
            //gameboardcard = new Card(forceNumber=true);
            //gameboardcard.type = gameRef.gameCard.type;
            //gameboardcard.color = gameRef.gameCard.color;
        }

        updateGameCard();
       



/*
const removedKey = snapshot.val().id;
                playerContainer.removeChild(playerElements[removedKey]);
                delete playerElements[removedKey];
                */


        allPlayersRef.on("value", (snapshot)=>{
            //fires whenever a change occurs


            updateGameCard();

            //if null set to empty object
            players = snapshot.val() || {};

            console.log("LOCAL REF PLAYERS");
            console.log(players);

            Object.keys(players).forEach((key)=>{
                const characterState = players[key];
                let el = playerElements[key];
                el.querySelector(".Character_name").innerText = characterState.name;
                el.querySelector(".cardNumberText").innerText = characterState.cards?.length ?? 0;
            })
        })


        
               

        //PLAYER JOINED GAME
        //allPlayersRef.orderByChild('time').on('child_added', (snapshot) => {});
        allPlayersRef.on('child_added', (snapshot) => {

            //numberOfPlayers += 1;
            //console.log(`NUMBER OF PLAYERS:${numberOfPlayers}`)
            

            //Redraw based on time joined
            //playerOrderList[addedPlayer.id] = addedPlayer.time;
            //var keysSorted = Object.keys(playerOrderList).sort(function(a,b){return playerOrderList[a]-playerOrderList[b]})



            //fires whenever a new node is added
            //new to me, if i join late everyone is new to me
            const addedPlayer = snapshot.val();
            
            console.log(addedPlayer);

            //to be cleaned:
            const characterElement = document.createElement("div");
            characterElement.classList.add("row");

            /*
            if (addedPlayer.id === playerId) {
                characterElement.classList.add("you");
            }*/

            
            characterElement.innerHTML = (`
                <b class="cardNumberText">2</b>
                <div style="width:35%">
                <img src="images/pawn.png" alt="" class="img-new">
                </div>
                <div style="width:50%; display: table;"> <b class="Character_name" 
                style="text-align: center;">John</b></div>
            `);
       
            
            playerElements[addedPlayer.id] = characterElement;


            //Fill in some initial state
            characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
            characterElement.querySelector(".cardNumberText").innerText = addedPlayer.cards.length;
            //playerContainer.appendChild(characterElement);



            playerContainer.replaceChildren();

            
            //DRAW IN CORRECT ORDER ON SCREEN:

            //console.log("KEYS SORTED:");
            playerOrderList[addedPlayer.id] = addedPlayer.time;
            var keysSorted = Object.keys(playerOrderList).sort(function(a,b){return playerOrderList[a]-playerOrderList[b]}).reverse();
            //for(const item in playerElements){playerContainer.appendChild(playerElements[item]);}

            for (let i =0; i < keysSorted.length;i++) {
                playerContainer.appendChild(playerElements[keysSorted[i]]);
              }


                })




            //Remove DOM element
            allPlayersRef.on("child_removed", (snapshot)=>{
                const removedKey = snapshot.val().id;
                playerContainer.removeChild(playerElements[removedKey]);
                delete playerElements[removedKey];
            })


            


            gameRef.on("value", (snapshot)=>{
                
                try{
                    gameboardcard.type = snapshot.val().gameCard.type;
                    gameboardcard.color = snapshot.val().gameCard.color;
                }catch(error){
                    console.error(error);
                }
                
                updateGameCard();
            })

            playerNameInput.addEventListener("change", (e)=>{
                const newName = e.target.value || createName();
                playerNameInput.value = newName;
                playerRef.update({
                    name:newName
                });
            })

    }


    getUser();


    async function getUser(){

        const userCredential = await firebase.auth().signInAnonymously();
        console.log('Additional user info: ', userCredential.additionalUserInfo);

        let newUser = userCredential.additionalUserInfo.isNewUser;
    
    
    firebase.auth().onAuthStateChanged((user) =>{
      console.log("FIREBASE AUTH, ON AUTH STATE CHANGED")
      if(user){


        //console.log(user.uid);
        //console.log(user);


        //you are logged in

        playerId = user.uid;
        playerRef = firebase.database().ref(`players/${playerId}`);
    


        //since variable name matches db

        if(newUser){
            const name = createName();
            playerNameInput.value = name;
    
            const time =  Date.now();
    
    
            playerRef.set({
                id:playerId,
                name,
                cards:[1,1,1,1,1],
                score:0,
                turn:false,
                time,
                onlineStatus:true,
                wins:0
            
                })
        }
        


        

        //Remove Player from firebase when they disconnect
        //playerRef.onDisconnect().remove();
       
        playerRef.onDisconnect().update({
            onlineStatus:false
        })
        

        //Begin the game
        initGame();
        
        
    
    
        }else{
          console.log("FIREBASE AUTH, FAILED TO AUTHORIZE")
          //logged out
        }
    })
    
    
    

    firebase.auth().signInAnonymously().catch((error) =>{
      var errorCode = error.code;
      var errorMessage = error.message;
    
      console.log(errorCode,errorMessage);
    });

}
    
    })();
    




    













class Game {
    constructor() {

        this.gameStarted = false;
        this.players = [];
        this.turnNumber = 0;
    }

    addPlayer(player){
        this.players.push(player);
    }

  }


  class Player {

    constructor(uid,name){
        this.uid = uid;
        this.name = name;
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const game = new Game();




/*
document.getElementById("addButton").onclick = function(){
    let player = new Player(Math.random(),"John");
    game.addPlayer(player);
    //console.log(game.players);
    console.clear();
    for(let i = 0; i < game.players.length; i++){

        console.log(game.players[i].uid);
    }

}
*/




//COLOR PICKER for draw4 and draw3

function showColorPicker(){
    var x = document.getElementById("colorPicker");


        x.style.display = "block";

  }

  function hideColorPicker(){
    var x = document.getElementById("colorPicker");

        x.style.display = "none";
  }



  

 

  //change card on game board

  function updateGameCard(){
    document.getElementById("gameboardcard").src = "/images/" + gameboardcard.getCard() + ".png"
}




//var gameboardcard = new Card(forceNumber=true);
var selectedCard = undefined;

updateGameCard();
hideColorPicker();








var cardCollection = [];
var selectedCardNumber = 0;


var selectedId = undefined;



function removeCard(id){
    
    console.log(document.getElementById(id));
    document.getElementById("scroller").removeChild(document.getElementById(id));
    selectedCard = undefined;


    function f2(item,index){
        if(item.id == selectedId){
            cardCollection.splice(index,1);
            //delete cardCollection[index]
        }
    }

    cardCollection.forEach(f2);
    updateCardMargins();

}

const mediaQuery = window.matchMedia('(max-width: 800px)');
//update Margins
//update Card Images
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



