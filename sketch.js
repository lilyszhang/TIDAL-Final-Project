TopCodes.setVideoFrameCallback("video-canvas", function(jsonString) {
  var json = JSON.parse(jsonString);
  topcodes = json.topcodes;
});


function drawCodes(topcodes) {
  var ctx = document.querySelector("#video-canvas").getContext('2d');
  ctx.fillStyle = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", 0.8)";
  for (i=0; i<topcodes.length; i++) {
    ctx.beginPath();
    ctx.arc(topcodes[i].x, topcodes[i].y, topcodes[i].radius, 0, Math.PI*2, true);
    ctx.fill();
  }
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


var topcodes = [];
var c = {}

function setup(){
    canvas = createCanvas(1280, 600);
    canvas.class("lemon");
    c = {
        r: 0,
        g: 0,
        b: 0
    }
    fill(c.r, c.g, c.b);
}

function draw() {
    if(c != null){
        noStroke();
        fill(c.r, c.g, c.b);
    }
    for(var i=0; i<topcodes.length; i++){
        if(topcodes[i].code == 327){
            ellipse((topcodes[i].x/852)*width, (topcodes[i].y/400)*height, topcodes[i].angle*50/6.3, topcodes[i].angle*50/6.3);
        } else if(topcodes[i].code == 31) {
            background(255, 100);
        } else if (topcodes[i].code == 93){
            var hue = (topcodes[i].y/400);
            c = HSVtoRGB(hue, 1, 1)
        }
    }
}
