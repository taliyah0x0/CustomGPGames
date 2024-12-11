let letter_chain = [];
let word_chosen = "";
let prev_word = "";
let words = [];
let num_words = 0;
let points = 0;
let set_limit = 0;
let gameScreen = 0;

class WordHunts extends SimpleScene {

  constructor() {
    super("WordHunts");
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
    this.load.image("blank", "images/wordblank.png");
    this.load.image("endButton", "images/endbutton.png");
    this.load.image("playagain", "images/playagain.png");
    this.load.image("letter", "images/letter.png");

    for (var i = 0; i < alphabet.length; i++) {
      this.load.image(alphabet[i], `${languages}-letters/regular-copy/` + i + ".png");
      this.load.image(alphabet[i] + "_in", `${languages}-letters/inverted-copy/` + i + ".png");
      this.load.image(alphabet[i] + "_f", `${languages}-letters/final-copy/` + i + ".png");
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
    this.load.audio("complete", "audio/complete.mp3");
    this.load.audio("select", "audio/whselect.mp3");
    this.load.audio("deselect", "audio/whdeselect.mp3");
    this.load.audio("pop", "audio/whpop.mp3");

    for (var i = 0; i < 4; i++) {
      this.load.audio(`${i + 3}letter`, `audio/${i + 3}letter.mp3`);
    }
  }

  create() {
    this.music = this.sound.add("music", {loop: true});
    if (music) this.music.play();
    this.begin = this.sound.add("begin", {loop: false});
    this.tiktik = this.sound.add("tiktik", {loop: true});
    this.complete = this.sound.add("complete", {loop: false});
    this.select = this.sound.add("select", {loop: false});
    this.deselect = this.sound.add("deselect", {loop: false});
    this.pop = this.sound.add("pop", {loop: false});

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
    this.chain.scaleX = deviceWidth * (0.08 / iphoneWidth);
    this.chain.setOrigin(0.5, 0.5);
    this.chain.setAlpha(0);

    this.letterBoards = [];
    for (var i = 0; i < rows * cols; i++) {
      let cover = this.add.sprite(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), "letter");
      if (format > 4) {
        cover.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        cover.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        cover.scale = scaleFactor * 1.18 * (4 / format);
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        cover.scale = scaleFactor * 1.18;
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      cover.setOrigin(0.5, 0.5);
      if (letter_inputs[i] == "") {
        cover.setAlpha(0);
      }
      this.letterBoards.push(cover);
    }

    this.letterFills = [];
    for (var i = 0; i < rows * cols; i++) {
      let cover = this.add.sprite(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), "fill");
      if (format > 4) {
        cover.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        cover.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        cover.scale = scaleFactor * 1.1 * (4 / format);
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        cover.scale = scaleFactor * 1.1;
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") {
        cover.setAlpha(0);
      } else {
        cover.setAlpha(0.9);
      }
      cover.setOrigin(0.5, 0.5);
      this.letterFills.push(cover);
    }

    this.letterShadows = [];
    for (var i = 0; i < rows * cols; i++) {
      let letter = this.add.sprite(deviceWidth * (223 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (880 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])] + "_in");
      if (format > 4) {
        letter.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        letter.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        letter.scale = scaleFactor * (4 / format);
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        letter.scale = scaleFactor;
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") {
        letter.setAlpha(0);
      }
      letter.setOrigin(0.5, 0.5);
      this.letterShadows.push(letter);
    }

