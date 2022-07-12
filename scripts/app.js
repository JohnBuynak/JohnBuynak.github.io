




(function(){

let playerId;
let playerRef;

firebase.auth().onAuthStateChanged((user) =>{
  console.log("FIREBASE AUTH, ON AUTH STATE CHANGED")
  if(user){
    console.log(user.uid)

    //you are logged setInterval(function () {
    playerId = user.uid;
    playerRef = firebase.database().ref('players/${playerId}');

    playerRef.set({
      id:playerId,
      name:"John",
      cards:"r4",
      score:0

    })
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
