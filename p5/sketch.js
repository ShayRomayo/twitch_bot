let myColor;
let logo;
let img;
let showLogo = false;
let logoCountdown = 0;

function preload() {
  img = loadImage('/assets/WUTface.png');
}

function setup() {
  createCanvas(2560,1440);
  logo = new Logo(0, 0, 2560 - 1942, 1440 - 1092, img);
  myColor = getItem('myColor');
  socket.on('changeColor', function(data) {
    myColor = color(random(255), random(255), random(255));
    storeItem('myColor', myColor);
  })
  socket.on('activateLogo', function() {
    showLogo = true;
    logoCountdown += 60 * 30;
  })

}

function draw() {
  clear();
  if (myColor !== null) {
    fill(myColor);
  }
  if (showLogo) {
    logo.show();
    logo.update();

    if (--logoCountdown == 0) {
      showLogo = false;
    }
  }
  
}