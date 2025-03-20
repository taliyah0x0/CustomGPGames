// TALIYAH HUANG
/* Custom GamePigeon Games -- options selection for Word Hunt */

let huntconfig = {
  type: Phaser.AUTO,
  width: deviceWidth,
  height: deviceHeight * (1825 / iphoneHeight),
  backgroundColor: 0x000000,
  parent: "phaser-div",
  mode: Phaser.Scale.FIT,
  dom: {
    createContainer: true,
  },
  fontFamily: ["Arial", "Arial Black"],
  scene: [WordHunts],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

let game;
let game_start = false; // if the game has started or not
let letter_inputs = []; // letters chosen for the game in order of input into the letter boxes
let no_start = 0; // default there should be a start screen
let timer = 1; // default there should be a countdown timer
let music = 1; // default music on
let sound = 1; // default sound effects on
let countdownMin = 1; // default 1 minute
let countdownSec = 20; // default 20 seconds
let filteredArray;
let dict = dictionaries[0][0]; // default english Collins 2021

// function runs when the user presses start game at the bottom
function startHuntGame() {
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  game_start = true;
  
  // look for language
  let language_ind;
  let langs = document.getElementsByClassName("language");
  for (var i = 0; i < langs.length; i++) {
    if (langs[i].selected) language_ind = i;
  }

  // look for dictionary
  let dict_ind;
  let dicts = document.getElementsByClassName("dict");
  for (var i = 0; i < dicts.length; i++) {
    if (dicts[i].selected) dict_ind = i;
  }

  dict = dictionaries[language_ind][dict_ind]; // set the language and dictionary

  for (var i = 0; i < rows * cols; i++) {
    let letter_value = document.getElementsByClassName("letter")[i].value;
    letter_inputs.push(letter_value.toUpperCase());
  }

  // set options
  if (!document.getElementById("start_screen").checked) no_start = 1;
  if (!document.getElementById("timer").checked) timer = 0;
  if (!document.getElementById("music").checked) music = 0;
  if (!document.getElementById("sound").checked) sound = 0;

  countdownMin = parseInt(document.getElementById("min").value, 10);
  countdownSec = parseInt(document.getElementById("sec").value, 10) - 1;

  // create an array of all the possibe words of that dictionary
  fetch(`dictionaries/${dict}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // combine all arrays into a single array
      const combinedArray = Object.values(data).flat();
      if (dict == "kr-ken") {
        filteredArray = combinedArray;
      } else {
        filteredArray = combinedArray.filter((word) => word.length >= 3);
      }
    })
    .catch((error) => console.error("Error loading JSON:", error));

  // prep floating objects
  document.getElementsByTagName("body")[0].innerHTML = `<div class="wh-floating-text"></div><div class="more"></div>`;
  game = new Phaser.Game(huntconfig);
}

// set defaults
let rows = 4;
let cols = 4;
let format = rows;

// function creates the letter boxes for input
function makeLetterBoxes() {
  rows = parseInt(document.getElementsByClassName("rowcol")[0].value);
  cols = parseInt(document.getElementsByClassName("rowcol")[1].value);

  // make sure it's not going over the max or min
  if (rows > 9) rows = 9;
  if (cols > 9) cols = 9;
  if (rows < 0) rows = 0;
  if (cols < 0) cols = 0;

  document.getElementsByClassName("rowcol")[0].value = rows;
  document.getElementsByClassName("rowcol")[1].value = cols;

  format = rows; // saves the larger dimension
  if (cols > rows) format = cols;

  const letter = document.getElementById("letters");
  letter.innerHTML = "";
  let counter = 1;
  // create the inputs
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      letter.innerHTML += `<input type="text" id="${counter}" maxLength="1" class="w-9 h-9 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center letter uppercase">`;
      counter++;
    }
    letter.innerHTML += `<br>`;
  }

  const inputs = document.querySelectorAll(".letter");
  inputs.forEach((input, index) => { // check that the inputs are valid
    input.addEventListener("input", () => {
      if (languages != 'jp' && languages != 'fr') { // if not japanese or french, check that letter exists in the language's alphabet
        input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
      } else if (alphabet.includes(input.value.toUpperCase().substring(0, 1))) { // if japanese or french, move cursor appropriately
        inputs[index + 1].value = input.value.substring(1);
        inputs[index + 1].focus();
        input.value = input.value.substring(0, 1);
      }

      // move the cursor to next letter box as letters are inputted one by one
      if (languages != 'jp' && languages != 'fr' && input.value.length >= 1 && input.value != '´') {
        input.value = input.value.substring(0, 1);
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });

    // check that the letter exists in the language's alphabet after exiting the letter box
    input.addEventListener('blur', function() {
      input.value = input.value.substring(0, 1);
      input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
    });

    // move back one letter box when backspacing
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value === "") {
        if (index > 0) inputs[index - 1].focus();
      }
    });
  });
}

// function runs when a new language or dictionary is picked
function checkDict() {
  for (var i = 0; i < document.getElementsByClassName("language").length; i++) {
    if (document.getElementsByClassName("language")[i].selected) {
      alphabet = alphabets[i]; // set the alphabet
      const inputs = document.querySelectorAll(".letter");
      inputs.forEach((input) => { // check that the letter inputs in the boxes are valid for this language
        input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
      });

      languages = document.getElementsByClassName("language")[i].value;
      document.getElementById("dictionary").innerHTML = "";
      
      // switch the dictionaries dropdown options to fit this language
      for (var j = 0; j < dictionaries[i].length; j++) {
        document.getElementById("dictionary").innerHTML += `<option value="" class="dict"></option>`;
        document.getElementsByClassName("dict")[j].innerHTML = dictionary_names[i][j];
        document.getElementsByClassName("dict")[j].value = dictionary_names[i][j];
      }
      break;
    }
  }
  document.getElementsByClassName("dict")[0].selected = true; // select first dictionary as default
}

// function checks for a valid time was inputted
function checkTime(index) {
  let time = document.getElementsByClassName("time")[index].value;
  time = parseInt(time, 10);
  if (isNaN(time)) time = 0; // set default 0 if invalid
  if (time < 10) document.getElementsByClassName("time")[index].value = "0" + time.toString();
  if (document.getElementsByClassName("time")[0].value == "00" && document.getElementsByClassName("time")[1].value == "00") {
    document.getElementsByClassName("time")[1].value = "01"; // set default 1 second if both minutes and seconds are 0
  }
}

// function disables time input if timer is unchecked
function disableTime() {
  let option = document.getElementById("timer").checked;
  if (!option) {
    document.getElementsByClassName("time")[0].disabled = true;
    document.getElementsByClassName("time")[1].disabled = true;
  } else {
    document.getElementsByClassName("time")[0].disabled = false;
    document.getElementsByClassName("time")[1].disabled = false;
  }
}

// function generates the letters for the board
function generateBoard() {
  // find what language is selected
  let language = 0;
  for (var i = 0; i < document.getElementsByClassName("language").length; i++) {
    if (document.getElementsByClassName("language")[i].selected) language = i;
  }

  let board = [];
  for (let i = 0; i < rows * cols; i++) {
    board.push(alphabet[0]);
    let random = Math.random() * letter_freq_sum[language][letter_freq_sum[language].length - 1];
    for (let j = 1; j < letter_freq_sum[language].length; j++) {
      if (random < letter_freq_sum[language][j] && random >= letter_freq_sum[language][j - 1]) {
        board[i] = alphabet[j];
      }
    }
  }
  for (let i = 0; i < board.length; i++) {
    document.getElementsByClassName("letter")[i].value = board[i];
  }

  // Using GamePigeon generated Wordhunt Boards
  /*fetch(`./wordhunts/${languages}.txt`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
      let lines = data.split('\n');
      let chosen_line = lines[Math.floor(Math.random() * 50)];
      let board = chosen_line.toUpperCase().split("");
      for(let i = 0; i < board.length; i++) {
        document.getElementsByClassName("letter")[i].value = board[i];
      }
    })*/
}

// function clears all the letter inputs
function clearBoard() {
  let inputs = document.getElementsByClassName("letter");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

// function recreates letter boxes when the number of rows or columns is edited
function edit(type, direction) {
  document.getElementsByClassName("rowcol")[type].value = parseInt(document.getElementsByClassName("rowcol")[type].value) + parseInt(direction);
  makeLetterBoxes();
}

// HERE LIES VIET'S CODE BELOW 🪦
/*const TOTAL_LETTERS = 16;
let dictionary;
// More vowels to increase their chances of appearing
const alphabet_i = "AAAAABCDEEEEEFGHIIIIIJKLMNOOOOOPQRSTUUUUUVWXYZ".split("");
const vowels = "AEIOU".split("");
let letters = [];

function fillMatrixWithLetters(board) {
    for(let i = 0; i < board.length; i++) {
      document.getElementsByClassName("letter")[i].value = board[i];
    }
}

function generateLetters(num_letters = TOTAL_LETTERS) {
  letters = [];
  if (num_letters > 0) {
    for(let i = 0; i < num_letters; i++) {
      letters.push(alphabet_i[Math.floor(Math.random() * alphabet_i.length)]);
    }
    return letters;
  }else {
    generateLetters(TOTAL_LETTERS);
  }
  return letters;
}

async function generateBoard(num_letters = TOTAL_LETTERS) {
  let board = await generateOptimalBoards();
  fillMatrixWithLetters(board);
}

async function generateOptimalBoards(tries = 5) {
  let maxSolutions = 0;
  let board = [];
  await dictionary.createDictionary();
  for(let i = 0; i < tries; i++) {
    let letters = generateLetters();
    let num = await solve(letters);
    console.log(`Board ${letters} has ${ num } solutions`)
    if (num >= maxSolutions) {
      maxSolutions = num;
      board = letters;
    }
  }
  return board;
}

// Takes in the letters array (which is basically just the board setup)
async function solve(b) {
  let board = b;
  let answers = [];
  let numWords = 0;
  let visited = new Array(16).fill(false);

  async function recurse(board, word, row, column, visited) {
    let index = row*4 + column;

    if (visited[index] || column < 0 || column > 3 || row < 0 || row > 3){
      return;
    }

    let letter = board[index];
    word += letter;
    visited[index] = true;

    if (dictionary.isPre(word)){
      if (dictionary.isWord(word) && !answers.includes(word)) {
        numWords++;
        answers.push(word);
      }
      recurse(board, word, row + 1, column + 1, [...visited]);
      recurse(board, word, row + 1, column, [...visited]);
      recurse(board, word, row + 1, column - 1, [...visited]);
      recurse(board, word, row, column + 1, [...visited]);
      recurse(board, word, row, column - 1, [...visited]);
      recurse(board, word, row - 1, column + 1, [...visited]);
      recurse(board, word, row - 1, column, [...visited]);
      recurse(board, word, row - 1, column - 1, [...visited]);
    }

    visited[index] = false;
  }

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      await recurse(board, "", row, column, visited);
    }
  }

  console.log("num: ", numWords);
  console.log("solutions: ", answers)
  return numWords;
}

class Letter {
  constructor(l = "", e = false) {
    this.letter = l;
    this.children = [];
    this.endOfWord = e;
  }

  calculateIndex(letter) {
    return alphabet_i.indexOf(letter.toUpperCase());
  }

  insert(word) {
    if (word === "") {
      this.endOfWord = true;
    } else {
      let lt = word.charAt(0).toUpperCase();
      let index = this.calculateIndex(lt);
      if (this.children[index] == undefined) {
        let eow;
        if (word.length == 1) {
          eow = true; 
        } else {
          eow = false;
        }
        this.children[index] = new Letter(lt, eow)
      }
      this.children[index].insert(word.substring(1));
    }
  }

  isWord(word) {
    if (word == "") {
      return this.endOfWord;
    } else {
      let lt = word.charAt(0).toUpperCase();
      let i = this.calculateIndex(lt);
      if (this.children[i] == undefined) {
        return false;
      } else {
        return this.children[i].isWord(word.substring(1));
      }
    }
  }

  isPre(pre) {
    if (pre == "") {
      return true;
    } else {
      let lt = pre.charAt(0).toUpperCase();
      let i = this.calculateIndex(lt);
      if (this.children[i] == undefined) {
        return false;
      } else {
        return this.children[i].isPre(pre.substring(1));
      }
    }
  }
}

class dictionaryTrie {
  constructor() {
    this.root = new Letter("", false);
  }

  async createDictionary() {
    try {
      let filteredArray;
      const response = await fetch("dictionaries/en-2021.json")
      if (!response.ok) {
        throw new Error("Could not get dictionary");
      }
      const data = await response.json()
      const combinedArray = Object.values(data).flat();

      filteredArray = combinedArray.filter((word) => (word.length <= 16 && word.length >= 3));
      filteredArray.forEach((word) => this.insert(word));

      console.log("Dictionary created", this);
    }catch(error){
      console.error("Error loading dictionary:", error);
    }
  }

  insert(word) {
    return this.root.insert(word)
  }

  isWord(word) {
    return this.root.isWord(word);
  }

  isPre(pre) {
    return this.root.isPre(pre);
  }
}

async function prep() {
  dictionary = new dictionaryTrie();
  makeLetterBoxes();
}

document.addEventListener("DOMContentLoaded", function() {
  prep();
});*/