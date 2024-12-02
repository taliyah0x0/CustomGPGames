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

let game_start = false;
let game;
let letter_inputs = [];
let curr_inputs = [];
let no_start = 0;
let timer = 1;
let music = 1;
let sound = 1;
let countdownMin = 0;
let countdownSec = 59;
let filteredArray;
let dict = dictionaries[0][0];

function startGame() {
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  game_start = true;
  for (var i = 0; i < num_letters; i++) {
    let letter_value = document.getElementsByClassName("letter")[i].value;
    letter_inputs.push(letter_value.toUpperCase());
  }
  curr_inputs = letter_inputs.slice();

  if (!document.getElementById("start_screen").checked) no_start = 1;

  if (!document.getElementById("timer").checked) timer = 0;

  countdownMin = parseInt(document.getElementById("min").value, 10);
  countdownSec = parseInt(document.getElementById("sec").value, 10) - 1;

  if (!document.getElementById("music").checked) music = 0;

  if (!document.getElementById("sound").checked) sound = 0;

  let language_ind;
  let langs = document.getElementsByClassName("language");
  for (var i = 0; i < langs.length; i++) {
    if (langs[i].selected) language_ind = i;
  }

  let dict_ind;
  let dicts = document.getElementsByClassName("dict");
  for (var i = 0; i < dicts.length; i++) {
    if (dicts[i].selected) dict_ind = i;
  }

  dict = dictionaries[language_ind][dict_ind];

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

  document.getElementsByTagName("body")[0].innerHTML = "";
  game = new Phaser.Game(config);
}

function checkTime(index) {
  let time = document.getElementsByClassName("time")[index].value;
  time = parseInt(time, 10);
  if (isNaN(time)) {
    time = 0;
  }
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
  if (!option) {
    document.getElementsByClassName("time")[0].disabled = true;
    document.getElementsByClassName("time")[1].disabled = true;
  } else {
    document.getElementsByClassName("time")[0].disabled = false;
    document.getElementsByClassName("time")[1].disabled = false;
  }
}

function edit(direction) {
  document.getElementById("custom_letter").value = parseInt(document.getElementById("custom_letter").value) + parseInt(direction);
  editLetters();
}

var num_letters = 6;
function editLetters() {
  document.getElementById("form").style.width = deviceWidth + "px";
  document.getElementById("form").style.padding = "0 10px 0 10px";
  let option = document.getElementById("custom").checked;
  if (!option) {
    document.getElementById("custom_letter").disabled = true;
    document.getElementById("custom_letter").classList.remove("text-gray-900");
    document.getElementById("custom_letter").classList.add("text-gray-400");
    if (document.getElementById("custom-buttons").innerHTML != "") {
    document.getElementById("custom-buttons").innerHTML = "";
    }
  } else {
    document.getElementById("custom_letter").disabled = false;
    num_letters = parseInt(document.getElementById("custom_letter").value);
    if (num_letters > 9) num_letters = 9;
    if (num_letters < 0) num_letters = 0;
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

  document.getElementById("letters").innerHTML = "";
  for (var i = 0; i < num_letters; i++) {
    document.getElementById("letters").innerHTML +=
      `<input type="text" class="w-9 h-9 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center letter uppercase">`;
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // Swap the current element with the random index
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

function clearBoard() {
  let inputs = document.getElementsByClassName("letter");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

function generateLetters() {
  let language = 0;
  for (var i = 0; i < document.getElementsByClassName("language").length; i++) {
    if (document.getElementsByClassName("language")[i].selected) {
      language = i;
    }
  }
  let board = [];
  for (let i = 0; i < num_letters; i++) {
    board.push(alphabet[0]);
    let random = Math.random() * letter_freq_sum[language][letter_freq_sum[language].length - 1];
    for (let j = 1; j < letter_freq_sum[language].length; j++) {
      if (random < letter_freq_sum[language][j] && random >= letter_freq_sum[language][j - 1]) {
        board[i] = alphabet[j];
      }
    }
  }
  for(let i = 0; i < board.length; i++) {
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

function checkDict() {
  for (var i = 0; i < document.getElementsByClassName("language").length; i++) {
    if (document.getElementsByClassName("language")[i].selected) {
      alphabet = alphabets[i];
      const inputs = document.querySelectorAll(".letter");
      inputs.forEach((input) => {
        input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
      });
      languages = document.getElementsByClassName("language")[i].value;
      document.getElementById("dictionary").innerHTML = "";
      for (var j = 0; j < dictionaries[i].length; j++) {
        document.getElementById("dictionary").innerHTML +=
          `<option value="" class="dict"></option>`
          document.getElementsByClassName("dict")[j].innerHTML = dictionary_names[i][j];
          document.getElementsByClassName("dict")[j].value = dictionary_names[i][j];
      }
    }
  }
  document.getElementsByClassName("dict")[0].selected = true;
}