TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {
    var json = JSON.parse(jsonString);
    topcodes = json.topcodes;

    var ctx = document.querySelector("#lines").getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";

    ctx.rect(0,0, canvasWidth, 630);
    ctx.fill();

    ctx.strokeStyle = "grey";
    ctx.font="20px Georgia";
    ctx.textAlign="center";
    ctx.fillText('Put Dials in the white space',230,650);

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";


    //Draw Line across
    ctx.beginPath();
    ctx.moveTo(0, 630);
    ctx.lineTo(canvasWidth, 630);
    ctx.stroke();
    ctx.closePath();

    const light = {
      16: 'Radio',
      8: 'Microwave',
      4: 'Infrared',
      2: 'Visible Light',
      1: 'Ultraviolet',
      0.5: 'X-ray',
      0.25: 'Gamma Ray'
    };

    const sun = {
      16: 'radio',
      8: 'micro',
      4: 'infrared',
      2: 'visible',
      1: 'uv',
      0.5: 'xray',
      0.25: 'gamma'
    };

    const resetValue = 9;

    //Variables for topcode processing
    var i,
        sineWave = [],
        newX = 0,
        multiplier = 0,
        change = 1,
        code;
    //Put topcodes in system
    for (i = 0; i < topcodes.length; i++) {
      //397 is wavelength and 391 is frequency
      if(topcodes[i].code == 397 || topcodes[i].code == 391) {
        //console.log(topcodes[i].angle);

        newX = topcodes[i].x * xRefactor;
        multiplier =  Math.floor((topcodes[i].angle + 0.28) * 7/(2*Math.PI)) - 3;

        if(multiplier >= 3){
          multiplier = 3;
        } else if (multiplier <= -3){
          multiplier = -3;
        }

        multiplier = (topcodes[i].code == 397) ? multiplier : -1 * multiplier;

        //Prevent Rollover
        if(topcodes[i].code in previousState){
          if(previousState[topcodes[i].code] === -3 && multiplier >= 2){
            multiplier = -3;
          } else if(previousState[topcodes[i].code] === 3 && multiplier <= -2){
            multiplier = 3;
          }
        }
        
        sineWave.push({
          x: newX,
          frequencyMultiplier: multiplier,  //Wavelength is positive
          code: topcodes[i].code
        });

        previousState[topcodes[i].code] = multiplier;
        //console.log(previousState);

        //Number of arrows
        var arrows = '';
        for(var j = 0; j < Math.abs(multiplier); j += 1){
          if(topcodes[i].code == 397) {
            if(multiplier > 0){
              arrows += '↑';
            } else {
              arrows += '↓';
            }
          } else {
            if(multiplier > 0){
              arrows += '↓';
            } else {
              arrows += '↑';
            }
          }
        }
        ctx.font="24px Georgia";
        ctx.textAlign = "left";
        if(Math.abs(multiplier) > 0){
          if(topcodes[i].code == 397){
            ctx.fillText('ω   ' + arrows, newX - 30, 310);
          } else { 
            ctx.fillText('f   ' + arrows, newX - 20, 310);
          }
        }
      } else if(topcodes[i].code == 597){
        newX = topcodes[i].x * xRefactor;
        sineWave.push({
          x: newX,
          frequencyMultiplier: resetValue,  //Wavelength is positive
          code: topcodes[i].code
        });
      }
    }

    //Sort detected topcodes by X
    sineWave.sort(function(a,b){
      return a.x - b.x;
    });



    //canvas Drawing Variables
    const textHeight = 50,
          imageY = 80,
          imageXShift = 75,
          yIntercept = 550,
          waveAmplitude = 40;

    var currentFrequency = 2;
    //Draw first part of the wave
    var firstSection = (sineWave[0]) ? sineWave[0].x : canvasWidth;

    var counter = 0, x = 0,y = yIntercept;
    var increase = 90/180*Math.PI / 9;
    ctx.beginPath();
    for(i = 0; i <= firstSection; i += currentFrequency){
        ctx.moveTo(x,y);
        x = i;
        y = yIntercept - Math.sin(counter) * waveAmplitude;
        counter += increase;
        ctx.lineTo(x,y);
    }
    ctx.stroke();
    ctx.closePath();

    //Write the text
    writeText(ctx,light[currentFrequency],firstSection/2,textHeight);


    //Draw image
    drawImage(ctx,'img-' + sun[currentFrequency], firstSection/2 - imageXShift, imageY);

    //If more sections exist
    for(var sectionIndex = 0; sectionIndex < sineWave.length; sectionIndex += 1){
      var nextSectionX = ((sectionIndex + 1) < sineWave.length) ?
        sineWave[sectionIndex + 1].x : canvasWidth;
      counter = 0, x = sineWave[sectionIndex].x,y = yIntercept;


      //Set the current Frequency
      if(sineWave[sectionIndex].frequencyMultiplier == resetValue){
        currentFrequency = 2;
      } else {
        currentFrequency *= Math.pow(2, sineWave[sectionIndex].frequencyMultiplier);
        currentFrequency = (currentFrequency > 16) ? 16: currentFrequency;
        currentFrequency = (currentFrequency < 0.25) ? 0.25: currentFrequency;
      }
      //console.log(currentFrequency);

      //console.log(currentFrequency);
      ctx.beginPath();
      for(i = sineWave[sectionIndex].x; i <= nextSectionX; i += currentFrequency){
          ctx.moveTo(x,y);
          x = i;
          y = yIntercept - Math.sin(counter) * waveAmplitude;
          counter += increase;
          ctx.lineTo(x,y);
          
      }
      ctx.stroke();
      ctx.closePath();

      //Write text
      writeText(
        ctx,
        light[currentFrequency],
        (sineWave[sectionIndex].x + nextSectionX)/2,
        textHeight
      );

      //drawImage
      drawImage(
        ctx,
        'img-' + sun[currentFrequency],
        (sineWave[sectionIndex].x + nextSectionX)/2 - imageXShift,
        imageY
      );
    }

    //Draw lines here
    for(var sectionIndex = 0; sectionIndex < sineWave.length; sectionIndex += 1){
      if(sineWave[sectionIndex].code == 397){
       ctx.strokeStyle = "#f1c40f";
      } else if(sineWave[sectionIndex].code == 391) {
        ctx.strokeStyle = "#8e44ad";
      }

      ctx.lineWidth=10;
      ctx.beginPath();
      ctx.moveTo(sineWave[sectionIndex].x, 0);
      ctx.lineTo(sineWave[sectionIndex].x, 620);
      ctx.stroke();
      ctx.closePath();

      //Reset Colors
      ctx.strokeStyle = "white";
      ctx.lineWidth=1;

    }
});



//Global variables
var topcodes = [],
    c = {},
    previousState = {},
    writeText = function (ctx, textValue, textX, textY) {
      ctx.font="30px Georgia";
      ctx.textAlign="center";
      ctx.fillText(textValue,textX,textY);
    },
    drawImage = function(ctx,imgID, imageX, imageY){
      var img = document.getElementById(imgID);
      ctx.drawImage(img, imageX, imageY);
    };
const videoWidth = 1200,
      videoHeight = 650,
      canvasWidth = 1420,
      canvasHeight = 750,
      xRefactor = canvasWidth/videoWidth;
