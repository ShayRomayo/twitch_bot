let logo, wutface, images;
let showLogo = false;
let logoTimer;
const logoDelay = 30 * 1000;

let showSlots = false;
let slotsTimer;
let slotsTimerActive = false;
const slotsDelay = 5 * 1000;
const slotsScale = 256;

const canvasWidth = 2560;
const canvasHeight = 1440;
const x1 = 0;
const y1 = 0;
const x2 = 2560 - 1942;
const y2 = 1440 - 1092;

const slotsX1 = canvasWidth / 2 - (slotsScale + 8) * 3 / 2;
const slotsX2 = canvasWidth / 2 + (slotsScale + 8) * 3 / 2;
const slotsY1 = canvasHeight / 2 - (slotsScale + 8);
const slotsY2 = canvasHeight / 2 + (slotsScale + 8);
// const y1 = 1092;
// const x2 = 2560 - 1942;
// const y2 = 1440;
const w = 100;
const h = 75;

function preload() {
  wutface = loadImage('/assets/WUTface.png');
  wutfaceSlots = loadImage('/assets/WUTface.png');
  coinSlots = loadImage('/assets/DengoCoin112.png');
  jackpotSlots = loadImage('/assets/jackpot_5.png');
  ultraFont = loadFont('/assets/Ultra-Regular.ttf');
  payouts = loadJSON('/assets/payouts.json');
}

function setup() {
  createCanvas(2560,1440);
  noStroke()
  textFont(ultraFont);
  wutface.resize(50, 50);
  wutfaceSlots.resize(slotsScale, slotsScale);
  coinSlots.resize(slotsScale, slotsScale);
  jackpotSlots.resize(slotsScale, slotsScale);
  images = [wutfaceSlots, coinSlots, jackpotSlots];
  logo = new Logo(x1, y1, x2, y2, w, h, wutface);
  slots = new Slots(slotsX1, slotsY1, slotsX2, slotsY2, 3, images, payouts);
  socket.on('activateLogo', function() {
    if (showLogo) {
      logoTimer += logoDelay;
    } else {
      logoTimer = millis() + logoDelay;
    }
    showLogo = true;
  })

  socket.on('spinWheel', (res) => {   
    showSlots = true;
    slots.spin(res[0], res[1], res[2], res[3]);
  });

  socket.on('clearSlots', () => {
    slotsTimer = millis() + slotsDelay;
    slotsTimerActive = true;
  });
}

function draw() {
  clear();
  if (showLogo) {
    logo.show();
    logo.update();
    if (logo.position.x <= x1 + 100 / 2 || logo.position.x >= x2 - 100 / 2 || logo.position.y <= y1 + 75 / 2|| logo.position.y >= y2 - 75 / 2) {
      myColor = color(random(255), random(255), random(255));
      fill(myColor);
    }

    if (millis() > logoTimer) {
      showLogo = false;
    }
  }

  if (showSlots) {
    slots.update();
    slots.show();

    if (slotsTimerActive && millis() > slotsTimer) {
      slotsTimerActive = false;
      showSlots = false;
    }
  }
}