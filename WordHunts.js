let letter_chain = [];
let word_chosen = "";
let words = [];
let num_words = 0;
let points = 0;
let set_limit = 0;
let point_val = [100, 400, 1200, 2000, 3000];
let setup = false;
let keydown = false;
let gameScreen = 0;

class WordHunts extends SimpleScene {

  constructor() {
    super("WordHunt");
  }

  init() {
    document.getElementsByTagName("div")[0].style.display = 'flex';
    document.getElementsByTagName("div")[0].style.justifyContent = 'center';
  }

  preload() {
    this.load.image("start", "images/whstart.png");
    this.load.image("game", "images/whgame.png");
    this.load.image("end", "images/whend.png");
    this.load.image("fill", "images/letterfill.png");
    this.load.image("chain", "images/whchain.png");

    for (var i = 0; i < 26; i++) {
      this.load.image(alphabet[i], `${languages}-letters/regular/` + alphabet[i] + ".png");
      this.load.image(alphabet[i] + "_in", `${languages}-letters/inverted/` + alphabet[i] + ".png");
      this.load.image(alphabet[i] + "_f", `${languages}-letters/final/` + alphabet[i] + ".png");
    }

    for (var i = 0; i < 10; i++) {
      this.load.image(i.toString() + "_p", "numbers/points/" + i + ".png");
      this.load.image(i.toString() + "_w", "numbers/words/" + i + ".png");
      this.load.image(i.toString() + "_t", "numbers/timer/" + i + ".png");
      this.load.image(i.toString() + "_f", "numbers/final/" + i + ".png");
    }
    this.load.image(":_t", "numbers/timer/:.png");
    
    this.load.audio("music", "audio/whmusic.mp3")
    this.load.audio("begin", "audio/begin.mp3");
    this.load.audio("tiktik", "audio/tiktik.mp3");
    for (var i = 0; i < 4; i++) {
      this.load.audio(`${i + 3}letter`, `audio/${i + 3}letter.mp3`);
    }
  }

