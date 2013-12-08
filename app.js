var five = require("johnny-five"),
    board, button;

var midi = require('midi');

var input;

var Bauble = function(pin, note) {
  var piezo = new five.Sensor(pin);
  var pot = new five.Sensor('A0');

  // clever way to do this is only record an upwards curve
  var isPlaying = false;
  // piezo.within([1,9000], function() {
  //   if (isPlaying) return;

  //   output.sendMessage([144,note,44],3);
  //   isPlaying = true;

  //   setTimeout(function() {
  //     output.sendMessage([144,note,0], 3);
  //     isPlaying = false;
  //   }, 2000)
  //   console.log('Bauble '+pin+' triggered ' + this.value);
  // });
  //
  var top = 1024;
  var threshold = 0.5;
  
  var output = '';
  var graphlength = 80;
  
  for(i=0; i<graphlength;i++) {
    output += (i == Math.floor(graphlength*threshold)) ? '|' : '.';
  }
  
  pot.on('data', function() {
    threshold = pot.value/top;
    output = '';
    for(i=0; i<graphlength;i++) {
      output += (i == Math.floor(graphlength*threshold)) ? '|' : '.';
    }
  });
  
  piezo.on('data', function() {
    //console.log('piezo '+pin+' value: '+piezo.value);
    var dotlength = piezo.value / (top/graphlength);
    console.log(output.substring(0,dotlength));
    if(piezo.value > (threshold*top)) {
      board.digitalWrite(9,1);
    } else {
      board.digitalWrite(9,0);
    }
  }.bind(piezo));
};


// inputs:
// 11 bauble
// 2 pings
// 1 makey makey

// Set up a new input.
// var output = new midi.output();



// Create a virtual input port.
// output.openVirtualPort("MIDITree");


board = new five.Board();




board.on("ready", function() {
  this.pinMode(13, five.Pin.OUTPUT);
  this.digitalWrite(9,0);
  
  // input = new midi.input();
  // input.on('message', function(deltaTime, message) {
    // console.log('m:' + message + ' d:' + deltaTime);
  // });

  // input.openVirtualPort("Test Input");

  var button = new five.Button(8);

  button.on("down", function() {
    console.log("down");
    // output.sendMessage([144,47,44],3);
  });

  button.on("release", function() {
    console.log("up");
    // output.sendMessage([144,47,0], 3);
  });

  var baubles = [
    // new Bauble('A0', 47),
    // new Bauble('A1', 48),
    new Bauble('A2', 49)
  ];


  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button:button,
    baubles:baubles
  });


});





// References
//
// http://servocity.com/html/hs-7980th_servo.html
