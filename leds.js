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

var Bauble = function(pin, note) {
  var piezo = new five.Sensor(pin);
  // var pot = new five.Sensor('A0');

  // clever way to do this is only record an upwards curve
  var isPlaying = false;
  piezo.within([50,9000], function() {
    if (isPlaying) return;

    sendNote([144,note,44],3);
    isPlaying = true;

    setTimeout(function() {
      sendNote([144,note,0], 3);
      isPlaying = false;
    }, 2000)
    console.log('Bauble '+pin+' triggered ' + this.value);
  });
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
    ledMax = 255 * (value - standardPingMin) / (standardPing - standardPingMin);

    if (ledMax > 255) ledMax = 255;
    if (ledMax < 0) ledMax = 0;
    if (value) {
      sendNote([144,12,ledMax]);
    }
  });

  var baubles = [
    new Bauble('A0', 47),
    new Bauble('A1', 48),
    new Bauble('A2', 49),
    new Bauble('A3', 50),
    new Bauble('A4', 51),
    new Bauble('A5', 52),
    new Bauble('A6', 53),
    new Bauble('A7', 54),
    new Bauble('A8', 55),
    new Bauble('A9', 56),
    new Bauble('A10', 57)
  ];

  board.repl.inject({
    leds:leds,
    fadeLedIn:fadeLedIn,
    ledMax: ledMax,
    fadeLedOut: fadeLedOut,
    baubles:baubles,
    output:output
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
