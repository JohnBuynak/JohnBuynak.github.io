




(function(){


firebase.auth().onAuthStateChanged((user) =>{
  console.log(user)
  if(user){
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
      //logged out
    }
})

firebase.auth().signInAnonymously().catch((error) =>{
  var errorCode = error.code;
  var errorMessage = error.message;

  console.log(errorCode,errorMessage);
});

})();
