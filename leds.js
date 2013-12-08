var five = require("johnny-five"),
    midi = require("midi"),

    board, button, leds, input;

var output;

var ledMax = 10;

var mentalMode = false;

var motor;

var sendNote = function(message, deltaTime) {
  output.sendMessage(message);
}

var goMental = function() {
  mentalMode = false;
  sendNote([ 144, 84, 100 ]);
}

var noMental = function() {
  mentalMode = false;
}

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

  toggleSwitch = new five.Switch(40);
  toggleSwitch.on("close", function() {
    goMental();
  });

  // "open" the switch is opened
  toggleSwitch.on("open", function() {
  });

  var ping = new five.Ping(3);


  output = new midi.output();
  output.openVirtualPort("TechnoTree");

  input = new midi.input();
  input.on('message', function(deltaTime, message) {
    console.log(message);
    setLed(2,message[2]);

    if (mentalMode) {
      try {
        setLed(1,message[2]);
        setLed(0,message[2]);
        setLed(3,message[2]);
      } catch (e) {}
    }
   
  });

  input.openVirtualPort("TechnoTree");

  leds = [
    new LedStrip(5),
    new LedStrip(6),
    new LedStrip(7),
    new LedStrip(8)
  ];

  // // Inject the `servo` hardware into
  // // the Repl instance's context;
  // // allows direct command line access
  // fadeLedIn(0);
  // delay(1000,fadeLedIn,1);
  // delay(2000,fadeLedIn,2);
  // delay(3000,fadeLedIn,3);


  var standardPing = 8000;
  var standardPingMin = 300;
 
  ping.on("data", function(err, value) {
    if (value && standardPing === 0) {
      standardPing = value;
    }
      if (value) 
      ledMax = 255 * (value - standardPingMin) / (standardPing - standardPingMin);
    if (ledMax > 255) ledMax = 255;
    if (ledMax < 0) ledMax = 0;
  });

  board.repl.inject({
    leds:leds,
    fadeLedIn:fadeLedIn,
    ledMax: ledMax,
    fadeLedOut: fadeLedOut,
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
