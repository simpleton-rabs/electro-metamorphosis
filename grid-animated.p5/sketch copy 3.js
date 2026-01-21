// ================= MIDI CONTROLS =================
const CCSLIDER1 = 36; // size/zoom
const CCSLIDER2 = 37; // stroke
const CCSLIDER3 = 38; // dissolve morph
const CCSLIDER4 = 39; // randomness

const CCDial1 = 32; // red
const CCDial2 = 33; // green
const CCDial3 = 34; // blue
const CCDial4 = 35; // rotation


// ================= GLOBALS =================

let r = 255, g = 0, b = 0;
let scaleFactor = 1;
let rotation = 0;
let strokeW = 1;
let random = 1;

let myController;

// morph
let morphAmount = 0;

// particles
let particles = [];


// ================= SETUP =================

function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL);
  angleMode(DEGREES);

  WebMidi.enable()
    .then(onEnabled)
    .catch(err => alert(err));
}


// ================= MIDI =================

function onEnabled() {
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
  let ratio = e.data[2] / 127;

  switch (e.controller.number) {
    case CCSLIDER1:
      scaleFactor = map(e.data[2], 0, 127, 0.5, 12);
      rebuildParticles();
      break;

    case CCSLIDER2:
      strokeW = map(e.data[2], 0, 127, 1, 10);
      break;

    case CCSLIDER3:
      morphAmount = map(e.data[2], 0, 127, 0, 1);
      break;

    case CCSLIDER4:
      random = map(e.data[2], 0, 127, 1, 10);
      rebuildParticles();
      break;

    case CCDial1: r = 255 * ratio; break;
    case CCDial2: g = 255 * ratio; break;
    case CCDial3: b = 255 * ratio; break;

    case CCDial4:
      rotation = map(e.data[2], 0, 127, 0, 360) * 0.1;
      rebuildParticles();
      break;
  }
}


// ================= PARTICLES =================

class Particle {
  constructor(x, y, z) {
    this.origin = createVector(x, y, z);
    this.pos = this.origin.copy();
    this.vel = p5.Vector.random3D().mult(0.6);
  }

  update() {
    // diffuse motion
    this.pos.add(this.vel);

    // soft wrap
    if (this.pos.mag() > 1500) {
      this.pos = p5.Vector.random3D().mult(500);
    }
  }

  draw() {
    let finalPos = p5.Vector.lerp(this.origin, this.pos, morphAmount);
    point(finalPos.x, finalPos.y, finalPos.z);
  }
}


// ================= BUILD PARTICLES FROM YOUR SHAPE =================

function rebuildParticles() {
  particles = [];

  for (var i = 0; i <= 200; i++) {
    for (var j = 0; j <= 300; j += 60) {

      let rad = i * scaleFactor;
      let x = rad * cos(j);
      let y = rad * sin(j);
      let z = cos(frameCount * 10 + 4 * i) * 50 * random;

      particles.push(new Particle(x, y, z));
    }
  }
}


// ================= DRAW =================

function draw() {
  background(0);
  rotateX(60);
  noFill();

  stroke(r, g, b);
  strokeWeight(strokeW);

  translate(0, -800, -350);
  rotate(rotation);

  // -------- ORIGINAL SHAPE --------
  if (morphAmount < 0.01) {
    for (var i = 0; i <= 200; i++) {
      beginShape();
      for (var j = 0; j <= 300; j += 60) {
        var rad = i * scaleFactor;
        var x = rad * cos(j);
        var y = rad * sin(j);
        var z = cos(frameCount * 10 + 4 * i) * 50 * random;

        rotateY(20);
        vertex(x, y, z);
      }
      endShape(CLOSE);
    }
  }

  // -------- PARTICLE MORPH --------
  else {
    if (particles.length === 0) rebuildParticles();

    for (let p of particles) {
      p.update();
      p.draw();
    }
  }
}
