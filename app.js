var five = require("johnny-five"),
    board, button;

var midi = require('midi');

var input;
setTimeout(function() {

  

},50);

// Set up a new input.
var output = new midi.output();




// Create a virtual input port.



// Create a virtual input port.
output.openVirtualPort("MIDITree");

// A midi device "Test Input" is now available for other
// software to send messages to.

// ... receive MIDI messages ...


board = new five.Board();




board.on("ready", function() {
  input = new midi.input();
  input.on('message', function(deltaTime, message) {
    console.log('m:' + message + ' d:' + deltaTime);
  });

  input.openVirtualPort("Test Input");

  var button = new five.Button(8);

  button.on("down", function() {
    console.log("down");
    output.sendMessage([144,47,44],3);
  });

  button.on("release", function() {
    console.log("up");
    output.sendMessage([144,47,0], 3);
  });

  var piezo = new five.Sensor('A0');
  piezo.within([50,1000], function() {
    output.sendMessage([144,47,44],3);
    setTimeout(function() {
      output.sendMessage([144,47,0], 3);
    }, 2000)
    console.log('sensor triggered ' + this.value);

  });

  // piezo.on('data', function() {
  //   if (this.value > 0) {
  //   console.log(this.value);
  // }
  // });

  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button:button,
    piezo:piezo
  });



  

});





// References
//
// http://servocity.com/html/hs-7980th_servo.html
