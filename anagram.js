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
  game_start = true;
  for (var i = 0; i < num_letters; i++) {
    let letter_value = document.getElementsByClassName("letter")[i].value;
    letter_inputs.push(letter_value.toUpperCase());
  }
  curr_inputs = letter_inputs.slice();

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

  let language_ind;
  let langs = document.getElementsByClassName("language");
  for (var i = 0; i < langs.length; i++) {
    if (langs[i].selected == true) {
      language_ind = i;
    }
  }

  let dict_ind;
  let dicts = document.getElementsByClassName("dict");
  for (var i = 0; i < dicts.length; i++) {
    if (dicts[i].selected == true) {
      dict_ind = i;
    }
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
      console.log(combinedArray.length)
      filteredArray = combinedArray.filter((word) => word.length <= 9);
    })
    .catch((error) => console.error("Error loading JSON:", error));

  document.getElementsByTagName("body")[0].innerHTML = "";
  game = new Phaser.Game(config);
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

var num_letters = 6;
function editLetters() {
  document.getElementById("form").style.width = deviceWidth + "px";
  document.getElementById("form").style.padding = "0 10px 0 10px";
  let option = document.getElementById("custom").checked;
  if (option == false) {
    document.getElementById("custom_letter").disabled = true;
    document.getElementById("custom_letter").classList.remove("text-gray-900");
    document.getElementById("custom_letter").classList.add("text-gray-400");
  } else {
    document.getElementById("custom_letter").disabled = false;
    num_letters = document.getElementById("custom_letter").value;
    document.getElementById("custom_letter").classList.add("text-gray-900");
    document.getElementById("custom_letter").classList.remove("text-gray-400");
  }

  if (document.getElementsByClassName("num_letters")[0].checked == true) {
    num_letters = 6;
  } else if (
    document.getElementsByClassName("num_letters")[1].checked == true
  ) {
    num_letters = 7;
  }

  document.getElementById("letters").innerHTML = "";
  for (var i = 0; i < num_letters; i++) {
    document.getElementById("letters").innerHTML +=
      `<input type="text" class="w-9 h-9 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center letter uppercase">`;
  }

  const inputs = document.querySelectorAll(".letter");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (languages != 'japanese' && languages != 'french') {
        input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
      } else if (alphabet.includes(input.value.toUpperCase().substring(0,1))) {
        inputs[index + 1].value = input.value.substring(1);
        inputs[index + 1].focus();
        input.value = input.value.substring(0,1);
      }

      if (languages != 'japanese' && languages != 'french' && input.value.length >= 1 && input.value != '´') {
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

function generateLetters() {
  fetch(`anagrams/${languages}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Access the array of six-letter words
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
    .catch((error) => console.error("Error loading JSON:", error));
}

function checkDict() {
  for (var i = 0; i < document.getElementsByClassName("language").length; i++) {
    if (document.getElementsByClassName("language")[i].selected == true) {
      alphabet = alphabets[i];
      const inputs = document.querySelectorAll(".letter");
      inputs.forEach((input) => {
        input.value = input.value.split('').map(char => alphabet.includes(char.toUpperCase()) ? char : '').join('');
      });
      languages = document.getElementsByClassName("language")[i].innerHTML.toLowerCase();
      document.getElementById("dictionary").innerHTML = "";
      for (var j = 0; j < dictionaries[i].length; j++) {
        document.getElementById("dictionary").innerHTML +=
          `<option value="Collins 2021" class="dict"></option>`
          document.getElementsByClassName("dict")[j].innerHTML = dictionary_names[i][j];
      }
    }
  }
  document.getElementsByClassName("dict")[0].selected = true;
}