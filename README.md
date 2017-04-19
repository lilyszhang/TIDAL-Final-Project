# TIDAL-topcodes-demo  

Technology demo for EECS 395: Tangible Interaction Design and Learning  

5. Tutorial: Put together a detailed, step-by-step tutorial that explains how you did your Creative Stretch project. This tutorial can be in the form of a document or a video.

### Tutorial
1. Download the example project in the Javascript folder [here](https://github.com/TIDAL-Lab/TopCodes)
2. Open up `index.html` and add the CDN link for [P5.js](https://github.com/TIDAL-Lab/TopCodes), the library we'll be using to draw to the browser canvas
``` HTML
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.8/p5.min.js"></script>
```
3. Once we have the CDN included with our html, we can create a `sketch.js` file, link it to our HTML, and add the following code: 
```Javascript
function setup(){
    canvas = createCanvas(600, 400);
}

function draw() {
}
```
4. Add the topcodes starter code to your sketch file and add code to your draw loop to check which topcodes are currently on the screen
5. Depending on the given topcode, perfom a certain action (draw to screen, erase, change color)
6. Update element positioning using a `style.css` file to get the desired layout
