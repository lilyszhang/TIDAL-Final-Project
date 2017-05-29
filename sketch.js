TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {
    var json = JSON.parse(jsonString);
    topcodes = json.topcodes;

    var ctx = document.querySelector("#lines").getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";

    var light = {
      16: 'radio',
      8: 'microwave',
      4: 'infrared',
      2: 'visible light',
      1: 'ultraviolet',
      0.5: 'x-ray',
      0.25: 'gamma ray'
    };

    var sun = {
      16: 'images/radio.png',
      8: 'images/radio.png',
      4: 'images/infrared.png',
      2: 'images/visible.png',
      1: 'images/UV.png',
      0.5: 'images/xray.png',
      0.25: 'images/gamma.png'
    }

    var i;
    var sineWave = [];
    //Put topcodes in system
    for (i=0; i < topcodes.length; i++) {
        if(topcodes[i].code == 93) {
          sineWave.push({
            x:topcodes[i].x,
            frequencyMultiplier: 0.5 //Higher frequency (default is 10)
          });
          ctx.beginPath();
          ctx.moveTo(topcodes[i].x, 0);
          ctx.lineTo(topcodes[i].x, canvasHeight);
          ctx.stroke();
          ctx.closePath();
        } else if (topcodes[i].code == 155) {
          sineWave.push({
            x:topcodes[i].x,
            frequencyMultiplier: 2 //Lower frequency (default is 10)
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

    var currentFrequency = 2;
    //Draw first part of the wave
    var firstSection = (sineWave[0]) ? sineWave[0].x : canvasWidth;
    var yIntercept = 300;

    var counter = 0, x=0,y = yIntercept;
    var increase = 90/180*Math.PI / 9;
    ctx.beginPath();
    for(i = 0; i <= firstSection; i += currentFrequency){
        ctx.moveTo(x,y);
        x = i;
        y = yIntercept - Math.sin(counter) * 60;
        counter += increase;
        ctx.lineTo(x,y);
        ctx.stroke();
    }
    ctx.closePath();

    //Write the text
    ctx.font="20px Georgia";
    ctx.textAlign="center";
    ctx.fillText(light[currentFrequency],firstSection/2,100);


    //If more sections exist
    for(var sectionIndex = 0; sectionIndex < sineWave.length; sectionIndex += 1){
      nextSectionX = ((sectionIndex + 1) < sineWave.length) ?
        sineWave[sectionIndex + 1].x : canvasWidth;
      var counter = 0, x = sineWave[sectionIndex].x,y = yIntercept;
      currentFrequency *= sineWave[sectionIndex].frequencyMultiplier;
      console.log(currentFrequency);
      ctx.beginPath();
      for(i = sineWave[sectionIndex].x; i <= nextSectionX; i += currentFrequency){
          ctx.moveTo(x,y);
          x = i;
          y = yIntercept - Math.sin(counter) * 60;
          counter += increase;
          ctx.lineTo(x,y);
          ctx.stroke();
      }
      ctx.closePath();
      ctx.fillText(light[currentFrequency], (sineWave[sectionIndex].x + nextSectionX)/2, 100);
    }
});


var topcodes = [];
var c = {}
var canvasWidth = 600;
var canvasHeight = 400;
