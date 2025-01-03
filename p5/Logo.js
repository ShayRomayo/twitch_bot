// const logoWidth = 100;
// const logoHeight = 75;
// const horizontalNormal = p5.Vector.createVector(0, 1);
// const verticalNormal = p5.Vector.createVector(1, 0);
// const variance = p5.QUARTER_PI / 4;
const speed = 1.5;

function Logo(x1, y1, x2, y2, w, h, img) {
    const xRadius = w / 2;
    const yRadius = h / 2;
    const variance = QUARTER_PI / 4;
    this.position = createVector(random(x1 + xRadius, x2 - xRadius), random(y1 + yRadius, y2 - yRadius))
    this.velocity = p5.Vector.random2D().mult(speed);
    this.origin = createVector(x1 + xRadius, y1 + yRadius);
    this.bound = createVector(x2 - xRadius, y2 - yRadius);

    this.update = () => {
        this.position.add(this.velocity);
        if (this.position.y >= this.bound.y) {
            this.position.y = this.bound.y;
            this.reflectRandom(this.velocity, createVector(0, 1));
        }
        if (this.position.y <= this.origin.y) {
            this.position.y = this.origin.y;
            this.reflectRandom(this.velocity, createVector(0, 1));
        }

        if (this.position.x >= this.bound.x) {
            this.position.x = this.bound.x;
            this.reflectRandom(this.velocity, createVector(1, 0));
        }
        if (this.position.x <= this.origin.x) {
            this.position.x = this.origin.x;
            this.reflectRandom(this.velocity, createVector(1, 0));
        }
    }
    
    this.show = () => {
        ellipse(this.position.x, this.position.y, w, h);
        image(img, this.position.x - img.width / 2, this.position.y - img.height / 2);
    }

    this.reflectRandom = (vector, normal) => {
        p5.Vector.reflect(vector, normal, vector);
        vector.rotate(random(-variance, variance));
    }
}