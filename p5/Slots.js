const initialDelay = 500;

Array.prototype.equals = function(arr) {
    return this.length == arr.length &&
        this.every((a, b) => {
            return a == arr[b];
        });
}

function Slots(x1, y1, x2, y2, numSlots, images, payouts) {
    this.width = (x2 - x1) / numSlots - 4;
    this.height = (y2 - y1) / 2 - 4;
    this.numSlots = numSlots;
    this.startVector = createVector(x1, y1);
    this.endVector = createVector(x2, y2);
    this.images = images;
    this.payouts = payouts.payouts;
    this.payout = -1;
    this.spinning = [];
    this.displays = [];
    this.displayVectors = [];
    this.delays = [];
    this.timers = [];
    this.resultsShow = false;
    this.resultsDelay = 5000;
    this.resultsTimer = millis();
    for (let i = 0 ; i < numSlots ; i++) {
        append(this.spinning, false);
        append(this.displays, int(random(0, this.images.length)));
        append(this.displayVectors, createVector(x1 + ((x2 - x1) / numSlots) * i, y1));
        append(this.delays, 50);
        append(this.timers, millis());
    }

    this.currentBet = -1;
    this.currentSpinner = "none";
    this.currentUserId = "none";
    this.currentUserLogin = "none";

    this.update = () => {
        for (let i = 0 ; i < this.displays.length ; i++) {
            if (this.spinning[i]) {
                if (millis() > this.timers[i]) {
                    this.timers[i] = millis() + this.delays[i];

                    if (i < 1 || this.delays[i - 1] > 500) {
                        this.delays[i] += 10;
    
                        if (this.delays[i] > 90) {
                            this.delays[i] += 50;
                        }
                    }

                    if (++this.displays[i] >= this.images.length) {
                        this.displays[i] = 0;
                    }
                }

                if (this.delays[i] > 500) {
                    this.spinning[i] = false;
                    if (i == this.displays.length - 1) {
                        this.payouts.forEach(element => {
                            if (element.displays.equals(this.displays)) {
                                this.payout = element.payout;
                                this.resultsShow = true;
                                this.resultsTimer = millis() + this.resultsDelay;
                                socket.emit('successfulGamble', [this.currentSpinner, this.currentUserId, this.currentUserLogin, int(this.currentBet * this.payout - this.currentBet)]);
                            }
                        });
                        
                        if (this.payout == -1) {
                            this.payout = 0;
                            this.resultsShow = true;
                            this.resultsTimer = millis() + this.resultsDelay;
                            socket.emit('successfulGamble', [this.currentSpinner, this.currentUserId, this.currentUserLogin, int(this.currentBet * this.payout - this.currentBet)]);
                        }
                    }
                }
            }
        }

        if (millis() > this.resultsTimer) {
            this.resultsShow = false;
            this.payout = -1;
        }
    }

    this.show = () => {        
        for (let i = 0 ; i < this.displays.length ; i++) {
            push();
            if (!this.spinning[i]) {
                stroke(255, 204, 0);
                strokeWeight(4);
            }
            let displayVector = this.displayVectors[i];
            let display = this.displays[i];
            let img = this.images[display];
            image(img, displayVector.x + 4, displayVector.y + 4);
            pop();
        }

        if (this.resultsShow) {
            push();
            fill(255, 204, 0);
            textSize(56);
            stroke(0);
            strokeWeight(2);
            textWrap(WORD);
            textAlign(CENTER, BOTTOM);
            let formatText = formatResults(this.currentSpinner, this.currentBet, this.payout);
            text(formatText, this.startVector.x, this.startVector.y + this.height, this.width * 3, this.height);
            pop();
        }
    }

    this.spin = (spinner, id, login, bet) => {
        console.log(`${spinner}, ${bet}`);
        if (this.resultsShow) {
            socket.emit('failedGamble', [spinner, id, login, bet]);
            return;
        };
        for (let i = 0 ; i < this.spinning.length ; i++) {
            if (this.spinning[i]) {
                socket.emit('failedGamble', [spinner, id, login, bet]);
                return;
            }
        }
        this.currentBet = bet;
        this.currentSpinner = spinner;
        this.currentUserId = id;
        this.currentUserLogin = login;
        for (let i = 0 ; i < this.spinning.length ; i++) {
            this.delays[i] = 50;
            this.spinning[i] = true;
        }
    }

}

function formatResults(spinner, bet, payout) {
    if (payout < 1) {
        return `${spinner} LOSES ${bet - bet * payout}`;
    } else if (payout == 1) {
        return `${spinner} goes even!`;
    } else if (payout > 1 && payout < 10) {
        return `${spinner} WINS ${bet * payout - bet}`;
    } else if (payout >= 10) {
        return `${spinner} HIT THE JACKPOT!!!`;
    }
}