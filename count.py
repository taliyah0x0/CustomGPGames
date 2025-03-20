alphabets = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  ["A", "Á", "B", "C", "D", "E", "É", "F", "G", "H", "I", "Í", "J", "K", "L", "M", "N", "Ñ", "O", "Ó", "P", "Q", "R", "S", "T", "U", "Ú", "Ü", "V", "W", "X", "Y", "Z", "´"],
  ["A", "À", "Â", "B", "C", "Ç", "D", "E", "É", "È", "Ê", "Ë", "F", "G", "H", "I", "Î", "Ï", "J", "K", "L", "M", "N", "O", "Ô", "Œ", "P", "Q", "R", "S", "T", "U", "Ù", "Û", "Ü", "V", "W", "X", "Y", "Z"],
  ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "っ"],
  ["ㄅ", "ㄆ", "ㄇ", "ㄈ", "ㄉ", "ㄊ", "ㄋ", "ㄌ", "ㄍ", "ㄎ", "ㄏ", "ㄐ", "ㄑ", "ㄒ", "ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ", "ㄚ", "ㄛ", "ㄜ", "ㄝ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄢ", "ㄣ", "ㄤ", "ㄥ", "ㄦ", "ㄧ", "ㄨ", "ㄩ", "ㄭ"],
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Ä", "Ö", "Ü", "ẞ"],
  ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"],
  ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я"],
  ["ﺍ", "ﺏ", "ﺕ", "ﺙ", "ﺝ", "ﺡ", "ﺥ", "ﺩ", "ﺫ", "ﺭ", "ﺯ", "ﺱ", "ﺵ", "ﺹ", "ﺽ", "ﻁ", "ﻅ", "ﻉ", "ﻍ", "ﻑ", "ﻕ", "ﻙ", "ﻝ", "ﻡ", "ﻥ", "ﻩ", "ﻭ", "ﻱ", "ﺁ", "ﺓ", "ﻯ"],
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  ['अ', "आ", "इ", "ई", "उ", "ऊ", "ऎ", "ॲ", "ए",	"ऐ", "ऒ", "ऑ", "ओ",	"औ", "ऋ", "ॠ", "ऌ",	"ॡ", "अं", "अः", "अँ", "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "क्ष", "त्र", "ज्ञ"],
  ['', "ि", "ी","ु","ू","ॆ","ॅ","े","ै","ॊ","ॉ","ो"	"ौ","ृ","ॄ","ॢ","ॣ","ं","ः","ँ"],
]

sort_order = alphabets[11]
dictionary = 'hi-git.json'
sort_order = [x.lower() for x in sort_order] # use this for alphabetical languages

import json
from collections import Counter

def count_and_sort_frequencies_percentage(json_file_path, sort_order):
    # Load the JSON file
    '''with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)'''
    with open(json_file_path, "rb") as file:
        raw_data = file.read().decode("utf-8", errors="ignore")
        data = json.loads(raw_data)

    # Function to recursively extract all text from the JSON object
    def extract_text(obj):
        if isinstance(obj, dict):
            return ''.join(extract_text(value) for value in obj.values())
        elif isinstance(obj, list):
            return ''.join(extract_text(item) for item in obj)
        elif isinstance(obj, str):
            return obj
        else:
            return ''
    
    # Extract all text from the JSON object
    all_text = extract_text(data)
    
    # Count character frequencies
    char_counts = Counter(all_text)
    print(char_counts)
    
    # Calculate total number of characters
    total_characters = sum(char_counts.values())
    
    # Calculate cumulative frequencies
    cumulative_frequencies = []
    cumulative_sum = 0
    char_list = []
    for char in char_counts:
        if char_counts.get(char, 0) > 1000:
            frequency = (char_counts.get(char, 0) / total_characters) if total_characters > 0 else 0
            cumulative_sum += frequency
            cumulative_frequencies.append(cumulative_sum)
            char_list.append(char)
            print(char, char_counts.get(char, 0))
    print(char_list, len(char_list))
    return cumulative_frequencies
    

json_file_path = f'dictionaries/{dictionary}'
frequencies_percentage = count_and_sort_frequencies_percentage(json_file_path, sort_order)
print(frequencies_percentage)