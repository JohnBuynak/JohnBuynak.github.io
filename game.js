function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }


  function createName() {
    const prefix = randomFromArray([
        "JACKED",
        "DIRTY",
        "BASTARD",
        "DEGENERATE",
        "LAME",
        "LUMPY",
        "FAT",
        "UGLY",
        "LARDASS",
        "DUMB",
        "CHINESE",
        "TURD",
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
        "MUSKRAT",
        "TURTLE",
        "CHIPMUNK",
        "TOAD",
        "HIPPO",
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
      "BUG",
    ]);
    return `${prefix} ${animal}`;
  }








  (function(){

    let playerId;
    let playerRef;
    
    
    function initGame(){
    
    
    }
    
    firebase.auth().onAuthStateChanged((user) =>{
      console.log("FIREBASE AUTH, ON AUTH STATE CHANGED")
      if(user){
        console.log(user.uid)
    
        //you are logged setInterval(function () {
        playerId = user.uid;
        playerRef = firebase.database().ref(`players/${playerId}`);
    
        playerRef.set({
          id:playerId,
          name:"",
          cards:"r4",
          score:0
    
        })
    
        //Remove Player from firebase when they disconnect
        playerRef.onDisconnect().remove();
    
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

            if(this.type != "draw4" & this.type != "alldraw3"){
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

        this.id = "0";



    }

    getCard(){
        return this.color + this.type
    }
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




var gameboardcard = new Card(forceNumber=true);
var selectedCard = undefined;

updateGameCard();
hideColorPicker();






//Click on Game Board Card
//Play selected card
//remove selected card
document.getElementById("gameboardcard").onclick = function(){
    if(selectedCard != undefined){
        if(selectedCard.color == "multi"){
            showColorPicker();

        }else if(selectedCard.color == gameboardcard.color | selectedCard.type == gameboardcard.type){

            gameboardcard = selectedCard;
            updateGameCard();
            removeCard(selectedId);
        }
    }

}



//COLOR PICKER Buttons

document.getElementById("pickred").onclick = function(){
    document.getElementById("gameboardcard").src = "/images/redblank.png"
    gameboardcard = new Card(forceBlank=true);
    gameboardcard.color = "red";
    hideColorPicker();
    removeCard(selectedId);
    console.log(gameboardcard);
}
document.getElementById("pickblue").onclick = function(){
    document.getElementById("gameboardcard").src = "/images/blueblank.png"
    gameboardcard = new Card(forceBlank=true);
    gameboardcard.color = "blue";
    hideColorPicker();
    removeCard(selectedId);
    console.log(gameboardcard);
}
document.getElementById("pickyellow").onclick = function(){
    document.getElementById("gameboardcard").src = "/images/yellowblank.png"
    gameboardcard = new Card(forceBlank=true);
    gameboardcard.color = "yellow";
    hideColorPicker();
    removeCard(selectedId);
    console.log(gameboardcard);
}
document.getElementById("pickgreen").onclick = function(){
    document.getElementById("gameboardcard").src = "/images/greenblank.png"
    gameboardcard = new Card(forceBlank=true);
    gameboardcard.color = "green";
    hideColorPicker();
    removeCard(selectedId);
    console.log(gameboardcard);
}


var cardCollection = [];
var selectedCardNumber = 0;
var childNodeNumber = 0;


var selectedId = "";



function removeCard(id){
    
    console.log(document.getElementById(id));
    document.getElementById("scroller").removeChild(document.getElementById(id));
    selectedCard = undefined;


    //const collection =  document.getElementsByClassName("cardImage");

    //const collection =  document.getElementById("scroller").children;
    //console.log(collection);
    //document.getElementById("scroller").removeChild(collection[childNodeNumber]);

    /*
    let x = document.getElementById("scroller").children.length -1;
    let id = x.toString();
    let c = document.getElementById(id);

    console.log(id);
    console.log(document.getElementById("scroller").children);
    document.getElementById("scroller").removeChild(c);
    */
}





document.getElementById("drawButton").onclick = function(){
    let card = new Card();
    cardCollection.push(card);
    console.log(cardCollection);

    console.log(card.color, card.type);

    let imageSource = "/images/" + card.getCard() + ".png"

    let newCard = document.createElement("img");
    newCard.className = "cardImage";
    newCard.src = imageSource;
    newCard.style.marginRight ="-40px";

    newCard.id = document.getElementById("scroller").children.length.toString();
    card.id = newCard.id;


    //Click Card, Select it

    newCard.onclick = function(){
        const collection =  document.getElementsByClassName("cardImage");
        console.clear();
        for(let i = 0; i < collection.length; i++){
            collection[i].style.top = "0px"
            collection[i].style.zIndex = i.toString();
            //console.log(collection[i].style.zIndex);
        }
        newCard.style.top = "-20px"
        selectedCard = card;
        selectedId = card.id;
        console.log("ID:" + card.id);


        childNodeNumber = document.getElementById("scroller").children.length


        hideColorPicker();
        console.log(selectedCard);



        
        //From Game Board Card On Click:
        if(selectedCard != undefined){
            if(selectedCard.color == "multi"){
                showColorPicker();
    
            }else if(selectedCard.color == gameboardcard.color | selectedCard.type == gameboardcard.type){
    
                gameboardcard = selectedCard;
                updateGameCard();
                removeCard(selectedId);
            }
        }
    }


    document.getElementById("scroller").appendChild(newCard);

}
