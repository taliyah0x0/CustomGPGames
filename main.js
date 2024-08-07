let iphoneWidth = 980;
let iphoneHeight = 1642;
let deviceWidth = window.innerWidth;
let deviceHeight = window.innerHeight;

if (window.innerHeight < window.innerWidth) {
  deviceWidth *= 0.9;
  deviceHeight *= 0.9;
  deviceWidth = deviceHeight * (iphoneWidth / iphoneHeight);
} else {
  deviceHeight = deviceWidth * (iphoneHeight / iphoneWidth);
}
let text_offset = 0;
if (deviceHeight != iphoneHeight) {
  //text_offset = 1.86 * (deviceHeight / iphoneHeight);
}

let scaleFactor = deviceWidth / 1179;

let languages = "english";

let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

let dictionaries = [
  ['en-2021', 'en-2015'],
  ['sp-rae'],
  ['fr-lex'],
  ['cn-sub'],
  ['jp-jmd'],
  ['kr-nik']
];
let dictionary_names = [
  ['Collins 2021', 'Collins 2015'],
  ['Real Academia Española'],
  ['Lexique'],
  ['SUBTLEX-CH'],
  ['JMDict'],
  ['National Institue of Korean Language']
]