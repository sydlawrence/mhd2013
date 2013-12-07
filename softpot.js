var five = require("johnny-five"),
    board, mySoftPot;

var softPotThreshold = 20;


board = new five.Board();


board.on("ready", function() {

  var lastSoftPot = undefined;
  var lastSoftPotValid = false;

  mySoftPot = new five.Sensor({
    pin: "A1",
    freq: 250
  });
  mySoftPot.on("read", function( err, value ) {
    if (lastSoftPot !== undefined) {
      if (lastSoftPot > value - softPotThreshold && lastSoftPot < value + softPotThreshold) {
        if (lastSoftPotValid) {
          console.log("read value "+value+" last: "+lastSoftPot);

        }
        lastSoftPotValid = true;
      } else {
        lastSoftPotValid = false;
      }
    }
    lastSoftPot = value;
  });


  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    softpot:mySoftPot,
    lastSoftPot:lastSoftPot
  });



  

});





// References
//
// http://servocity.com/html/hs-7980th_servo.html
