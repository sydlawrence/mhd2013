var five = require("johnny-five"),
    board, button;

var midi = require('midi');

var input;
var sendNote = function(message, deltaTime) {
  console.log("sending "+message);
}
var Bauble = function(pin, note) {
  var piezo = new five.Sensor(pin);
  // var pot = new five.Sensor('A0');

  // clever way to do this is only record an upwards curve
  var isPlaying = false;
  piezo.within([100,9000], function() {
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


board = new five.Board();

board.on("ready", function() {

  var baubles = [
    new Bauble('A0', 47),
    new Bauble('A1', 48),
    // new Bauble('A2', 49),
    // new Bauble('A3', 50),
    // new Bauble('A4', 51),
    // new Bauble('A5', 52),
    // new Bauble('A6', 53),
    // new Bauble('A7', 54),
    // new Bauble('A8', 55),
    // new Bauble('A9', 56),
    // new Bauble('A10', 57)
  ];


  board.repl.inject({
    baubles:baubles
  });


    // pot.on('data', function() {
  //   threshold = pot.value/top;
  //   output = '';
  //   for(i=0; i<graphlength;i++) {
  //     output += (i == Math.floor(graphlength*threshold)) ? '|' : '.';
  //   }
  // });
  // 
  // piezo.on('data', function() {
  //   //console.log('piezo '+pin+' value: '+piezo.value);
  //   var dotlength = piezo.value / (top/graphlength);
  //   console.log(output.substring(0,dotlength));
  //   if(piezo.value > (threshold*top)) {
  //     board.digitalWrite(9,1);
  //   } else {
  //     board.digitalWrite(9,0);
  //   }
  // }.bind(piezo));

});
