// TALIYAH HUANG
/* Custom GameParakeet Games -- main game functionality for Word Hunt */

let letter_chain = []; // letters being selected as an array
let word_chosen = ""; // letters being selected as a string
let new_word_chosen = "";
let prev_word = ""; // last word that was selected but not completed
let words = []; // array of all words completed
let num_words = 0; // number of words that were completed
let points = 0; // keep track of points being displayed
let set_limit = 0; // keep track of total points earned
let gameScreen = 0; // keep track of if we're on start, playmode, or ended
let kr_save = 1; // used to keep track of actual length of korean

class WordHunts extends SimpleScene {

  constructor() {
    super("WordHunts");
  }

  init() {
    document.getElementsByTagName("div")[0].style.display = 'flex';
    document.getElementsByTagName("div")[0].style.justifyContent = 'center';
  }

  preload() { // load all images and audios to be used
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
    
    this.load.audio("music", "audio/whmusic.m4a")
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
    // create the audios as game objects
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

    // create the start screen
    this.startScreen = this.add.sprite(deviceWidth * 0.5 + no_start * -deviceWidth, deviceHeight * (907 / iphoneHeight), "start");
    this.startScreen.scale = scaleFactor;
    this.startScreen.setOrigin(0.5, 0.5);

    // create the start button
    this.startButton = this.add.rectangle(deviceWidth * 0.5 + no_start * -deviceWidth, deviceHeight * (1330 / iphoneHeight), deviceWidth * (240 / iphoneWidth), deviceHeight * (100 / iphoneHeight), 0xffffff);
    this.startButton.setOrigin(0.5, 0.5);
    this.startButton.setAlpha(0.01);
    this.startButton.enableClick();

    // create the game screen
    this.gameScreen = this.add.sprite(deviceWidth * 1.5 + no_start * -deviceWidth, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "game");
    this.gameScreen.scale = scaleFactor;
    this.gameScreen.setOrigin(0.5, 0.5);

    // create the end screen
    this.endScreen = this.add.sprite(deviceWidth * 1.5, deviceHeight * 0.5 + deviceHeight * (85 / iphoneHeight), "end");
    this.endScreen.scale = scaleFactor;
    this.endScreen.setOrigin(0.5, 0.5);

    // create the floating background for when a letter is being formed
    this.chain = this.add.sprite(deviceWidth * 0.5, deviceHeight * (900 / iphoneHeight), "chain");
    this.chain.scale = scaleFactor;
    this.chain.scaleX = deviceWidth * (0.08 / iphoneWidth);
    this.chain.setOrigin(0.5, 0.5);
    this.chain.setAlpha(0);

    // generate the letter backings
    this.letterBoards = [];
    for (var i = 0; i < rows * cols; i++) {
      let cover = this.add.sprite(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), "letter");
      if (format > 4) { // if more than 4 rows or 4 columns, need special scaling and shifting
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
      if (letter_inputs[i] == "") cover.setAlpha(0); // if empty letter, set as completely invisible
      this.letterBoards.push(cover);
    }

    // generate the white highlight for a letter when being selected
    this.letterFills = [];
    for (var i = 0; i < rows * cols; i++) {
      let cover = this.add.sprite(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), "fill");
      if (format > 4) { // if more than 4 rows or columns, need special scaling and shifting
        cover.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        cover.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        cover.scale = scaleFactor * 1.15 * (4 / format);
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        cover.scale = scaleFactor * 1.15;
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") { // if empty letter, set completely invisible
        cover.setAlpha(0);
      } else { // otherwise, make mostly opaque
        cover.setAlpha(0.9);
      }
      cover.setOrigin(0.5, 0.5);
      this.letterFills.push(cover);
    }

    // create white shadows for the letters that are slightly to the bottom right
    this.letterShadows = [];
    for (var i = 0; i < rows * cols; i++) {
      let letter = this.add.sprite(deviceWidth * (223 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (880 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])] + "_in");
      if (format > 4) { // if more than 4 rows or columns, need special scaling and shifting
        letter.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        letter.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        letter.scale = scaleFactor * (4 / format) * 1.22;
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        letter.scale = scaleFactor * 1.22;
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") letter.setAlpha(0); // if empty letter, make completely invisible
      letter.setOrigin(0.5, 0.5);
      this.letterShadows.push(letter);
    }