    this.letters = [];
    for (var i = 0; i < rows * cols; i++) {
      let letter = this.add.sprite(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])]);
      if (format > 4) {
        letter.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        letter.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        letter.scale = scaleFactor * (4 / format);
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        letter.scale = scaleFactor;
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") {
        letter.setAlpha(0);
      }
      letter.setOrigin(0.5, 0.5);
      this.letters.push(letter);
    }

    this.letterCovers = [];
    for (var i = 0; i < rows * cols; i++) {
      let cover = this.add.circle(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), (deviceWidth * (70 / iphoneWidth)) * (4 / format), 0xffffff);
      cover.setAlpha(0.01);
      if (format != 4) {
        cover.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        cover.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") {
        cover.setAlpha(0);
      }
      cover.enableClick();
      this.letterCovers.push(cover);
    }

    this.line = this.add.graphics();
    this.line.lineStyle(deviceWidth * (22 / iphoneWidth) * (4 / format), 0xff0000, 0.5);
    this.line.lineCap = 'round';
    this.line.setAlpha(0.5);
     
    this.input.on('pointerup', (pointer) => {
      if (word_chosen.length >= 3) {
        this.enterWord(word_chosen);
      }
      for (var i = 0; i < rows * cols; i++) {
        if (this.letterFills[i].alpha == 0.9) {
          if (sound) this.deselect.play();
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
        this.chain.scaleX = deviceWidth * (0.08 / iphoneWidth);
        this.chain.setTint(0xffffff);
      }, 200);
      letter_chain = [];
      word_chosen = "";
      document.getElementsByClassName("wh-floating-text")[0].style.transition = "0.2s ease";
      document.getElementsByClassName("wh-floating-text")[0].style.opacity = 0;
      setTimeout (() => {
        document.getElementsByClassName("wh-floating-text")[0].innerHTML = "";
      }, 400);
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

    if (no_start) {
      gameScreen = 1;
      this.time.addEvent({
          delay: 1000,
          callback: updateCountdown,
          callbackScope: this,
          loop: true
      });
    }

    this.endButton = this.add.sprite(deviceWidth * (775 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (275 / iphoneHeight), "endButton");
    this.endButton.setScale(scaleFactor);
    this.endButton.enableClick();

    if (!timer) {
      for (let i = 0; i < this.timer.length; i++) {
        this.timer[i].setAlpha(0);
      }
    } else {
      this.endButton.setAlpha(0);
    }

    this.playAgain = this.add.sprite(deviceWidth * 0.5, deviceHeight * (350 / iphoneHeight), "playagain");
    this.playAgain.setScale(scaleFactor);
    this.playAgain.enableClick();
    this.playAgain.setAlpha(0);
  }

  update() {
    if (gameScreen) {
      for (var i = 0; i < rows * cols; i++) {
        if (this.letterCovers[i].isClicked()) {
          let p = parseInt(letter_chain[letter_chain.length - 1]);
          if (!letter_chain.includes(i) // not been selected previously
          && (letter_chain.length == 0 // first letter
          || (i == p + cols // same column down one
          || i == p - cols // same column up one
          || (!(p % cols == 0) && (i == p - 1 || i == p - cols - 1 || i == p + cols - 1)) // left diaganols and left, avoid leftmost edge case
          || (!(p % cols == cols - 1) && (i == p + 1 || i == p + cols + 1 || i == p - cols + 1)) // right diaganols and right, avoid rightmost edge case
          ))) {
              this.chain.setTint(0xffffff);
              this.line.clear();
              this.line.lineStyle(deviceWidth * (22 / iphoneWidth) * (4 / format), 0xff0000, 0.5);
              this.line.lineCap = 'round';
              this.line.setAlpha(0.5);
              this.letterFills[i].setAlpha(0.9);
              this.chain.setAlpha(1);
              this.chain.scaleX += deviceWidth * (0.063 / iphoneWidth) + (languages == 'jp') * 0.015;
              letter_chain.push(i);
              prev_word = word_chosen;
              word_chosen += letter_inputs[i];
              document.getElementsByClassName("wh-floating-text")[0].style.transition = "none";
              document.getElementsByClassName("wh-floating-text")[0].style.opacity = 1;
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
          } /*else if (letter_chain.includes(i)) {
            this.line.clear();
            this.line.lineStyle(deviceWidth * (22 / iphoneWidth), 0xff0000, 0.5);
            this.line.lineCap = 'round';
            this.line.setAlpha(0.5);
            if (i != letter_chain[letter_chain.length - 1]) {
              for (var j = letter_chain.length - 1; j > letter_chain.indexOf(i); j--) {
                this.letterFills[letter_chain[j]].setAlpha(0.01);
                prev_word = word_chosen;
                word_chosen = word_chosen.substring(0, word_chosen.length - 1);
                document.getElementsByClassName("wh-floating-text")[0].innerHTML = word_chosen;
                this.chain.setTint(0xffffff);
                this.chain.scaleX -= 0.035;
                this.checkWord();
                letter_chain.pop();
              }
            }
            this.line.beginPath();
            this.line.moveTo(this.letterCovers[letter_chain[0]].x, this.letterCovers[letter_chain[0]].y);
            for (var k = 0; k < letter_chain.length; k++) {
              this.line.lineTo(this.letterCovers[letter_chain[k]].x, this.letterCovers[letter_chain[k]].y);
            }
            this.line.strokePath();
          }*/
        }
      }
    }

    if (this.startButton.wasClicked()) this.startGame();
    if (this.endButton.wasClicked()) this.endGame();
    if (this.playAgain.wasClicked()) window.location.reload();
  }

  checkWord () {
    let input_word = word_chosen.toLowerCase();
    prev_word = prev_word.toLowerCase();
    if (filteredArray.includes(input_word) && !words.includes(input_word)) {
      if (sound) this.pop.play();
      for (var i = 0; i < 6; i++) {
        this.chain.scaleX += deviceWidth * (0.063 / iphoneWidth);
      }
      let point_val = 100;
      if (input_word.length > 3) point_val = (input_word.length - 3) * 400;
      document.getElementsByClassName("wh-floating-text")[0].innerHTML += ` (+${point_val})`
      this.chain.setTint(0xa8fc98);
    } else if (filteredArray.includes(input_word) && words.includes(input_word)) {
      this.chain.setTint(0xedea88);
      if (sound) this.select.play();
    } else {
      if (sound) this.select.play();
    }
    if (filteredArray.includes(prev_word) && !words.includes(prev_word)){
      for (var i = 0; i < 6; i++) {
        this.chain.scaleX -= deviceWidth * (0.063 / iphoneWidth);
      }
    }
  }

  enterWord (word_chosen) {
    let input_word = word_chosen.toLowerCase();
    if (filteredArray.includes(input_word) && !words.includes(input_word)) {
      words.push(input_word);
      num_words += 1;
      setTextArray(this, this.words, num_words.toString(), "_w");
      let point_val = 100;
      if (input_word.length > 3) point_val = (input_word.length - 3) * 400;
      set_limit += point_val;
      this.time.addEvent({
          delay: 1,
          callback: updatePoints,
          callbackScope: this,
          loop: true
      });
      setTimeout(() => {
        points = set_limit;
        let point_str = points.toString();
        if (point_str.length < 4) {
          point_str = "0" + point_str;
          if (points == 0) {
            point_str = "0000";
          }
        }
        setTextArray(this, this.points, point_str, "_p");
      }, 800);

      let audio = input_word.length - 3;
      if (input_word.length > 6) audio = 3;
      if (sound) this.valid[audio].play();
    }
  }

  startGame() {
    gameScreen = 1;
    this.startButton.setAlpha(0);
    if (sound) this.begin.play();
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
    this.addTween(this.endButton, this.endButton.x - deviceWidth, this.endButton.y, 200);

    for (var i = 0; i < rows * cols; i++) {
      this.addTween(this.letterBoards[i], this.letterBoards[i].x - deviceWidth, this.letterBoards[i].y, 200);
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

  endGame () {
    if (sound) {
      this.tiktik.stop();
      this.complete.play();
    }

    this.addTween(this.gameScreen, -1.5 * deviceWidth, this.gameScreen.y, 200);

    this.addTween(this.endButton, this.endButton.x - deviceWidth, this.endButton.y, 200);

    this.words.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.points.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
      setTimeout (() => { sprite.alpha = 0; }, 200);
    });
    this.timer.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.letterBoards.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.letterCovers.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.letterFills.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.letterShadows.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.letters.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });

    this.addTween(this.endScreen, 0.5 * deviceWidth, this.endScreen.y, 200);

    gameScreen = 2;

    setTimeout(() => {
      this.playAgain.setAlpha(1);
      let num_string = num_words.toString();
      this.wordsEnd = [];
      for (var i = 0; i < num_string.length; i++) {
        let num = this.add.sprite(deviceWidth * (190 / iphoneWidth) + i * deviceWidth * (20 / iphoneWidth), deviceHeight * (580 / iphoneHeight), num_string[i] + "_w");
        num.setScale(scaleFactor * 0.8);
        num.setOrigin(0, 0.5);
        this.wordsEnd.push(num);
      }

      let point_str = set_limit.toString();
      if (point_str.length < 4) {
        point_str = "0" + point_str;
        if (points == 0) {
          point_str = "0000";
        }
      }
      this.pointsEnd = [];
      for (var i = 0; i < point_str.length; i++) {
        let num = this.add.sprite(deviceWidth * (240 / iphoneWidth) + i * deviceWidth * (25 / iphoneWidth), deviceHeight * (620 / iphoneHeight), point_str[i] + "_w");
        num.setScale(scaleFactor);
        num.setOrigin(0, 0.5);
        this.pointsEnd.push(num);
      }

      words.sort((a, b) => b.length - a.length);
      this.blanks = [];
      this.blank_words = [];
      this.point_vals = [];
      let printout = 13;
      if (num_words <= printout) {
        printout = num_words;
      } else {
        document.getElementsByClassName("more")[0].innerHTML = "(" + (num_words - 15) + " more)";
      }
      for (var i = 0; i < printout; i++) {
        let blank = this.add.sprite(deviceWidth * ((145 - ((6 - words[i].length) * 10)) / iphoneWidth), deviceHeight * ((710 + i * 55) / iphoneHeight), "blank");
        blank.setOrigin(0.5, 0.5);
        blank.scaleY = scaleFactor;
        blank.scaleX = scaleFactor - (6 - words[i].length) * 0.12 * scaleFactor;
        this.blanks.push(blank);
        
        let tempWord = words[i].toUpperCase();
        for (var j = 0; j < tempWord.length; j++) {
          let blank_letter = this.add.sprite(deviceWidth * (66 / iphoneWidth) + j * deviceWidth * (26 / iphoneWidth), deviceHeight * ((705 + i * 55) / iphoneHeight), tempWord[j] + "_f");
          blank_letter.setOrigin(0, 0.5);
          blank_letter.setScale(scaleFactor);
          this.blank_words.push(blank_letter);
        }
        
        let point_val = 100;
        if (words[i].length > 3) point_val = (words[i].length - 3) * 400;
        let dispVal = point_val.toString();
        for (var j = 0; j < dispVal.length; j++) {
          let blank_val = this.add.sprite(deviceWidth * (435 / iphoneWidth) - j * deviceWidth * (21 / iphoneWidth), deviceHeight * ((705 + i * 55) / iphoneHeight), dispVal[dispVal.length - j - 1] + "_f");
          blank_val.setOrigin(1, 0.5);
          blank_val.setScale(scaleFactor);
          this.point_vals.push(blank_val);
        }
      }
    }, 200);
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
  if (timer) {
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

  if (countdownMin == 0 && countdownSec == 5 && sound) {
    this.tiktik.play();
  }

    if (countdownSec == -1 && countdownMin == 0 && countdownSec != -10) {
      this.time.removeAllEvents();  // Stop the countdown
      const scene = game.scene.keys.WordHunts;
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
    let new_var = scene.add.sprite(deviceWidth * (590 / iphoneWidth) + array.length * (deviceWidth * (50 / iphoneWidth)), array[array.length - 1].y, set[i] + folder);
    new_var.setScale(scaleFactor);
    new_var.setOrigin(0, 0.5);
    array.push(new_var);
  }
}

function updatePoints() {
  if (points < set_limit) {
    if (set_limit - points <= 5) {
      points = set_limit;
    } else {
      let val = 2 - Math.floor(Math.random() * (set_limit / 100));
      if (val >= 0) points += val;
    }
    let point_str = points.toString();
    while (point_str.length < 4) {
      point_str = "0" + point_str;
    }
    setTextArray(this, this.points, point_str, "_p");
  }
}