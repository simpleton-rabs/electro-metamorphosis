// size/zoom
const CCSLIDER1 = 36;
// rotation
const CCSLIDER2 = 37;
// dissolve - not set up yet
const CCSLIDER3 = 38;
const CCSLIDER4 = 39;
// red
const CCDial1 = 32;
// green
const CCDial2 = 33;
// blue
const CCDial3 = 34;
// rotation
const CCDial4 = 35;


// let r, g, b, a, strokeW;
let r = 255, g = 0, b = 0;
// let scaleFactor = 4;
let scaleFactor = 1;
let myController;
let rotation = 0;
let strokeW = 1;
let random = 1;


function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL)
  angleMode(DEGREES)

  WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
}

function onEnabled() {
  // Display available MIDI input devices
  if (WebMidi.inputs.length < 1) {
    console.log("No device detected.");
  } else {
    WebMidi.inputs.forEach((device, index) => {
      console.log(`${index}: ${device.name}`);
    });
  }
  myController = WebMidi.inputs[0];
  myController.channels[1].addListener("controlchange", allCC);

}

function allCC(e) {
  console.log("controller number = " + e.controller.number + ", value = " + e.data[2]);
  let ratio = e.data[2] / 127
  switch (e.controller.number) {
    case CCSLIDER1:
      //   console.log("Slider 1 moved to " + ratio);
      // size = 100 * ratio;
      scaleFactor = map(e.data[2], 0, 127, 0.5, 12);
      break;
    case CCSLIDER2:
      strokeW = map(e.data[2], 0, 127, 1, 10);
      // r = 255 * ratio;
      break;
    case CCSLIDER3:
      
      break;
    case CCSLIDER4:
      random = map(e.data[2], 0, 127, 1, 10);
      break;
    case CCDial1:
      r = 255 * ratio;
      break;
    case CCDial2:
      g = 255 * ratio;
      break;
    case CCDial3:
      b = 255 * ratio;
      // shapeType = ratio;
      break;
    case CCDial4:
      // a = 255 * ratio;
      rotation = map(e.data[2], 0, 127, 0, 360) * 0.1;
      break;

  }

}

function draw() {
  background(0);
  rotateX(60)
  noFill()


  // stroke(r, g, b);

  translate(0, -800, -350);
  for (var i = 0; i <= 200; i++) {
    // var r = map(sin(frameCount), -1, 1, 0, 255)
    // var g = map(i, 0, 20, 100, 200)
    // var b = map(cos(frameCount), -1, 1, 255, 0)
    stroke(r, g, b);
    strokeWeight(strokeW);
    // rotate(frameCount / 50)
    rotate(rotation)

    beginShape()
    for (var j = 0; j <= 300; j += 60) {
      var rad = i * scaleFactor
      var x = rad * cos(j) 
      var y = rad * sin(j) 
      var z = cos(frameCount * 10 + 4 * i) * 50 * random
      rotateY(20)
      //rotateZ(10)

      

      vertex(x, y, z)

    }
    endShape(CLOSE)
  }

}