  create() {
    this.music = this.sound.add("music", {loop: true});
    if (music == 1) {
      this.music.play();
    }
    this.begin = this.sound.add("begin", {loop: false});
    this.tiktik = this.sound.add("tiktik", {loop: true});
    this.valid = [];
    for (var i = 0; i < 4; i++) {
      let valid_word = this.sound.add(`${i + 3}letter`, {loop: false});
      this.valid.push(valid_word);
    }

    this.startScreen = this.add.sprite(deviceWidth * 0.5 + no_start * -deviceWidth, deviceHeight * (907 / iphoneHeight), "start");
    this.startScreen.scale = scaleFactor;
    this.startScreen.setOrigin(0.5, 0.5);

    this.startButton = this.add.rectangle(deviceWidth * 0.5 + no_start * -deviceWidth, deviceHeight * (1330 / iphoneHeight), deviceWidth * (240 / iphoneWidth), deviceHeight * (100 / iphoneHeight), 0xffffff);
    this.startButton.setOrigin(0.5, 0.5);
    this.startButton.setAlpha(0.01);
    this.startButton.enableClick();

    this.gameScreen = this.add.sprite(deviceWidth * 1.5 + no_start * -deviceWidth, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "game");
    this.gameScreen.scale = scaleFactor;
    this.gameScreen.setOrigin(0.5, 0.5);

    this.endScreen = this.add.sprite(deviceWidth * 1.5, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "end");
    this.endScreen.scale = scaleFactor;
    this.endScreen.setOrigin(0.5, 0.5);

    this.chain = this.add.sprite(deviceWidth * 0.5, deviceHeight * (900 / iphoneHeight), "chain");
    this.chain.scale = scaleFactor;
    this.chain.scaleX = 0.08;
    this.chain.setOrigin(0.5, 0.5);
    this.chain.setAlpha(0);

    this.letterFills = [];
    for (var i = 0; i < 16; i++) {
      let cover = this.add.sprite((deviceWidth * (221 / iphoneWidth) + (i % 4) * deviceWidth * (178 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight) + Math.floor(i / 4) * deviceHeight * (178 / iphoneHeight), "fill");
      cover.scale = scaleFactor * 1.1;
      cover.setAlpha(0.9);
      this.letterFills.push(cover);
    }

    this.letterShadows = [];
    for (var i = 0; i < 16; i++) {
      let letter = this.add.sprite((deviceWidth * (223 / iphoneWidth) + (i % 4) * deviceWidth * (178 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (880 / iphoneHeight) + Math.floor(i / 4) * deviceHeight * (178 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])] + "_in");
        letter.scale = scaleFactor;
      letter.setOrigin(0.5, 0.5);
      this.letterShadows.push(letter);
    }

    this.letters = [];
    for (var i = 0; i < 16; i++) {
      let letter = this.add.sprite((deviceWidth * (221 / iphoneWidth) + (i % 4) * deviceWidth * (178 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight) + Math.floor(i / 4) * deviceHeight * (178 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])]);
      letter.scale = scaleFactor;
      letter.setOrigin(0.5, 0.5);
      this.letters.push(letter)
    }

    this.letterCovers = [];
    for (var i = 0; i < 16; i++) {
      //let cover = this.add.rectangle((deviceWidth * (221 / iphoneWidth) + (i % 4) * deviceWidth * (178 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight) + Math.floor(i / 4) * deviceHeight * (178 / iphoneHeight), (deviceWidth * (120 / iphoneWidth)), (deviceHeight * (120 / iphoneHeight)), 0xffffff);
      let cover = this.add.circle((deviceWidth * (221 / iphoneWidth) + (i % 4) * deviceWidth * (178 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight) + Math.floor(i / 4) * deviceHeight * (178 / iphoneHeight), (deviceWidth * (70 / iphoneWidth)), 0xffffff);
      cover.setAlpha(0.01);
      cover.enableClick();
      this.letterCovers.push(cover);
    }

    this.line = this.add.graphics();
    this.line.lineStyle(deviceWidth * (22 / iphoneWidth), 0xff0000, 0.5);
    this.line.lineCap = 'round';
    this.line.setAlpha(0.5);
     
    this.input.on('pointerup', (pointer) => {
      if (word_chosen.length >= 3) {
        this.enterWord(word_chosen);
      }
      for (var i = 0; i < 16; i++) {
        if (this.letterFills[i].alpha == 0.9) {
          this.tweens.add({
            targets: this.letterFills[i],
            alpha: 0.01,
            duration: 200,
            ease: 'Linear', 
          });
        }
      }
      this.line.clear();
      this.tweens.add({
        targets: this.chain,
        alpha: 0,
        duration: 200,
        ease: 'Linear', 
      });
      setTimeout (() => {
        this.chain.scaleX = 0.08;
        this.chain.setTint(0xffffff);
      }, 200);
      letter_chain = [];
      word_chosen = "";
      document.getElementsByClassName("wh-floating-text")[0].innerHTML = "";
    });

    this.words = [];
    let word_num = this.add.sprite(deviceWidth * (490 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (97 / iphoneHeight), "0_w");
    word_num.setOrigin(0, 0.5);
    word_num.setScale(scaleFactor);
    this.words.push(word_num);
    
    this.points = [];
    for (var i = 0; i < 4; i++) {
      let point = this.add.sprite(deviceWidth * (590 / iphoneWidth) + i * (deviceWidth * (50 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (150 / iphoneHeight), "0_p");
      point.setOrigin(0, 0.5);
      point.setScale(scaleFactor);
      this.points.push(point);
    }

    let str_min = countdownMin.toString();
    let str_sec = countdownSec.toString();
    if (countdownMin <= 9) {
      str_min = "0" + countdownMin.toString();
    }
    if (countdownSec <= 9) {
      str_sec = "0" + countdownSec.toString();
    }
    let str_time = str_min + ":" + str_sec;

    this.timer = [];
    for (var i = 0; i < str_time.length; i++) {
      let time = this.add.sprite(deviceWidth * (710 / iphoneWidth) + i * (deviceWidth * (20 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (275 / iphoneHeight), str_time[i] + "_t");
      time.setOrigin(0, 0.5);
      time.setScale(scaleFactor);
      this.timer.push(time)
    }

    if (no_start == 1) {
      gameScreen = 1;
      this.time.addEvent({
          delay: 1000,
          callback: updateCountdown,
          callbackScope: this,
          loop: true
      });
    }

  }

  update() {
    if (gameScreen == 1) {
      for (var i = 0; i < 16; i++) {
        if (this.letterCovers[i].isClicked()) {
          if (!letter_chain.includes(i)) {
              this.chain.setTint(0xffffff);
              this.line.clear();
              this.line.lineStyle(deviceWidth * (22 / iphoneWidth), 0xff0000, 0.5);
              this.line.lineCap = 'round';
              this.line.setAlpha(0.5);
              this.letterFills[i].setAlpha(0.9);
              this.chain.setAlpha(1);
              this.chain.scaleX *= 1.17;
              letter_chain.push(i);
              word_chosen += letter_inputs[i];
              document.getElementsByClassName("wh-floating-text")[0].innerHTML = word_chosen;
              this.checkWord();
            if (letter_chain.length == 0) {
              this.line.beginPath();
              this.line.moveTo(this.letterCovers[i].x, this.letterCovers[i].y);
            } else {
              this.line.beginPath();
              this.line.moveTo(this.letterCovers[letter_chain[0]].x, this.letterCovers[letter_chain[0]].y);
              for (var k = 0; k < letter_chain.length; k++) {
                this.line.lineTo(this.letterCovers[letter_chain[k]].x, this.letterCovers[letter_chain[k]].y);
              }
              this.line.strokePath();
            }
          } else if (letter_chain.includes(i) && i != letter_chain[letter_chain.length - 1]) {
            this.line.clear();
            this.line.lineStyle(deviceWidth * (22 / iphoneWidth), 0xff0000, 0.5);
            this.line.lineCap = 'round';
            this.line.setAlpha(0.5);
            for (var j = letter_chain.length - 1; j > letter_chain.indexOf(i); j--) {
              this.letterFills[letter_chain[j]].setAlpha(0.01);
              this.chain.scaleX *= 0.85;
              word_chosen = word_chosen.substring(0, word_chosen.length - 1);
              document.getElementsByClassName("wh-floating-text")[0].innerHTML = word_chosen;
              this.chain.setTint(0xffffff);
              this.checkWord();
              letter_chain.pop();
            }
            this.line.beginPath();
            this.line.moveTo(this.letterCovers[letter_chain[0]].x, this.letterCovers[letter_chain[0]].y);
            for (var k = 0; k < letter_chain.length; k++) {
              this.line.lineTo(this.letterCovers[letter_chain[k]].x, this.letterCovers[letter_chain[k]].y);
            }
            this.line.strokePath();
          }
        }
      }
    }

    if (this.startButton.wasClicked()) {
      this.startGame();
    }

  }

  checkWord () {
    let input_word = word_chosen.toLowerCase();
    if (filteredArray.includes(input_word) && !words.includes(input_word)) {
      for (var i = 0; i < 6; i++) {
        this.chain.scaleX *= 1.17;
      }
      document.getElementsByClassName("wh-floating-text")[0].innerHTML += ` (+${point_val[word_chosen.length - 3]})`
      this.chain.setTint(0xa8fc98);
    } else if (words.includes(input_word)) {
      this.chain.setTint(0xedea88);
    }
  }

  enterWord (word_chosen) {
    let input_word = word_chosen.toLowerCase();
    if (filteredArray.includes(input_word) && !words.includes(input_word)) {
      words.push(input_word);
      num_words += 1;
      setTextArray(this, this.words, num_words.toString(), "_w");
      set_limit += point_val[input_word.length - 3];
      this.time.addEvent({
          delay: 1,
          callback: updatePoints,
          callbackScope: this,
          loop: true
      });

      if (sound == 1) {
        this.valid[input_word.length - 3].play();
      }
    }
  }

  startGame() {
    gameScreen = 1;
    this.startButton.setAlpha(0);
    if (sound == 1) {
      this.begin.play();
    }
    this.addTween(this.startScreen, -deviceWidth * 0.5, this.startScreen.y, 200);
    this.addTween(this.gameScreen, deviceWidth * 0.5, this.gameScreen.y, 200);
    this.words.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.points.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.timer.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });

    for (var i = 0; i < 16; i++) {
      this.addTween(this.letterShadows[i], this.letterShadows[i].x - deviceWidth, this.letterShadows[i].y, 200);
      this.addTween(this.letters[i], this.letters[i].x - deviceWidth, this.letters[i].y, 200);
      this.addTween(this.letterCovers[i], this.letterCovers[i].x - deviceWidth, this.letterCovers[i].y, 200);
      this.addTween(this.letterFills[i], this.letterFills[i].x - deviceWidth, this.letterFills[i].y, 200);
    }
    this.time.addEvent({
        delay: 1000,
        callback: updateCountdown,
        callbackScope: this,
        loop: true
    });
  }

  addTween(target, x, y, duration) {
    this.tweens.add({
      targets: target,
      x: x,
      y: y,
      duration: duration,
      ease: 'Power1',
    });
  }
}

function updateCountdown() {
  if (timer == 1) {
    countdownSec--;
  if (countdownSec == -1 && countdownMin >= 1) {
    countdownMin -= 1;
    countdownSec = 59;
  }

  let str_min = countdownMin.toString();
  let str_sec = countdownSec.toString();
  if (countdownMin <= 9) {
    str_min = "0" + countdownMin.toString();
  }
  if (countdownSec <= 9) {
    str_sec = "0" + countdownSec.toString();
  }
  let str_time = str_min + ":" + str_sec;

  if (countdownMin == 0 && countdownSec == 5 && sound == 1) {
    this.tiktik.play();
  }

    if (countdownSec == -1 && countdownMin == 0 && countdownSec != -10) {
      this.time.removeAllEvents();  // Stop the countdown
      const scene = game.scene.keys.Anagrams;
      scene.endGame();
      countdownSec = -10;
    } else {
      setTextArray(this, this.timer, str_time, "_t");
    }
  }
}

function setTextArray(scene, array, set, folder) {
  for (var i = 0; i < array.length; i++) {
    array[i].setTexture(set[i] + folder);
  }
  for (var i = array.length; i < set.length; i++) {
    let distance = 0;
    if (folder == "_p") {
      distance = 50;
    } else if (folder == "_w") {
      distance = 25;
    } else if (folder == "_t") {
      distance = 20;
    }
    let new_var = scene.add.sprite(array[array.length - 1].x + array.length * (deviceWidth * (distance / iphoneWidth)), array[array.length - 1].y, set[i] + folder);
    new_var.setScale(scaleFactor);
    new_var.setOrigin(0, 0.5);
    array.push(new_var);
  }
}

function updatePoints() {
  if (points < set_limit) {
    if (set_limit - points <= 10) {
      points = set_limit;
    } else {
      points += Phaser.Math.Between(1, (set_limit - points) / 10);
    }
    let point_str = points.toString();
    if (point_str.length < 4) {
      point_str = "0" + point_str;
    }
    setTextArray(this, this.points, point_str, "_p");
  }
}