TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {
    var json = JSON.parse(jsonString);
    topcodes = json.topcodes;

    var ctx = document.querySelector("#lines").getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";


    for (i=0; i < topcodes.length; i++) {
        if(topcodes[i].code == 93 || topcodes[i].code == 79){
            console.log('found 93');
            console.log(topcodes[i].code);
            ctx.beginPath();
            ctx.moveTo(topcodes[i].x, 0);
            ctx.lineTo(topcodes[i].x, canvasHeight);
            ctx.stroke();
        }
    }
    ctx.closePath();

});


var topcodes = [];
var c = {}
var canvasHeight = 600;
var canvasWidth = 1200;


var waves = new SineWaves({
  // Canvas Element
  el: document.getElementById('waves'),

  // General speed of entire wave system
  speed: 8,

  // How many degress should we rotate all of the waves
  rotate: 0,

  // Ease function from left to right
  ease: 'Linear',

  // Specific how much the width of the canvas the waves should be
  // This can either be a number or a percent
  waveWidth: '95%',

  // An array of wave options
  waves: [
    {
      timeModifier: 1,   // This is multiplied against `speed`
      lineWidth: 3,      // Stroke width
      amplitude: 150,    // How tall is the wave
      wavelength: 200,   // How long is the wave
      segmentLength: 20, // How smooth should the line be
      strokeStyle: 'rgba(255, 255, 255, 0.5)', // Stroke color and opacity
      type: 'sine'       // Wave type
    },
    {
      timeModifier: 1,
      lineWidth: 2,
      amplitude: 150,
      wavelength: 100,
      strokeStyle: 'rgba(255, 255, 255, 0.3)'
    }
  ],

  // Perform any additional initializations here
  initialize: function (){},

  // This function is called whenver the window is resized
  resizeEvent: function() {

    // Here is an example on how to create a gradient stroke
    var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0,"rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.5,"rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1,"rgba(0, 0, 0, 0)");

    var index = -1;
    var length = this.waves.length;
      while(++index < length){
      this.waves[index].strokeStyle = gradient;
    }
  }
});



