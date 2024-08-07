let letter_chain = [];
let letter_chosen = [];
let words = [];
let num_words = 0;
let points = 0;
let set_limit = 0;
let point_val = [100, 400, 1200, 2000, 3000];
let setup = false;
let keydown = false;
let gameScreen = 0;

class Anagrams extends SimpleScene {

  constructor() {
    super("Anagrams");
  }

  init() {

  }

  preload() {
    this.load.image("start", "images/start.png");
    this.load.image("game", "images/game.png");
    this.load.image("letter", "images/letter.png");
    this.load.image("enter", "images/enter.png");
    this.load.image("end", "images/end.png");
    this.load.image("blank", "images/wordblank.png");
    this.load.image("endButton", "images/endbutton.png");

    for (var i = 0; i < 26; i++) {
      this.load.image(alphabet[i], "en-letters/" + alphabet[i] + ".png");
      this.load.image(alphabet[i] + "_in", "en-letters/inverted/" + alphabet[i] + ".png");
    }

    for (var i = 0; i < 10; i++) {
      this.load.image(i.toString() + "_p", "numbers/points/" + i + ".png");
      this.load.image(i.toString() + "_w", "numbers/words/" + i + ".png");
    }

    this.load.glsl('invertShader', 'images/invert.frag');
    
    this.load.audio("select", "audio/select.mp3");
    this.load.audio("deselect", "audio/deselect.mp3");
    this.load.audio("wrong", "audio/wrong.mp3");
    for (var i = 0; i < 4; i++) {
      this.load.audio(`${i + 3}letter`, `audio/${i + 3}letter.mp3`);
    }
    this.load.audio("begin", "audio/begin.mp3");
    this.load.audio("tiktik", "audio/tiktik.mp3");
    this.load.audio("complete", "audio/complete.mp3");
    this.load.audio("music", "audio/music.mp3");
    this.load.audio("shuffle", "audio/shuffle.mp3");
  }

  create() {

    this.select = this.sound.add("select", { loop: false });
    this.deselect = this.sound.add("deselect", { loop: false });
    this.wrong = this.sound.add("wrong", { loop: false });
    this.valid = [];
    for (var i = 0; i < 4; i++) {
      let valid_word = this.sound.add(`${i + 3}letter`, {loop: false});
      this.valid.push(valid_word);
    }
    this.begin = this.sound.add("begin", {loop: false});
    this.tiktik = this.sound.add("tiktik", {loop: true});
    this.complete = this.sound.add("complete", {loop: false});
    this.shuffle = this.sound.add("shuffle", {loop: false});
    this.music = this.sound.add("music", {loop: true});
    if (music == 1) {
      this.music.play();
    }

    this.startScreen = this.add.sprite(deviceWidth * 0.5 + no_start * -deviceWidth, deviceHeight * (907 / iphoneHeight), "start");
    this.startScreen.scale = scaleFactor;
    this.startScreen.setOrigin(0.5, 0.5);

    this.startButton = this.add.rectangle(deviceWidth * 0.5 + no_start * -deviceWidth, deviceHeight * (1235 / iphoneHeight), deviceWidth * (240 / iphoneWidth), deviceHeight * (100 / iphoneHeight), 0xffffff);
    this.startButton.setOrigin(0.5, 0.5);
    this.startButton.setAlpha(0.01);
    this.startButton.enableClick();

    this.gameScreen = this.add.sprite(deviceWidth * 1.5 + no_start * -deviceWidth, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "game");
    this.gameScreen.scale = scaleFactor;
    this.gameScreen.setOrigin(0.5, 0.5);

    this.endScreen = this.add.sprite(deviceWidth * 1.5, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "end");
    this.endScreen.scale = scaleFactor;
    this.endScreen.setOrigin(0.5, 0.5);

    this.letterButtons = [];
    for (var i = 0; i < 6; i++) {
      var button = this.add.sprite(deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), "letter");
      button.scale = scaleFactor;
      button.setOrigin(0.5, 0.5);
      this.letterButtons.push(button);
    }

