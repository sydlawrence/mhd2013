var five = require("johnny-five"),
    board, button;
    
board = new five.Board();

board.on("ready", function() {
  this.pinMode(13, five.Pin.OUTPUT);
  this.digitalWrite(9,1);
});