    // create the letters themselves
    this.letters = [];
    for (var i = 0; i < rows * cols; i++) {
      let letter = this.add.sprite(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), alphabet[alphabet.indexOf(letter_inputs[i])]);
      if (format > 4) { // if more than 4 rows or 4 columns, need special scaling and shifting
        letter.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        letter.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        letter.scale = scaleFactor * (4 / format) * 1.22;
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        letter.scale = scaleFactor * 1.22;
        letter.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        letter.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") letter.setAlpha(0); // if empty letter, make completely invisibile
      letter.setOrigin(0.5, 0.5);
      this.letters.push(letter);
    }

    // make the selectable areas for the letters as circles
    this.letterCovers = [];
    for (var i = 0; i < rows * cols; i++) {
      let cover = this.add.circle(deviceWidth * (221 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (878 / iphoneHeight), (deviceWidth * (70 / iphoneWidth)) * (4 / format), 0xffffff);
      cover.setAlpha(0.01);
      if (format != 4) { // if more than 4 rows or columns, need special scaling and shifting
        cover.x -= Math.pow(format / 4, 2) * deviceWidth * (9 / iphoneWidth);
        cover.y -= Math.pow(format / 4, 2) * deviceHeight * (9 / iphoneHeight);
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth) * (4 / format);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight) * (4 / format);
      } else {
        cover.x += (i % cols) * deviceWidth * (178 / iphoneWidth);
        cover.y += Math.floor(i / cols) * deviceHeight * (178 / iphoneHeight);
      }
      if (letter_inputs[i] == "") cover.setAlpha(0); // if empty letter, make completely invisible
      cover.enableClick();
      this.letterCovers.push(cover);
    }

    // create the red line that shows selection
    this.line = this.add.graphics();
    this.line.lineStyle(deviceWidth * (22 / iphoneWidth) * (4 / format), 0xff0000, 0.5);
    this.line.lineCap = 'round';
    this.line.setAlpha(0.5);
    
    // handle the letter selection when the pointer is released
    this.input.on('pointerup', (pointer) => {
      if (word_chosen.length >= 3) {
        if (languages == "kr") {
          let jamo_list = word_chosen.split('');
          new_word_chosen = combineJamoList(jamo_list);
          this.enterWord(new_word_chosen);
        } else {
          this.enterWord(word_chosen); // if more than 3 letters, try to enter it
        }
      }
      for (var i = 0; i < rows * cols; i++) { // clear the white selection on the letters
        if (this.letterFills[i].alpha == 0.9) {
          if (sound) this.deselect.play();
          this.letterFills[i].setTint(0xffffff);
          this.tweens.add({
            targets: this.letterFills[i],
            alpha: 0.01,
            duration: 200,
            ease: 'Linear', 
          });
        }
      }
      this.line.clear(); // clear the red line
      
      this.tweens.add({ // set a fadeout animation on the word preview popup's background
        targets: this.chain,
        alpha: 0,
        duration: 200,
        ease: 'Linear', 
      });
      setTimeout (() => { // reset the chain
        this.chain.scaleX = deviceWidth * (0.08 / iphoneWidth);
        this.chain.setTint(0xffffff);
      }, 200);

      letter_chain = [];
      word_chosen = "";

      // set a fadeout animation on the word preview popup's letters
      document.getElementsByClassName("wh-floating-text")[0].style.transition = "0.2s ease";
      document.getElementsByClassName("wh-floating-text")[0].style.opacity = 0;
      setTimeout (() => {
        document.getElementsByClassName("wh-floating-text")[0].innerHTML = "";
      }, 400);
    });

    // create the number of words count
    this.words = [];
    let word_num = this.add.sprite(deviceWidth * (490 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (95 / iphoneHeight), "0_w");
    word_num.setOrigin(0, 0.5);
    word_num.setScale(scaleFactor);
    this.words.push(word_num);
    
    // create the points count
    this.points = [];
    for (var i = 0; i < 4; i++) {
      let point = this.add.sprite(deviceWidth * (590 / iphoneWidth) + i * (deviceWidth * (50 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (160 / iphoneHeight), "0_p");
      point.setOrigin(0, 0.5);
      point.setScale(scaleFactor);
      this.points.push(point);
    }

    // set the time
    let str_min = countdownMin.toString();
    let str_sec = countdownSec.toString();
    if (countdownMin <= 9) {
      str_min = "0" + countdownMin.toString();
    }
    if (countdownSec <= 9) {
      str_sec = "0" + countdownSec.toString();
    }
    let str_time = str_min + ":" + str_sec;

    // create the countdown timer
    this.timer = [];
    for (var i = 0; i < str_time.length; i++) {
      let time = this.add.sprite(deviceWidth * (710 / iphoneWidth) + i * (deviceWidth * (20 / iphoneWidth)) + deviceWidth + no_start * -deviceWidth, deviceHeight * (275 / iphoneHeight), str_time[i] + "_t");
      time.setOrigin(0, 0.5);
      time.setScale(scaleFactor);
      this.timer.push(time)
    }

    if (no_start) { // if there should be no start screen, start countdown immediately
      gameScreen = 1;
      this.time.addEvent({
          delay: 1000,
          callback: updateCountdown,
          callbackScope: this,
          loop: true
      });
    }

    // create the end button
    this.endButton = this.add.sprite(deviceWidth * (775 / iphoneWidth) + deviceWidth + no_start * -deviceWidth, deviceHeight * (275 / iphoneHeight), "endButton");
    this.endButton.setScale(scaleFactor);
    this.endButton.enableClick();

    if (!timer) { // if there should be no timer, make it invisible
      for (let i = 0; i < this.timer.length; i++) {
        this.timer[i].setAlpha(0);
      }
    } else {
      this.endButton.setAlpha(0); // otherwise, make the end button invisible
    }

    // create the play again button
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
              this.chain.scaleX += deviceWidth * (0.063 / iphoneWidth) + (languages == 'jp' || languages == 'zy' || languages == 'kr') * 0.015;
              letter_chain.push(i);
              prev_word = word_chosen;
              if (languages == "kr") prev_word = new_word_chosen;
              word_chosen += letter_inputs[i];
              document.getElementsByClassName("wh-floating-text")[0].style.transition = "none";
              document.getElementsByClassName("wh-floating-text")[0].style.opacity = 1;
              if (languages == "kr") {
                let jamo_list = word_chosen.split('');
                new_word_chosen = combineJamoList(jamo_list);
                document.getElementsByClassName("wh-floating-text")[0].innerHTML = new_word_chosen;
                let diff = word_chosen.split('').length - new_word_chosen.split('').length;
                for (var k = 0; k < diff - kr_save; k++) {
                  this.chain.scaleX -= deviceWidth * (0.063 / iphoneWidth) + 0.015;
                }
                kr_save = diff;
              } else {
                document.getElementsByClassName("wh-floating-text")[0].innerHTML = word_chosen;
              }
              this.checkWord();
            if (letter_chain.length == 0) { // create the red line but it goes nowhere
              this.line.beginPath();
              this.line.moveTo(this.letterCovers[i].x, this.letterCovers[i].y);
            } else { // create the red line and loop through all selected letters so far
              this.line.beginPath();
              this.line.moveTo(this.letterCovers[letter_chain[0]].x, this.letterCovers[letter_chain[0]].y);
              for (var k = 0; k < letter_chain.length; k++) {
                this.line.lineTo(this.letterCovers[letter_chain[k]].x, this.letterCovers[letter_chain[k]].y);
              }
              this.line.strokePath();
            }
          } // this was code that allowed the player to deselect letters after beginning forming a chain
            /*else if (letter_chain.includes(i)) {
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

  // function checks if a word is in the dictionary
  checkWord () {
    let input_word = word_chosen.toLowerCase();
    if (languages == "kr") input_word = new_word_chosen;
    prev_word = prev_word.toLowerCase();
    if (filteredArray.includes(input_word) && !words.includes(input_word)) { // it's a new word and in the dictionary
      if (sound) this.pop.play();
      for (var i = 0; i < 6; i++) { // great increase in the preview popup to accommodate for the +points
        this.chain.scaleX += deviceWidth * (0.063 / iphoneWidth);
      }
      let point_val = 100;
      if (languages == "kr") {
        if (word_chosen.length > 3) point_val = (word_chosen.length - 3) * 400 + 200 * (word_chosen.length >= 6); // set the point increase
      } else {
        if (input_word.length > 3) point_val = (input_word.length - 3) * 400 + 200 * (word_chosen.length >= 6); // set the point increase
      }
      document.getElementsByClassName("wh-floating-text")[0].innerHTML += ` (+${point_val})`; // set the preview points
      this.chain.setTint(0xa8fc98); // switch to green
      for (var i = 0; i < this.letterFills.length; i++) {
        if (this.letterFills[i].alpha > 0.5) {
          this.letterFills[i].setTint(0xa8fc98);
        }
      }
    } else if (filteredArray.includes(input_word) && words.includes(input_word)) { // word was already used
      this.chain.setTint(0xedea88); // switch to yellow
      for (var i = 0; i < this.letterFills.length; i++) {
        if (this.letterFills[i].alpha > 0.5) {
          this.letterFills[i].setTint(0xedea88);
        }
      }
      if (sound) this.select.play();
    } else {
      if (sound) this.select.play();
    }
    if (filteredArray.includes(prev_word) && !words.includes(prev_word)) { // if the previous word would have earned points
      for (var i = 0; i < 6; i++) { // greatly decrease to remove accommodation for the +points
        this.chain.scaleX -= deviceWidth * (0.063 / iphoneWidth);
      }
    }
  }

  // function to enter a valid word
  enterWord (word) {
    let input_word = word.toLowerCase();
    if (filteredArray.includes(input_word) && !words.includes(input_word)) { // it's a new word that is in the dictionary
      words.push(input_word);
      num_words += 1;
      setTextArray(this, this.words, num_words.toString(), "_w"); // increase the word count
      let point_val = 100;
      if (languages == "kr") {
        if (word_chosen.length > 3) point_val = (word_chosen.length - 3) * 400 + 200 * (word_chosen.length >= 6); // set the appropriate point increase
      } else {
        if (input_word.length > 3) point_val = (input_word.length - 3) * 400 + 200 * (input_word.length >= 6); // set the appropriate point increase
      }
      set_limit += point_val;
      this.time.addEvent({ // start the point incrementing animation
          delay: 1, // delay of 1 millisecond between each call
          callback: updatePoints,
          callbackScope: this,
          loop: true
      });
      setTimeout(() => { // hard set the final point count after a bit
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

      let audio = input_word.length - 3; // audio is different depending on word length
      if (languages == "kr") audio = word_chosen.length - 3;
      if (input_word.length > 6) audio = 3; // play the longest word count
      if (sound) this.valid[audio].play();
    }
  }

  // function that runs once at the start of the game
  startGame() {
    gameScreen = 1;
    this.startButton.setAlpha(0);
    if (sound) this.begin.play();

    // move everything over from the right
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

    this.time.addEvent({ // begin the countdown
        delay: 1000,
        callback: updateCountdown,
        callbackScope: this,
        loop: true
    });
  }

  // function that runs at the end of the game
  endGame () {
    if (sound) {
      this.tiktik.stop();
      this.complete.play();
    }

    // animate everything to move to the left
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

    setTimeout(() => { // small delay to wait for the animation to complete before appearing
      this.playAgain.setAlpha(1);
      let num_string = num_words.toString();
      this.wordsEnd = [];
      for (var i = 0; i < num_string.length; i++) { // set the final number of words count
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
      for (var i = 0; i < point_str.length; i++) { // set the final number of points count
        let num = this.add.sprite(deviceWidth * (240 / iphoneWidth) + i * deviceWidth * (25 / iphoneWidth), deviceHeight * (620 / iphoneHeight), point_str[i] + "_w");
        num.setScale(scaleFactor);
        num.setOrigin(0, 0.5);
        this.pointsEnd.push(num);
      }

      // sort the words from longest to shortest
      words.sort((a, b) => b.length - a.length);
      this.blanks = [];
      this.blank_words = [];
      this.point_vals = [];
      let printout = 13;
      if (num_words <= printout) { // check if there are too many words to be displayed on the screen
        printout = num_words;
      } else {
        document.getElementsByClassName("more")[0].innerHTML = "(" + (num_words - 13) + " more)";
      }
      for (var i = 0; i < printout; i++) {
        // create the background of the word
        let blank = this.add.sprite(deviceWidth * ((145 - ((6 - words[i].length) * 10)) / iphoneWidth), deviceHeight * ((710 + i * 55) / iphoneHeight), "blank");
        blank.setOrigin(0.5, 0.5);
        blank.scaleY = scaleFactor;
        blank.scaleX = scaleFactor - (6 - words[i].length) * 0.12 * scaleFactor;
        this.blanks.push(blank);
        
        // create the word itself
        let tempWord = words[i].toUpperCase();
        for (var j = 0; j < tempWord.length; j++) {
          let blank_letter = this.add.sprite(deviceWidth * (66 / iphoneWidth) + j * deviceWidth * (26 / iphoneWidth), deviceHeight * ((705 + i * 55) / iphoneHeight), tempWord[j] + "_f");
          blank_letter.setOrigin(0, 0.5);
          blank_letter.setScale(scaleFactor);
          this.blank_words.push(blank_letter);
        }
        
        // create the associated points
        let point_val = 100;
        if (words[i].length > 3) point_val = (words[i].length - 3) * 400 + 200 * (words[i].length >= 6);
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

  // function to add an animation for moving something
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

// function updates the timer to count down 1 second at a time
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
      this.time.removeAllEvents();  // stop the countdown
      const scene = game.scene.keys.WordHunts;
      scene.endGame();
      countdownSec = -10;
    } else {
      setTextArray(this, this.timer, str_time, "_t");
    }
  }
}

// function edits an array of images next to each other as if it is text
function setTextArray(scene, array, set, folder) {
  for (var i = 0; i < array.length; i++) {
    array[i].setTexture(set[i] + folder);
  }
  for (var i = array.length; i < set.length; i++) {
    let distance = 0;
    let offset = 0;
    // set parameters depending on type of text
    if (folder == "_p") { // if points
      distance = 50;
      offset = 590;
    } else if (folder == "_w") { // if number of words count
      distance = 25;
      offset = 490;
    } else if (folder == "_t") { // if end game display word
      distance = 20;
    }
    let new_var = scene.add.sprite(deviceWidth * (offset / iphoneWidth) + array.length * (deviceWidth * (distance / iphoneWidth)), array[array.length - 1].y, set[i] + folder);
    new_var.setScale(scaleFactor);
    new_var.setOrigin(0, 0.5);
    array.push(new_var);
  }
}

// function updates the points with an incrementing animation
function updatePoints() {
  if (points < set_limit) { // continue updating if displayed points is lower than expected total
    if (set_limit - points <= 5) { // automatically set to the final if we're close enough
      points = set_limit;
    } else { // add a random increment
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

// function combines korean syllables to form korean characters
function combineJamoList(jamoList) {
  let combinations = [];

  const initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const medials = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const finals = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  
  let result = [];
  let last = 0;

  function flushBuffer(begin, end) {
    for (var i = begin; i < end; i++) {
      result.push(jamoList[i]);
    }
    last = end;
  }

  function checkWord(i, ver) {
    if (i + 1 < jamoList.length && medials.includes(jamoList[i+1])) {
      const initialIndex = initials.indexOf(jamoList[i]);
      const medialIndex = medials.indexOf(jamoList[i+1].length > 1 ? jamoList[i+1][0] : jamoList[i+1]);

      if (!ver && i + 2 < jamoList.length && finals.includes(jamoList[i+2])) {
        const finalIndex = finals.indexOf(jamoList[i+2]);
        const syllableCodePoint = 0xAC00 + (initialIndex * 588) + (medialIndex * 28) + finalIndex;
        result.push(String.fromCharCode(syllableCodePoint));
        last = i + 3;
        return i + 2;
      } else {
        const finalIndex = finals.indexOf('');
        const syllableCodePoint = 0xAC00 + (initialIndex * 588) + (medialIndex * 28) + finalIndex;
        result.push(String.fromCharCode(syllableCodePoint));
        last = i + 2;
        ver = 1;
        return i + 1;
      }
    } else {
      flushBuffer(i, i+1);
      return i;
    }
  }

  for (var i = 0; i < jamoList.length; i++) {
    if (initials.includes(jamoList[i])) {
      flushBuffer(last, i);
      i = checkWord(i, 0);
    } else {
      flushBuffer(last, i+1);
    }
  }

  // push version with final
  combinations.push(result.join(''));

  // reset and recalculate without final
  result = [];
  last = 0;

  for (var i = 0; i < jamoList.length; i++) {
    if (initials.includes(jamoList[i])) {
      flushBuffer(last, i);
      i = checkWord(i, 1);
    } else {
      flushBuffer(last, i+1);
    }
  }

  // push version without final
  combinations.push(result.join(''));

  console.log(combinations)

  // check if any are valid words
  for (var i = 0; i < combinations.length; i++) {
    if (filteredArray.includes(combinations[i])) {
      return combinations[i]; // push the valid word
    }
  }
  
  // push default
  return combinations[0];
}