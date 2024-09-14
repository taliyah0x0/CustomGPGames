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

let scaleFactor = deviceWidth / 1179;

let alphabets = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  ["A", "Á", "B", "C", "D", "E", "É", "F", "G", "H", "I", "Í", "J", "K", "L", "M", "N", "Ñ", "O", "Ó", "P", "Q", "R", "S", "T", "U", "Ú", "Ü", "V", "W", "X", "Y", "Z", "´"],
  ["A", "À", "Â", "B", "C", "D", "E", "É", "È", "Ê", "Ë", "F", "G", "H", "I", "Î", "Ï", "J", "K", "L", "M", "N", "O", "Ô", "P", "Q", "R", "S", "T", "U", "Ù", "Û", "Ü", "V", "W", "X", "Y", "Ÿ", "Z"],
  [ "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ"],
];
let alphabet = alphabets[0];

let dictionaries = [
  ['en-2021', 'en-2019', 'en-2015'],
  ['sp-rae'],
  ['fr-lex'],
  ['jp-jmd'],
  ['cn-sub'],
  ['kr-nik']
];
let dictionary_names = [
  ['Collins 2021', 'Collins 2019', 'Collins 2015'],
  ['Real Academia Española'],
  ['Lexique'],
  ['JMDict'],
  ['SUBTLEX-CH'],
  ['National Institue of Korean Language']
]

let languages = "en";