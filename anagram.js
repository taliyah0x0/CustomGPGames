// TALIYAH HUANG
/* Custom GamePigeon Games -- options selection for Anagrams */

let config = {
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
  scene: [Anagrams],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

let game;
let game_start = false; // if game has started yet
let letter_inputs = []; // letters chosen for the game in order of input into the letter boxes
let curr_inputs = []; // letters of the game in order of current game play
let no_start = 0; // default there should be a start screen
let timer = 1; // default there should be a timer
let music = 1; // default music on
let sound = 1; // default sound effects on
let countdownMin = 0; // default
let countdownSec = 59; // default 1 minute countdown
let filteredArray;
let dict = dictionaries[0][0]; // default english Collins 2021

// function runs when user hits the start game at the bottom
function startGame() {
  document.getElementsByTagName("body")[0].style.overflow = "hidden"; // disable scrolling page
  game_start = true;
  for (var i = 0; i < num_letters; i++) { // collect the letter inputs
    let letter_value = document.getElementsByClassName("letter")[i].value;
    letter_inputs.push(letter_value.toUpperCase());
  }
  curr_inputs = letter_inputs.slice(); // make a copy for current inputs

  // set options
  if (!document.getElementById("start_screen").checked) no_start = 1;
  if (!document.getElementById("timer").checked) timer = 0;
  if (!document.getElementById("music").checked) music = 0;
  if (!document.getElementById("sound").checked) sound = 0;

  // set countdown timer length
  countdownMin = parseInt(document.getElementById("min").value, 10);
  countdownSec = parseInt(document.getElementById("sec").value, 10) - 1;

  // look for what language was chosen
  let language_ind;
  let langs = document.getElementsByClassName("language");
  for (var i = 0; i < langs.length; i++) {
    if (langs[i].selected) language_ind = i;
  }

  // look for what dictionary was chosen
  let dict_ind;
  let dicts = document.getElementsByClassName("dict");
  for (var i = 0; i < dicts.length; i++) {
    if (dicts[i].selected) dict_ind = i;
  }

  dict = dictionaries[language_ind][dict_ind]; // set the specific dictionary

  // create an array of all the possibe words of that dictionary
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
      filteredArray = combinedArray.filter((word) => word.length <= 9);
    })
    .catch((error) => console.error("Error loading JSON:", error));

  document.getElementsByTagName("body")[0].innerHTML = ""; // clear the body
  game = new Phaser.Game(config); // move to Anagrams.js
}

// function checks for a valid time was inputted
function checkTime(index) {
  let time = document.getElementsByClassName("time")[index].value;
  time = parseInt(time, 10);
  if (isNaN(time)) time = 0; // set default 0 if invalid
  if (time < 10) document.getElementsByClassName("time")[index].value = "0" + time.toString(); // add a preceeding 0
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

// function increases/decreases number of letters with the +/- buttons
function edit(direction) {
  document.getElementById("custom_letter").value = parseInt(document.getElementById("custom_letter").value) + parseInt(direction);
  editLetters();
}

var num_letters = 6; // default is 6 letters

// function creates the appropriate number of letter boxes and checks validity
function editLetters() {
  document.getElementById("form").style.width = deviceWidth + "px";
  document.getElementById("form").style.padding = "0 10px 0 10px";

  let option = document.getElementById("custom").checked;
  if (!option) { // if custom letters was not selected, disable the input for number of letters
    document.getElementById("custom_letter").disabled = true;
    document.getElementById("custom_letter").classList.remove("text-gray-900");
    document.getElementById("custom_letter").classList.add("text-gray-400");
    if (document.getElementById("custom-buttons").innerHTML != "") document.getElementById("custom-buttons").innerHTML = "";
  } else { // if custom letters was selected, enable the input;
    document.getElementById("custom_letter").disabled = false;
    num_letters = parseInt(document.getElementById("custom_letter").value);
    if (num_letters > 9) num_letters = 9; // check that there are no more than 9 letters
    if (num_letters < 0) num_letters = 0; // check that there is at least 0 letters
    document.getElementById("custom_letter").value = num_letters;
    document.getElementById("custom_letter").classList.add("text-gray-900");
    document.getElementById("custom_letter").classList.remove("text-gray-400");
    if (document.getElementById("custom-buttons").innerHTML == "") {
      document.getElementById("custom-buttons").innerHTML +=
      `<p onclick="edit(-1)" class="custom-button ml-2">➖</p><p onclick="edit(1)" class="custom-button ml-2">➕</p>`;
    }
  }

  if (document.getElementsByClassName("num_letters")[0].checked) num_letters = 6;
  if (document.getElementsByClassName("num_letters")[1].checked) num_letters = 7;

  // create the appropriate number of letter boxes
  document.getElementById("letters").innerHTML = "";
  for (var i = 0; i < num_letters; i++) {
    document.getElementById("letters").innerHTML +=
    `<input type="text" class="w-9 h-9 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center letter uppercase">`;
  }

  // check that the letters inputted are valid in the selected language's alphabet
  const inputs = document.querySelectorAll(".letter");
  inputs.forEach((input, index) => {
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

// function for randomization used in Anagrams.js
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      // generate a random index between 0 and i
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // swap the current element with the random index
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

// function clears all the letter boxes
function clearBoard() {
  let inputs = document.getElementsByClassName("letter");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

// function fills the letter boxes
function generateLetters() {
  // check what language is selected
  let language = 0;
  for (var i = 0; i < document.getElementsByClassName("language").length; i++) {
    if (document.getElementsByClassName("language")[i].selected) {
      language = i;
    }
  }

  // loop through letter boxes and each have independent probability to get any letter
  let board = [];
  for (let i = 0; i < num_letters; i++) {
    board.push(alphabet[0]);
    // use the letter frequencies to pick a letter
    let random = Math.random() * letter_freq_sum[language][letter_freq_sum[language].length - 1];
    for (let j = 1; j < letter_freq_sum[language].length; j++) {
      if (random < letter_freq_sum[language][j] && random >= letter_freq_sum[language][j - 1]) {
        board[i] = alphabet[j];
      }
    }
  }
  // set the letters
  for (let i = 0; i < board.length; i++) {
    document.getElementsByClassName("letter")[i].value = board[i];
  }
  
  // Using GamePigeon generated Anagrams boards
  /*if (num_letters == 6 && languages != 'jp') {
    fetch(`./anagrams/${languages}.txt`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
      let lines = data.split('\n');
      let chosen_line = lines[Math.floor(Math.random() * 4)];
      let board = chosen_line.toUpperCase().split("");
      board = shuffleArray(board);
      for (var i = 0; i < num_letters; i++) {
        document.getElementsByClassName("letter")[i].value = board[i];
      }
    })
  } else if (num_letters >= 1 && num_letters <= 9) {
    fetch(`anagrams/${languages}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const words = data[num_letters];
        const word = words[Math.floor(Math.random() * words.length)];

        let shuffledLetters = word.split("");
        for (let i = shuffledLetters.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [shuffledLetters[i], shuffledLetters[j]] = [
            shuffledLetters[j],
            shuffledLetters[i],
          ];
        }

        for (var i = 0; i < num_letters; i++) {
          document.getElementsByClassName("letter")[i].value = shuffledLetters[i];
        }
      })
  }*/
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