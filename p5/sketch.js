let myColor;

function setup() {
  createCanvas(677,381);
  myColor = getItem('myColor');
  socket.on('changeColor', function(data) {
    myColor = color(random(255), random(255), random(255));
    storeItem('myColor', myColor);
  })
}

function draw() {
  if (myColor !== null) {
    background(myColor);
  }
}