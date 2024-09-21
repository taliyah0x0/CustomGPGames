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

let game_start = false;
let game;
let letter_inputs = [];
//let letter_inputs = ['A', 'B', 'A', 'T', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
let no_start = 0;
let timer = 1;
let music = 1;
let sound = 1;
let countdownMin = 1;
let countdownSec = 20;
let filteredArray;
let dict = dictionaries[0][0];

function startHuntGame() {
  game_start = true;
  dict = dictionaries[0][0];

  for (var i = 0; i < 16; i++) {
    let letter_value = document.getElementsByClassName("letter")[i].value;
    letter_inputs.push(letter_value.toUpperCase());
  }

  if (document.getElementById("start_screen").checked == false) {
    no_start = 1;
  }

  if (document.getElementById("timer").checked == false) {
    timer = 0;
  }

  countdownMin = parseInt(document.getElementById("min").value, 10);
  countdownSec = parseInt(document.getElementById("sec").value, 10) - 1;

  if (document.getElementById("music").checked == false) {
    music = 0;
  }

  if (document.getElementById("sound").checked == false) {
    sound = 0;
  }

  fetch(`dictionaries/${dict}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Combine all arrays into a single array
      const combinedArray = Object.values(data).flat();
      console.log(combinedArray.length)
      filteredArray = combinedArray.filter((word) => word.length >= 3);
    })
    .catch((error) => console.error("Error loading JSON:", error));

  document.getElementsByTagName("body")[0].innerHTML = `<div class="wh-floating-text"></div>`;
  game = new Phaser.Game(huntconfig);
}

const TOTAL_LETTERS = 16;
let dictionary;
// More vowels to increase their chances of appearing
const alphabet_i = "AAAAABCDEEEEEFGHIIIIIJKLMNOOOOOPQRSTUUUUUVWXYZ".split("");
const vowels = "AEIOU".split("");
let letters = [];

function makeLetterBoxes() {
  const letter_c = document.getElementById("letters");
  letter_c.innerHTML = "";
  let counter = 1;
  for (let i=0; i < 4; i++) {
    for (let j=0; j < 4; j++) {
      letter_c.innerHTML += 
        `<input type="text" id="${counter}" maxLength="1" class="w-9 h-9 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center letter uppercase">`;
      counter++;
    }
    letter_c.innerHTML += `<br>`;
  }

  const inputs = document.querySelectorAll(".letter");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (languages != 'jp' && languages != 'fr') {
        input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
      } else if (alphabet.includes(input.value.toUpperCase().substring(0,1))) {
        inputs[index + 1].value = input.value.substring(1);
        inputs[index + 1].focus();
        input.value = input.value.substring(0,1);
      }

      if (languages != 'jp' && languages != 'fr' && input.value.length >= 1 && input.value != '´') {
        input.value = input.value.substring(0,1);
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });

    input.addEventListener('blur', function() {
      input.value = input.value.substring(0,1);
      input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value === "") {
        if (index > 0) {
          inputs[index - 1].focus();
        }
      }
    });
  });
}

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

function checkTime(index) {
  let time = document.getElementsByClassName("time")[index].value;
  time = parseInt(time, 10);
  if (time < 10) {
    document.getElementsByClassName("time")[index].value =
      "0" + time.toString();
  }
  if (
    document.getElementsByClassName("time")[0].value == "00" &&
    document.getElementsByClassName("time")[1].value == "00"
  ) {
    document.getElementsByClassName("time")[1].value = "01";
  }
}

function disableTime() {
  let option = document.getElementById("timer").checked;
  if (option == false) {
    document.getElementsByClassName("time")[0].disabled = true;
    document.getElementsByClassName("time")[1].disabled = true;
  } else {
    document.getElementsByClassName("time")[0].disabled = false;
    document.getElementsByClassName("time")[1].disabled = false;
  }
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
});