    this.letterShadows = [];
    for (var i = 0; i < 6; i++) {
      /*var letter = this.add.text(deviceWidth * (86 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1595 / iphoneHeight), letter_inputs[i]);
      letter.setFontSize(deviceHeight * (100 / iphoneHeight));
      letter.setFontFamily("Arial");
      letter.setFontStyle("bold");
      letter.setOrigin(0.5, 0.5);
      letter.y -= text_offset * 100;*/
      var letter = this.add.sprite(deviceWidth * (86 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1595 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])] + "_in");
      letter.setScale(scaleFactor);
      letter.setOrigin(0.5, 0.5);
      this.letterShadows.push(letter);
    }

    this.letters = [];
    for (var i = 0; i < 6; i++) {
      /*var letter = this.add.text(deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), letter_inputs[i]);
      letter.setFontSize(deviceHeight * (100 / iphoneHeight));
      letter.setFontColor(0x000000);
      letter.setFontFamily("Arial");
      letter.setFontStyle("bold");
      letter.setOrigin(0.5, 0.5);
      letter.y -= text_offset * 100;
      */

      var letter = this.add.sprite(deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])]);
      letter.setScale(scaleFactor);
      letter.setOrigin(0.5, 0.5);
      this.letters.push(letter)
    }

    this.letterCovers = [];
    for (var i = 0; i < 6; i++) {
      var cover = this.add.rectangle(deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), deviceWidth * (130 / iphoneWidth), deviceHeight * (130 / iphoneHeight), 0xffffff);
      cover.setAlpha(0.01);
      cover.enableClick();
      this.letterCovers.push(cover);
    }

    this.enterButton = this.add.sprite(deviceWidth * 1.5 + no_start * -deviceWidth, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "enter");
    this.enterButton.scale = scaleFactor;
    this.enterButton.setOrigin(0.5, 0.5);
    this.enterButton.setAlpha(0);

    this.enter = this.add.rectangle(deviceWidth * 0.5 + deviceWidth + no_start * -deviceWidth, deviceHeight * (1110 / iphoneHeight), deviceWidth * (570 / iphoneWidth), deviceHeight * (100 / iphoneHeight), 0xffffff);
    this.enter.setOrigin(0.5, 0.5);
    this.enter.setAlpha(0);
    this.enter.enableClick();

    /*this.words = this.add.text(deviceWidth * (500 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (604 / iphoneHeight), 0);
    this.words.setOrigin(0, 0.5);
    this.words.setFontSize(deviceHeight * (40 / iphoneHeight));
    this.words.y -= text_offset * 40;
    this.words.setFontColor(0x00000)
    this.words.setFontFamily("Arial Black");

    this.points = this.add.text(deviceWidth * (610 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (657 / iphoneHeight), "0000");
    this.points.setOrigin(0, 0.5);
    this.points.setFontSize(deviceHeight * (80 / iphoneHeight));
    this.points.y -= Math.sqrt(text_offset) * 80;
    this.points.setFontColor(0x00000);
    this.points.setFontFamily("Arial Black");*/

    this.words = [];
    let word_num = this.add.sprite(deviceWidth * (500 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (604 / iphoneHeight), "0_w");
    word_num.setOrigin(0, 0.5);
    word_num.setScale(scaleFactor);
    this.words.push(word_num);
    
    this.points = [];
    for (var i = 0; i < 4; i++) {
      let point = this.add.sprite(deviceWidth * (590 / iphoneWidth) + i * (deviceWidth * (50 / iphoneWidth)) + no_start * -deviceWidth, deviceHeight * (657 / iphoneHeight), "0_p");
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
    this.timer = this.add.text(deviceWidth * (820 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (133 / iphoneHeight), (str_min + ":" + str_sec));
    this.timer.setOrigin(0, 0.5);
    this.timer.setFontSize(deviceHeight * (40 / iphoneHeight));
    this.timer.y -= text_offset * 40;
    this.timer.setFontColor(0xffffff);
    this.timer.setFontFamily("Arial");
    this.timer.setFontStyle("bold");

    if (no_start == 1) {
      gameScreen = 1;
      this.time.addEvent({
          delay: 1000,
          callback: updateCountdown,
          callbackScope: this,
          loop: true
      });
    }

    this.endButton = this.add.sprite(deviceWidth * (870 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (133 / iphoneHeight), "endButton");
    this.endButton.setScale(scaleFactor);
    this.endButton.enableClick();

    if (timer == 0) {
      this.timer.setAlpha(0);
    } else {
      this.endButton.setAlpha(0);
    }

    this.tempWords = [];

    this.shuffleButton = this.add.rectangle(deviceWidth * (80 / iphoneWidth) + deviceWidth, deviceHeight * (135 / iphoneHeight), deviceWidth * (95 / iphoneWidth), deviceHeight * (95 / iphoneHeight), 0xffffff);
    this.shuffleButton.setAlpha(0.01);
    this.shuffleButton.enableClick();
  }

  update() {
    if (setup == false) {
      this.input.keyboard.on('keydown', (event) => {
        if (event.key == 'Enter' && gameScreen == 0) {
          this.startGame();
        }

        if (event.key == 'Enter' && letter_chain.length >= 3 && gameScreen == 1) {
          this.enterWord();
        }

        if (event.key == 'Backspace' && letter_chain.length > 0 && gameScreen == 1) {
          this.moveLetter(letter_inputs.indexOf(letter_chain[letter_chain.length - 1]));
        }

          if (event.key.length === 1 && event.key.match(/[a-z]/i) && gameScreen == 1 && letter_inputs.includes(event.key.toUpperCase())) {
              keydown = true;
            if (curr_inputs.includes(event.key.toUpperCase())) {
              this.moveLetter(curr_inputs.indexOf(event.key.toUpperCase()));
            } else {
              this.moveLetter(letter_inputs.indexOf(event.key.toUpperCase()));
            }
          }
      });
      setup = true;
    }

    if (this.startButton.wasClicked()) {
      this.startGame();
    }

    if (this.endButton.wasClicked()) {
      this.endGame();
    }

    for (var i = 0; i < 6; i++) {
      if (this.letterCovers[i].wasClicked()) {
        this.moveLetter(i);
      }
    }

    if (letter_chain.length >= 3 && gameScreen == 1) {
      this.enterButton.setAlpha(1);
      this.enter.setAlpha(0.01);
    } else {
      this.enterButton.setAlpha(0);
      this.enter.setAlpha(0);
    }

    if (this.enter.wasClicked()) {
    this.enterWord();
    }

    for (var i = 0; i < this.tempWords.length; i++) {
      if (this.tempWords[i].y < deviceHeight * (1320 / iphoneHeight) - text_offset * 50) {
        this.tweens.add({
          targets: this.tempWords[i],
          alpha: 0,
          duration: 200,
          ease: 'Power1',
        });
      }
    }

    if (this.shuffleButton.wasClicked()) {
      if (sound == 1) {
        this.shuffle.play();
      }

      let shuffledArray = [];
      for (var i = 0; i < 6; i++) {
        shuffledArray.push(i);
      }

      // Iterate over the array from the end to the beginning
      for (let i = shuffledArray.length - 1; i > 0; i--) {
          // Generate a random index
          const j = Math.floor(Math.random() * (i + 1));

          // Swap the elements at indices i and j
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      let temp_buttons = [];
      let temp_letters = [];
      let temp_shadows = [];
      let temp_covers = [];
      let temp_inputs = [];

      for (let i = 0; i < shuffledArray.length; i++) {
        temp_buttons[shuffledArray[i]] = this.letterButtons[i];
          temp_letters[shuffledArray[i]] = this.letters[i];
        temp_shadows[shuffledArray[i]] = this.letterShadows[i];
          temp_covers[shuffledArray[i]] = this.letterCovers[i];
        temp_inputs[shuffledArray[i]] = letter_inputs[i];
      }

      for (var i = 0; i < 6; i++) {
        this.addTween(this.letterButtons[i], deviceWidth * (83 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth), this.letterButtons[i].y, 100);
        this.addTween(this.letterShadows[i], deviceWidth * (86 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth), this.letterShadows[i].y, 100);
        this.addTween(this.letters[i], deviceWidth * (83 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth), this.letters[i].y, 100);
        this.addTween(this.letterCovers[i], deviceWidth * (83 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth), this.letterCovers[i].y, 100);
      }

      this.letterButtons = temp_buttons;
      this.letters = temp_letters;
      this.letterShadows = temp_shadows;
      this.letterCovers = temp_covers;
      letter_inputs = temp_inputs;
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
    this.addTween(this.enterButton, deviceWidth * 0.5, this.enterButton.y, 200);
    this.addTween(this.enter, deviceWidth * 0.5, this.enter.y, 200);

    this.addTween(this.words, this.words.x - deviceWidth, this.words.y, 200);
    //this.addTween(this.points, this.points.x - deviceWidth, this.points.y, 200);

    this.addTween(this.timer, this.timer.x - deviceWidth, this.timer.y, 200);
    this.addTween(this.shuffleButton, this.shuffleButton.x - deviceWidth, this.shuffleButton.y, 200);
    this.addTween(this.endButton, this.endButton.x - deviceWidth, this.endButton.y, 200);

    for (var i = 0; i < 6; i++) {
      this.addTween(this.letterButtons[i], this.letterButtons[i].x - deviceWidth, this.letterButtons[i].y, 200);
      this.addTween(this.letterShadows[i], this.letterShadows[i].x - deviceWidth, this.letterShadows[i].y, 200);
      this.addTween(this.letters[i], this.letters[i].x - deviceWidth, this.letters[i].y, 200);
      this.addTween(this.letterCovers[i], this.letterCovers[i].x - deviceWidth, this.letterCovers[i].y, 200);
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

  pauseAll() {
    this.letterCovers.forEach(sprite => {
      sprite.setAlpha(0);
      setTimeout(() => {
        sprite.setAlpha(0.01);
      }, 100);
    });
  }

  enterWord () {
    let input_word = letter_chain.join("").toLowerCase();

    if (filteredArray.includes(input_word) && words.includes(input_word) == false) {

      words.push(input_word);
      num_words += 1;
      this.words.setText(num_words);
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

      this.wordView(input_word, "+" + point_val[input_word.length - 3], 0xffffff);

    } else if (filteredArray.includes(input_word) == false) {

      this.wordView(input_word, "Not in the vocabulary", 0xffb4b6);

      if (sound == 1) {
      this.wrong.play();
      }

    } else if (words.includes(input_word)) {

      this.wordView(input_word, "Already used", 0xffb4b6);

      if (sound == 1) {
      this.wrong.play();
      }

    }

    for (var i = 0; i < letter_chosen.length; i++) {
      this.addTween(this.letterButtons[letter_chosen[i]], deviceWidth * (83 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth), deviceHeight * (1592 / iphoneHeight), 100);
      this.addTween(this.letterShadows[letter_chosen[i]], deviceWidth * (86 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth), deviceHeight * (1595 / iphoneHeight) - text_offset * 100, 100);
      this.addTween(this.letters[letter_chosen[i]], deviceWidth * (83 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth), deviceHeight * (1592 / iphoneHeight) - text_offset * 100, 100);
      this.addTween(this.letterCovers[letter_chosen[i]], deviceWidth * (83 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth), deviceHeight * (1592 / iphoneHeight), 100);
    }
    letter_chosen = [];
    letter_chain = [];
  }

  wordView(input, val, color) {
    let preview = input.toUpperCase() + " (" + val + ")";
    let tempWord = this.add.text(deviceWidth * 0.5, deviceHeight * (1439 / iphoneHeight), preview);
    tempWord.setFontColor(color);
    tempWord.setFontSize(deviceHeight * (50 / iphoneHeight));
    tempWord.setOrigin(0.5, 0.5);
    tempWord.y -= text_offset * 50;
    tempWord.setFontFamily("Arial");
    tempWord.setFontStyle("bold");
    this.tempWords.push(tempWord);
    this.addTween(this.tempWords[this.tempWords.indexOf(tempWord)], deviceWidth * 0.5, this.tempWords[this.tempWords.indexOf(tempWord)].y - deviceHeight * (220 / iphoneHeight), 1000);
  }

    moveLetter(i) {
      if (letter_chosen.includes(i) == false) {
          letter_chain.push(letter_inputs[i]);
          curr_inputs[i] = '';
          this.pauseAll();

          if (sound == 1) {
            this.select.play();
          }

          this.addTween(this.letterButtons[i], deviceWidth * (83 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth), deviceHeight * (1439 / iphoneHeight), 100);
          this.addTween(this.letterShadows[i], deviceWidth * (86 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth), deviceHeight * (1442 / iphoneHeight) - text_offset * 100, 100);
          this.addTween(this.letters[i], deviceWidth * (83 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth), deviceHeight * (1439 / iphoneHeight) - text_offset * 100, 100);
          this.addTween(this.letterCovers[i], deviceWidth * (83 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth), deviceHeight * (1439 / iphoneHeight), 100);

          letter_chosen.push(i);

        } else {
          letter_chain.splice(letter_chosen.indexOf(i), 1);
          curr_inputs[i] = letter_inputs[i];
          this.pauseAll();

          if (sound == 1) {
          this.deselect.play();
          }

          this.addTween(this.letterButtons[i], deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth), deviceHeight * (1592 / iphoneHeight), 100);
          this.addTween(this.letterShadows[i], deviceWidth * (86 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth), deviceHeight * (1595 / iphoneHeight) - text_offset * 100, 100);
          this.addTween(this.letters[i], deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth), deviceHeight * (1592 / iphoneHeight) - text_offset * 100, 100);
          this.addTween(this.letterCovers[i], deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth), deviceHeight * (1592 / iphoneHeight), 100);

          for (var j = letter_chosen.indexOf(i) + 1; j < letter_chosen.length; j++) {
            this.addTween(this.letterButtons[letter_chosen[j]], this.letterButtons[letter_chosen[j]].x - deviceWidth * (163 / iphoneWidth), this.letterButtons[letter_chosen[j]].y, 100);
            this.addTween(this.letterShadows[letter_chosen[j]], this.letterShadows[letter_chosen[j]].x - deviceWidth * (163 / iphoneWidth), this.letterShadows[letter_chosen[j]].y, 100);
            this.addTween(this.letters[letter_chosen[j]], this.letters[letter_chosen[j]].x - deviceWidth * (163 / iphoneWidth), this.letters[letter_chosen[j]].y, 100);
            this.addTween(this.letterCovers[letter_chosen[j]], this.letterCovers[letter_chosen[j]].x - deviceWidth * (163 / iphoneWidth), this.letterCovers[letter_chosen[j]].y, 100);
          }
          letter_chosen.splice(letter_chosen.indexOf(i), 1);
        }
      }

    endGame () {
      if (sound == 1) {
        this.tiktik.stop();
        this.complete.play();
      }

        this.addTween(this.gameScreen, -1.5 * deviceWidth, this.gameScreen.y, 200);
        for (var i = 0; i < 6; i++) {
          this.addTween(this.letterButtons[i], this.letterButtons[i].x - deviceWidth, this.letterButtons[i].y, 200);
          this.addTween(this.letterShadows[i], this.letterShadows[i].x - deviceWidth, this.letterShadows[i].y, 200);
          this.addTween(this.letters[i], this.letters[i].x - deviceWidth, this.letters[i].y, 200);
          this.addTween(this.letterCovers[i], this.letterCovers[i].x - deviceWidth, this.letterCovers[i].y, 200);
          }

      this.addTween(this.timer, this.timer.x - deviceWidth, this.timer.y, 200);
      this.addTween(this.endButton, this.endButton.x - deviceWidth, this.endButton.y, 200);
      this.addTween(this.words, this.words.x - deviceWidth, this.words.y, 200);
      //this.addTween(this.points, this.points.x - deviceWidth, this.points.y, 200);

      this.addTween(this.endScreen, 0.5 * deviceWidth, this.endScreen.y, 200);

      setTimeout (() => {
        this.wordsEnd = this.add.text(deviceWidth * (200 / iphoneWidth), deviceHeight * (580 / iphoneHeight), num_words);
        this.wordsEnd.setOrigin(0, 0.5);
        this.wordsEnd.setFontSize(deviceHeight * (35 / iphoneHeight));
        this.wordsEnd.y -= text_offset * 35;
        this.wordsEnd.setFontColor(0x00000)
        this.wordsEnd.setFontFamily("Arial Black");

        let point_str = points.toString();
        if (point_str.length < 4) {
          point_str = "0" + point_str;
          if (points == 0) {
            point_str = "0000";
          }
        }
        this.pointsEnd = this.add.text(deviceWidth * (250 / iphoneWidth), deviceHeight * (620 / iphoneHeight), point_str);
        this.pointsEnd.setOrigin(0, 0.5);
        this.pointsEnd.setFontSize(deviceHeight * (50 / iphoneHeight));
        this.pointsEnd.y -= Math.sqrt(text_offset) * 50;
        this.pointsEnd.setFontColor(0x00000);
        this.pointsEnd.setFontFamily("Arial Black");

        words.sort((a, b) => b.length - a.length);
        this.blanks = [];
        this.blank_words = [];
        this.point_vals = [];
        for (var i = 0; i < num_words; i++) {
         let blank = this.add.sprite(deviceWidth * ((145 - ((6 - words[i].length) * 10)) / iphoneWidth), deviceHeight * ((710 + i * 55) / iphoneHeight), "blank");
          blank.setOrigin(0.5, 0.5);
          blank.scaleY = scaleFactor;
          console.log(scaleFactor)
          blank.scaleX = scaleFactor - (6 - words[i].length) * 0.12 * scaleFactor;
          this.blanks.push(blank);

          let tempWord = words[i].toUpperCase();
          let blank_word = this.add.text(deviceWidth * (70 / iphoneWidth), deviceHeight * ((710 + i * 55) / iphoneHeight), tempWord);
          blank_word.setOrigin(0, 0.5);
          blank_word.setFontSize(deviceHeight * (35 / iphoneHeight));
          blank_word.y -= text_offset * 35;
          blank_word.setFontColor(0x00000);
          blank_word.setFontFamily("Arial");
          blank_word.setFontStyle("bold");
          this.blank_words.push(blank_word);

          let disp_val = this.add.text(deviceWidth * (430 / iphoneWidth), deviceHeight * ((710 + i * 55) / iphoneHeight), point_val[words[i].length - 3]);
          disp_val.setOrigin(1, 0.5);
          disp_val.setFontSize(deviceHeight * (35 / iphoneHeight));
          disp_val.y -= text_offset * 35;
          disp_val.setFontColor(0xffffff);
          disp_val.setFontFamily("Arial");
          disp_val.setFontStyle("bold");
          this.point_vals.push(disp_val);
        }

      }, 200);

      gameScreen = 2;
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

  if (countdownSec == 5 && sound == 1) {
    this.tiktik.play();
  }

    if (countdownSec == -1 && countdownMin == 0 && countdownSec != -10) {
      this.time.removeAllEvents();  // Stop the countdown
      const scene = game.scene.keys.Anagrams;
      scene.endGame();
      countdownSec = -10;
    } else {
      this.timer.setText(str_min + ":" + str_sec);
    }
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
    //this.points.setText(point_str);
  }
}