var five = require("johnny-five"),
    midi = require("midi"),

    board, button, leds, input;


var ledMax = 255;



var LedStrip = function(pin) {
  var obj = new five.Led({
    pin: pin,
    type: "PWM"
  });

  return obj;
};


// A midi device "Test Input" is now available for other
// software to send messages to.

// ... receive MIDI messages ...


board = new five.Board();
console.log("board");

var delay = function(duration, cb, args) {
  setTimeout(cb,duration, args);
};


board.on("ready", function() {


  input = new midi.input();
  input.on('message', function(deltaTime, message) {
    console.log(message);
    if (message[0] === 180 && message[1] === 1 ) {
      setLed(0,message[2]);
    }
    if (message[0] === 132 && message[1] === 48 && message[2] === 64 ) {
      setLed(0,0);
    }
  });

  input.openVirtualPort("Test Input");

  leds = [
    new LedStrip(5),
    new LedStrip(9),
    new LedStrip(10),
    new LedStrip(11)
  ];

  // // Inject the `servo` hardware into
  // // the Repl instance's context;
  // // allows direct command line access
  // fadeLedIn(0);
  // delay(1000,fadeLedIn,1);
  // delay(2000,fadeLedIn,2);
  // delay(3000,fadeLedIn,3);
 

  board.repl.inject({
    leds:leds,
    fadeLedIn:fadeLedIn,
    ledMax: ledMax,
    fadeLedOut: fadeLedOut
  });
});

function setLed(index, value) {
  value = (value / 127) * ledMax;

  leds[index].firmata.analogWrite(leds[index].pin,value);
}


function fadeLedIn(index) {
  triggerLed(index,"fadeIn", 100);
}
function fadeLedOut(index) {
  triggerLed(index,"fadeOut", 500);
}

function triggerLed(index, method, args) {
  leds[index][method](args);
}

function triggerAllLeds(method, args) {
  for (var i in leds) {
    triggerLed(i, method, args);
  }
}





// References
//
// http://servocity.com/html/hs-7980th_servo.html
