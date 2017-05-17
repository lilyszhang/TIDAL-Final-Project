TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {
    var json = JSON.parse(jsonString);
    topcodes = json.topcodes;

    var ctx = document.querySelector("#lines").getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";

    var i;
    var sineWave = [];
    for (i=0; i < topcodes.length; i++) {
        if(topcodes[i].code == 93) {
          sineWave.push({
            x:topcodes[i].x,
            frequency: 5 //Higher frequency (default is 10)
          }); 
          ctx.beginPath();
          ctx.moveTo(topcodes[i].x, 0);
          ctx.lineTo(topcodes[i].x, canvasHeight);
          ctx.stroke();
          ctx.closePath();
        } else if (topcodes[i].code == 155) {
          sineWave.push({
            x:topcodes[i].x,
            frequency: 20 //Lower frequency (default is 10)
          });
          ctx.beginPath();
          ctx.moveTo(topcodes[i].x, 0);
          ctx.lineTo(topcodes[i].x, canvasHeight);
          ctx.stroke();
          ctx.closePath();
        }
    }
    


    //Draw sineWave waves
    sineWave.sort(function(a,b){
      return a.x - b.x;
    });

    console.log(sineWave);

    //Draw first part of the wave
    var firstSection = (sineWave[0]) ? sineWave[0].x : canvasWidth;

    var counter = 0, x=0,y=180;
    var increase = 90/180*Math.PI / 9;
    ctx.beginPath();
    for(i = 0; i <= firstSection; i += 10){
        ctx.moveTo(x,y);
        x = i;
        y =  180 - Math.sin(counter) * 120;
        counter += increase; 
        ctx.lineTo(x,y);
        ctx.stroke();
    }
    ctx.closePath();


    //If more sections exist
    for(var sectionIndex = 0; sectionIndex < sineWave.length; sectionIndex += 1){
      nextSectionX = ((sectionIndex + 1) < sineWave.length) ? 
        sineWave[sectionIndex + 1].x : canvasWidth;
      var counter = 0, x=sineWave[sectionIndex].x,y=180;
      var increase = 90/180*Math.PI / 9;
      ctx.beginPath();
      for(i = sineWave[sectionIndex].x; i <= nextSectionX; i += sineWave[sectionIndex].frequency){
          ctx.moveTo(x,y);
          x = i;
          y =  180 - Math.sin(counter) * 120;
          counter += increase; 
          ctx.lineTo(x,y);
          ctx.stroke();
      }
      ctx.closePath();
    }
});


var topcodes = [];
var c = {}
var canvasWidth = 600;
var canvasHeight = 400;



