
function showText(){
  var x = document.getElementById("sampleText");

    if (x.style.display === "none") {
        x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}







/*
const element = document.getElementById("container");

setInterval(function() {

  if(element.className == "colortext1 text"){
    element.className ="white_black text";
  }else{
    element.className = "colortext1 text"
  }
  
}, 1000);
*/

const element = document.getElementById("titleColor");

setInterval(function() {

  if(element.className == "titleRed"){
    element.className ="titleBlue";
    element.innerHTML = "Blue";
  }else if(element.className == "titleBlue"){
    element.className ="titleGreen";
    element.innerHTML = " Green";
  }else if(element.className == "titleGreen"){
    element.className ="titleRed";
    element.innerHTML = "Red";
  }else{
    element.className ="titleRed";
    element.innerHTML = "Red";
  }
  
}, 6000);




/*

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

*/
