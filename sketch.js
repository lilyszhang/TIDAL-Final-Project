TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {
    var json = JSON.parse(jsonString);
    topcodes = json.topcodes;

    var ctx = document.querySelector("#lines").getContext('2d');
    ctx.clearRect(0, 0, 1420, canvasHeight);
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
      16: 'radio',
      8: 'radio',
      4: 'infrared',
      2: 'visible',
      1: 'uv',
      0.5: 'xray',
      0.25: 'gamma'
    }

    var i;
    var sineWave = [];
    var newX = 0;
    //Put topcodes in system
    for (i=0; i < topcodes.length; i++) {
        if(topcodes[i].code == 397) { //Wavelength
          //console.log(topcodes[i].angle);
          newX = topcodes[i].x * xRefactor;
          sineWave.push({
            x: newX,
            frequencyMultiplier: Math.round((topcodes[i].angle * (6/(2*Math.PI)) - 3))  //Wavelength
          });
          ctx.beginPath();
          ctx.moveTo(newX, 0);
          ctx.lineTo(newX, canvasHeight);
          ctx.stroke();
          ctx.closePath();
        } else if (topcodes[i].code == 391) {
          console.log(topcodes[i].angle);
          newX = topcodes[i].x * xRefactor;
          sineWave.push({
            x:newX,
            frequencyMultiplier: -1 * Math.round((topcodes[i].angle * (6/(2*Math.PI)) - 3))  //Frequency
          });
          ctx.beginPath();
          ctx.moveTo(newX, 0);
          ctx.lineTo(newX, canvasHeight);
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
    var yIntercept = 550;

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
    ctx.fillText(light[currentFrequency],firstSection/2,50);

    //Draw image
    var img = document.getElementById('img-' + sun[currentFrequency]);
    console.log(img);
    ctx.drawImage(img,firstSection/2 - 150,150);

    if(sineWave.length > 0){
      console.log(sineWave);
    }

    //If more sections exist
    for(var sectionIndex = 0; sectionIndex < sineWave.length; sectionIndex += 1){
      nextSectionX = ((sectionIndex + 1) < sineWave.length) ?
        sineWave[sectionIndex + 1].x : canvasWidth;
      var counter = 0, x = sineWave[sectionIndex].x,y = yIntercept;

      //Transforming the multiplier
      var transformedMultiplier = sineWave[sectionIndex].frequencyMultiplier;
      console.log('before transformation:' + transformedMultiplier)
      //Greater than 3 then set to 3
      transformedMultiplier = (transformedMultiplier > 3) ? 3 : transformedMultiplier;
      //Greater than -3 then set to -3
      transformedMultiplier = (transformedMultiplier < -3) ? -3 : transformedMultiplier;
      //Equal to 0 than bump to 1
      transformedMultiplier = (transformedMultiplier == 0) ? 1 : transformedMultiplier;
      console.log('fixed to: ' + transformedMultiplier);
      console.log('to the power of 2: ' + Math.pow(2, transformedMultiplier));


      //Set the current Frequency
      currentFrequency *= Math.pow(2, transformedMultiplier);
      currentFrequency = (currentFrequency > 16) ? 16: currentFrequency;
      currentFrequency = (currentFrequency < 0.25) ? 0.25: currentFrequency;

      //console.log(currentFrequency);
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
      ctx.fillText(light[currentFrequency], (sineWave[sectionIndex].x + nextSectionX)/2, 50);
      img = document.getElementById('img-' + sun[currentFrequency]);
      ctx.drawImage(img,(sineWave[sectionIndex].x + nextSectionX)/2 - 150,150);
    }
});


var topcodes = [];
var c = {}
var canvasWidth = 1200;
var canvasHeight = 650;
var xRefactor = 1420/canvasWidth;
