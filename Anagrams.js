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
let denominator;
let letter_stage = {};

class Anagrams extends SimpleScene {

  constructor() {
    super("Anagrams");
  }

  init() {
    document.getElementsByTagName("div")[0].style.display = 'flex';
    document.getElementsByTagName("div")[0].style.justifyContent = 'center';
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

    this.load.image("buttons", "images/buttons.png");
    
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
    denominator = num_letters;
    if (num_letters <= 6) {
      denominator = 6;
    }
    for (let i = 0; i < num_letters; i++) {
      letter_stage[letter_inputs[i]] = 0;
    }

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

    this.dishes = [];
    for (var i = 0; i < num_letters; i++) {
      let letterDish = this.add.sprite(6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1517 / iphoneHeight) + (denominator === 6 ? 0 : 1) * denominator/6 * (deviceHeight * (16 / iphoneHeight)), "buttons");
      letterDish.scale = scaleFactor * 6/denominator;
      letterDish.setOrigin(0.5, 0.5);
      this.dishes.push(letterDish);
    }

    this.letterButtons = [];
    for (var i = 0; i < num_letters; i++){
      let button = this.add.sprite(6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), "letter");
      button.scale = scaleFactor * 6/denominator;
      button.setOrigin(0.5, 0.5);
      this.letterButtons.push(button);
    }

    this.letterShadows = [];
    for (var i = 0; i < num_letters; i++) {
      let letter = this.add.sprite(6/denominator * (deviceWidth * (86 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1595 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])] + "_in");
      letter.scale = scaleFactor * 6/denominator;
      letter.setOrigin(0.5, 0.5);
      this.letterShadows.push(letter);
    }

    this.letters = [];
    for (var i = 0; i < num_letters; i++) {
      let letter = this.add.sprite(6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])]);
      letter.scale = scaleFactor * 6/denominator;
      letter.setOrigin(0.5, 0.5);
      this.letters.push(letter)
    }

    this.letterCovers = [];
    for (var i = 0; i < num_letters; i++) {
      let cover = this.add.rectangle(6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (1592 / iphoneHeight), 6/denominator * (deviceWidth * (130 / iphoneWidth)), 6/denominator * (deviceHeight * (130 / iphoneHeight)), 0xffffff);
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

    this.words = [];
    let word_num = this.add.sprite(deviceWidth * (490 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (604 / iphoneHeight), "0_w");
    word_num.setOrigin(0, 0.5);
    word_num.setScale(scaleFactor);
    this.words.push(word_num);
    
    this.points = [];
    for (var i = 0; i < 4; i++) {
      let point = this.add.sprite(deviceWidth * (590 / iphoneWidth) + i * (deviceWidth * (50 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (657 / iphoneHeight), "0_p");
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
      let time = this.add.sprite(deviceWidth * (812 / iphoneWidth) + i * (deviceWidth * (20 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (133 / iphoneHeight), str_time[i] + "_t");
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

    this.endButton = this.add.sprite(deviceWidth * (870 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (133 / iphoneHeight), "endButton");
    this.endButton.setScale(scaleFactor);
    this.endButton.enableClick();

    if (timer == 0) {
      this.timer.setAlpha(0);
    } else {
      this.endButton.setAlpha(0);
    }

    this.shuffleButton = this.add.rectangle(deviceWidth * (80 / iphoneWidth) + deviceWidth, deviceHeight * (135 / iphoneHeight), deviceWidth * (95 / iphoneWidth), deviceHeight * (95 / iphoneHeight), 0xffffff);
    this.shuffleButton.setAlpha(0.01);
    this.shuffleButton.enableClick();
  }

  update() {
    if (!setup) {
      this.input.keyboard.on('keydown', (event) => {
        if (event.key == 'Enter' && gameScreen == 0) {
          this.startGame();
        }

        if (event.key == 'Enter' && letter_chain.length >= 3 && gameScreen == 1) {
          this.enterWord();
        }

        if (event.key == 'Backspace' && letter_chain.length > 0 && gameScreen == 1) {
          this.moveLetter(letter_chosen[letter_chosen.length - 1]);
        }

        if (event.key.length === 1 && event.key.match(/[a-z]/i) && gameScreen == 1 && letter_inputs.includes(event.key.toUpperCase())) {
          keydown = true;
          if (letter_stage[event.key.toUpperCase()] == 0) {
            this.moveLetter(curr_inputs.indexOf(event.key.toUpperCase()));
            if (!curr_inputs.includes(event.key.toUpperCase())) {
              letter_stage[event.key.toUpperCase()] = 1;
            }
          } else {
            this.moveLetter(letter_chosen[letter_chain.indexOf(event.key.toUpperCase())]);
            if (!letter_chain.includes(event.key.toUpperCase())) {
              letter_stage[event.key.toUpperCase()] = 0;
            }
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

    for (var i = 0; i < num_letters; i++) {
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

    if (this.shuffleButton.wasClicked()) {
      if (sound == 1) {
        this.shuffle.play();
      }

      let shuffledArray = [];
      for (var i = 0; i < num_letters; i++) {
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

      for (var i = 0; i < num_letters; i++) {
        this.addTween(this.letterButtons[i], 6/denominator * (deviceWidth * (83 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth)), this.letterButtons[i].y, 100);
        this.addTween(this.letterShadows[i], 6/denominator * ( deviceWidth * (86 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth)), this.letterShadows[i].y, 100);
        this.addTween(this.letters[i], 6/denominator * (deviceWidth * (83 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth)), this.letters[i].y, 100);
        this.addTween(this.letterCovers[i], 6/denominator * (deviceWidth * (83 / iphoneWidth) + shuffledArray[i] * deviceWidth * (163 / iphoneWidth)), this.letterCovers[i].y, 100);
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

    this.words.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.points.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });
    this.timer.forEach(sprite => {
      this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
    });

    this.addTween(this.shuffleButton, this.shuffleButton.x - deviceWidth, this.shuffleButton.y, 200);
    this.addTween(this.endButton, this.endButton.x - deviceWidth, this.endButton.y, 200);

    for (var i = 0; i < num_letters; i++) {
      this.addTween(this.dishes[i], this.dishes[i].x - deviceWidth, this.dishes[i].y, 200);
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

      this.wordView(input_word, "+" + point_val[input_word.length - 3], 'white');

    } else if (!filteredArray.includes(input_word)) {

      this.wordView(input_word, "Not in the vocabulary", 'red');

      if (sound == 1) {
      this.wrong.play();
      }

    } else if (words.includes(input_word)) {

      this.wordView(input_word, "Already used", 'red');

      if (sound == 1) {
      this.wrong.play();
      }

    }

    for (var i = 0; i < letter_chosen.length; i++) {
      this.addTween(this.letterButtons[letter_chosen[i]], 6/denominator * (deviceWidth * (83 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1592 / iphoneHeight), 100);
      this.addTween(this.letterShadows[letter_chosen[i]], 6/denominator * (deviceWidth * (86 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1595 / iphoneHeight), 100);
      this.addTween(this.letters[letter_chosen[i]], 6/denominator * (deviceWidth * (83 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1592 / iphoneHeight), 100);
      this.addTween(this.letterCovers[letter_chosen[i]], 6/denominator * (deviceWidth * (83 / iphoneWidth) + letter_chosen[i] * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1592 / iphoneHeight), 100);
    }
    letter_chosen = [];
    letter_chain = [];
  }

  wordView(input, val, color) {
    let preview = input.toUpperCase() + " (" + val + ")";
    document.getElementsByTagName("div")[0].innerHTML += `<div class="floating-text">${preview}</div>`;
    let chain = document.getElementsByClassName('floating-text');
    if (color == 'red') {
      document.getElementsByClassName("floating-text")[chain.length - 1].style.color = '#eda9b0';
    }
    setTimeout(() => {
      document.getElementsByClassName("floating-text")[chain.length - 1].style.bottom = '30vh';
      document.getElementsByClassName("floating-text")[chain.length - 1].style.opacity = '0';
    }, 1);
  }

    moveLetter(i) {
      if (!letter_chosen.includes(i)) {
          letter_chain.push(letter_inputs[i]);
          curr_inputs[i] = '';
          this.pauseAll();

          if (sound == 1) {
            this.select.play();
          }

          this.addTween(this.letterButtons[i], 6/denominator * (deviceWidth * (83 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1439 / iphoneHeight) + (denominator === 6 ? 0 : 1) * Math.pow(denominator/6,2) * (deviceHeight * (22 / iphoneHeight)), 100);
          this.addTween(this.letterShadows[i], 6/denominator * (deviceWidth * (86 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1442 / iphoneHeight) + (denominator === 6 ? 0 : 1) * Math.pow(denominator/6,2) * (deviceHeight * (22 / iphoneHeight)), 100);
          this.addTween(this.letters[i], 6/denominator * (deviceWidth * (83 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1439 / iphoneHeight) + (denominator === 6 ? 0 : 1) * Math.pow(denominator/6,2) * (deviceHeight * (22 / iphoneHeight)), 100);
          this.addTween(this.letterCovers[i], 6/denominator * (deviceWidth * (83 / iphoneWidth) + letter_chosen.length * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1439 / iphoneHeight) + (denominator === 6 ? 0 : 1) * Math.pow(denominator/6,2) * (deviceHeight * (22 / iphoneHeight)), 100);

          letter_chosen.push(i);

        } else {
          letter_chain.splice(letter_chosen.indexOf(i), 1);
          curr_inputs[i] = letter_inputs[i];
          this.pauseAll();

          if (sound == 1) {
          this.deselect.play();
          }

          this.addTween(this.letterButtons[i],  6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1592 / iphoneHeight), 100);
          this.addTween(this.letterShadows[i],  6/denominator * (deviceWidth * (86 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1595 / iphoneHeight), 100);
          this.addTween(this.letters[i],  6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1592 / iphoneHeight), 100);
          this.addTween(this.letterCovers[i],  6/denominator * (deviceWidth * (83 / iphoneWidth) + i * deviceWidth * (163 / iphoneWidth)), deviceHeight * (1592 / iphoneHeight), 100);

          for (var j = letter_chosen.indexOf(i) + 1; j < letter_chosen.length; j++) {
            this.addTween(this.letterButtons[letter_chosen[j]], this.letterButtons[letter_chosen[j]].x - 6/denominator * (deviceWidth * (163 / iphoneWidth)), this.letterButtons[letter_chosen[j]].y, 100);
            this.addTween(this.letterShadows[letter_chosen[j]], this.letterShadows[letter_chosen[j]].x - 6/denominator * (deviceWidth * (163 / iphoneWidth)), this.letterShadows[letter_chosen[j]].y, 100);
            this.addTween(this.letters[letter_chosen[j]], this.letters[letter_chosen[j]].x - 6/denominator * (deviceWidth * (163 / iphoneWidth)), this.letters[letter_chosen[j]].y, 100);
            this.addTween(this.letterCovers[letter_chosen[j]], this.letterCovers[letter_chosen[j]].x - 6/denominator * (deviceWidth * (163 / iphoneWidth)), this.letterCovers[letter_chosen[j]].y, 100);
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
        for (var i = 0; i < num_letters; i++) {
          this.addTween(this.letterButtons[i], this.letterButtons[i].x - deviceWidth, this.letterButtons[i].y, 200);
          this.addTween(this.letterShadows[i], this.letterShadows[i].x - deviceWidth, this.letterShadows[i].y, 200);
          this.addTween(this.letters[i], this.letters[i].x - deviceWidth, this.letters[i].y, 200);
          this.addTween(this.letterCovers[i], this.letterCovers[i].x - deviceWidth, this.letterCovers[i].y, 200);
          this.addTween(this.dishes[i], this.dishes[i].x - deviceWidth, this.dishes[i].y, 200);
        }

      this.addTween(this.endButton, this.endButton.x - deviceWidth, this.endButton.y, 200);

      this.words.forEach(sprite => {
        this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
      });
      this.points.forEach(sprite => {
        this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
      });
      this.timer.forEach(sprite => {
        this.addTween(sprite, sprite.x - deviceWidth, sprite.y, 200);
      });

      this.addTween(this.endScreen, 0.5 * deviceWidth, this.endScreen.y, 200);

      let num_string = num_words.toString();
        this.wordsEnd = [];
        for (var i = 0; i < num_string.length; i++) {
          let num = this.add.sprite(deviceWidth * (190 / iphoneWidth) + i * deviceWidth * (20 / iphoneWidth), deviceHeight * (580 / iphoneHeight), num_string[i] + "_w");
          num.setScale(scaleFactor * 0.8);
          num.setOrigin(0, 0.5);
          this.wordsEnd.push(num);
        }

        let point_str = points.toString();
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
        for (var i = 0; i < num_words; i++) {
         
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
          
          let dispVal = point_val[words[i].length - 3].toString();
          for (var j = 0; j < dispVal.length; j++) {
            let blank_val = this.add.sprite(deviceWidth * (435 / iphoneWidth) - j * deviceWidth * (21 / iphoneWidth), deviceHeight * ((705 + i * 55) / iphoneHeight), dispVal[dispVal.length - j - 1] + "_f");
            blank_val.setOrigin(1, 0.5);
            blank_val.setScale(scaleFactor);
            this.point_vals.push(blank_val);
          }
        }

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