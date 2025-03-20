# Generate list of all possible 3 letter words from the dictionary without duplicates
'''import json

# Open and read the JSON file
with open('dictionaries/en-2021.json', 'r') as file:
    data = json.load(file)  # Parse the JSON data

# Now `data` is a Python dictionary (or list, depending on the structure of the JSON)
alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
anagrams = []
for letter in alphabet:
    for item in data[letter]:
        if len(item) == 3:
            flag = 0
            for k in range(len(anagrams)):
                if sorted(anagrams[k]) == sorted(item):
                    flag = 1
            if flag == 0:
                anagrams.append(item)

with open('test.json', 'w') as file:
    for i in anagrams:
        file.writelines('"' + i + '",')'''

# Clean up ChatGPT generated high potential list to contain correct letter length words
'''spanishWords = ["sol", "luz", "mar", "pan", "sol", "ave", "voz", "pez", "dos", "rey", "una", "sol", "uno", "pie", "té", "ala", "ojo", "día", "sol", "red", "ira", "nue", "casa", "sal", "ley", "sol", "año", "sol", "voz", "vez", "luz", "sol", "café", "día", "hoy", "sol", "fin", "sol", "sol", "voz", "mar", "sol", "rey", "sol", "voz"];

new = []
for word in spanishWords:
    if len(word) == 3:
        new.append('"' + word + '", ')
    else:
        print(word)

with open('test.json', 'w') as file:
    file.writelines(new)'''

# Generate list of 2 letter words but every character combination
'''letters = [ "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ"]
new = []
for i in range(len(letters)):
    for j in range(len(letters)):
        new.append('"' + letters[i] + letters[j] + '", ')

with open('test.json', 'w') as file:
    file.writelines(new)'''

# Convert all kanji and katakana in the dictionary to hiragana
'''import pykakasi
import json

# Initialize pykakasi
kakasi = pykakasi.kakasi()

# Set the conversion mode to Hiragana
kakasi.setMode("H", "H")  # Convert Katakana to Hiragana
kakasi.setMode("K", "H")  # Convert Katakana to Hiragana
kakasi.setMode("J", "H")  # Convert Kanji to Hiragana

allowed = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん', 'が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'ゎ']
allowed_set = set(allowed)

new = []
flag = 0
with open('dictionaries/jp-jmd.json', 'r') as file:
    data = json.load(file)
    for phrase in data:
        result = kakasi.convert(phrase)
        hiragana = "".join([item['hira'] for item in result])
        if hiragana not in new:
            new.append(hiragana)

new2 = []
for word in new:
    if all(char in allowed_set for char in word):
        new2.append('"' + word + '", ')

with open('test.json', 'w') as file:
    file.writelines(new2)'''

# Categorize number of possible rearrangements for each word, run new program for each character length
'''import json
new = {
    "3": [],
    "4": [],
    "5": [],
    "6": [],
    "7": [],
    "8": [],
    "9": []
}
with open('dictionaries/jp-jmd.json', 'r') as file:
    data = json.load(file)
    for phrase in data:
        if len(phrase) >= 3 and len(phrase) <= 9:
            new[str(len(phrase))].append(phrase)

letter_counts = ["3", "4", "5", "6", "7", "8"]
sorted_anagrams = {}
big = 0
for word in new["9"]:
    anagram = 0
    letter_count = {}
    for letter in word:
        if letter in letter_count:
            letter_count[letter] += 1
        else:
            letter_count[letter] = 1

    for counting in letter_counts:
        for word2 in new[counting]:
            temp_letter_count = letter_count.copy()
            flag = 0
            for letter in word2:
                if letter in letter_count and temp_letter_count[letter] > 0:
                    temp_letter_count[letter] -= 1
                else:
                    flag = 1
            if flag == 0:
                anagram += 1
        if anagram in sorted_anagrams:
            sorted_anagrams[anagram].append(word)
        else:
            sorted_anagrams[anagram] = [word]


sorted_data = {int(k): sorted_anagrams[k] for k in sorted(sorted_anagrams, key=lambda x: int(x), reverse=True)}

with open('jp-9.json', 'w', encoding='utf-8') as json_file:
    # Write the dictionary to the JSON file in a single line
    json.dump(sorted_data, json_file, ensure_ascii=False, separators=(',', ':'))'''

# Create jp-jmd.json
'''stop = ["4", "18", "39", "84", "134", "223", "319"]
stop_ind = 0
for counts in new:
    with open(f'jp-{counts}.json', 'r') as file:
        data = json.load(file)
        for i in data:
            new[counts].extend(data[i])
            if i == stop[stop_ind]:
                break
    stop_ind += 1

with open('dictionaries/jp-jmd.json', 'w', encoding='utf-8') as json_file:
    # Write the dictionary to the JSON file in a single line
    json.dump(new, json_file, ensure_ascii=False, separators=(',', ':'))'''

# Mandarin Hanzi Dictionary to Zhuyin
'''import dragonmapper.hanzi
import json

chars = "ˇˋˊ˙ "
zhuyin = []
with open('dictionaries/cn-sub.json', 'r') as file:
    data = json.load(file)
    for i in range(len(data)):
        convert = dragonmapper.hanzi.to_zhuyin(data[i].replace("·",""))
        for j in range(len(chars)):
            convert = convert.replace(chars[j], "")
        zhuyin.append(convert)

with open('dictionaries/zy-sub.json', 'w', encoding='utf-8') as json_file:
    # Write the dictionary to the JSON file in a single line
    json.dump(zhuyin, json_file, ensure_ascii=False, separators=(',', ':'))'''

# Mandarin Hanzi Dictionary to Pinyin
'''import pinyin
import json

pinyins = []
with open('dictionaries/cn-sub.json', 'r') as file:
    data = json.load(file)
    for i in range(len(data)):
        convert = pinyin.get(data[i], format="strip", delimiter="")
        convert = convert.replace("·", "")
        convert = convert.replace(" ", "")
        pinyins.append(convert)

with open('dictionaries/py-sub.json', 'w', encoding='utf-8') as json_file:
    json.dump(pinyins, json_file, ensure_ascii=False, separators=(',', ':'))'''

# Kengdic korean csv to json
'''import pandas
import json
import re

numbers = "0123456789"
nonkr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
korean_numbers = {
    '1': '일', '2': '이', '3': '삼', '4': '사', '5': '오', '6': '육', '7': '칠', '8': '팔', '9': '구',
    '10': '십', '11': '십일', '12': '십이', '13': '십삼', '14': '십사', '15': '십오', '16': '십육',
    '17': '십칠', '18': '십팔', '19': '십구', '20': '이십', '21': '이십일', '22': '이십이', 
    '24': '이십사', '25': '이십오', '28': '이십팔', '30': '삼십', '32': '삼십이', '33': '삼십삼',
    '40': '사십', '45': '사십오', '48': '사십팔', '50': '오십', '55': '오십오', '58': '오십팔',
    '60': '육십', '64': '육십사', '65': '육십오', '69': '육십구', '70': '칠십', '75': '칠십오',
    '77': '칠십칠', '78': '칠십팔', '80': '팔십', '90': '구십', '95': '구십오', '100': '백',
    '104': '백사', '105': '백오', '106': '백육', '107': '백칠', '112': '백십이', '125': '백이십오',
    '126': '백이십육', '150': '백오십', '180': '백팔십', '185': '백팔십오', '200': '이백', 
    '240': '이백사십', '300': '삼백', '500': '오백', '600': '육백', '700': '칠백', '760': '칠백육십',
    '800': '팔백', '853': '팔백오십삼', '969': '구백육십구'
}

df = pandas.read_csv("kengdic.csv")
second_column = df.iloc[:, 1]
raw = list(second_column)
korean = []
korean_syll = []
hangul = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"]

def decompose_hangul(syllable):
    """Decompose a Hangul syllable into its jamo components, with detailed medial and final splitting."""
    if not (0xAC00 <= ord(syllable) <= 0xD7A3):
        return [syllable]  # Return as a single element list if not a Hangul syllable

    base = ord(syllable) - 0xAC00
    initial_index = base // 588
    medial_index = (base % 588) // 28
    final_index = base % 28

    initials = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
        'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ]
    medials = [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
        'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
    ]
    finals = [
        '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ',
        'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
        'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ]

    # Split compound medials into components
    compound_medials = {
        'ㅘ': ['ㅗ', 'ㅏ'],
        'ㅙ': ['ㅗ', 'ㅐ'],
        'ㅚ': ['ㅗ', 'ㅣ'],
        'ㅝ': ['ㅜ', 'ㅓ'],
        'ㅞ': ['ㅜ', 'ㅔ'],
        'ㅟ': ['ㅜ', 'ㅣ'],
        'ㅢ': ['ㅡ', 'ㅣ']
    }

    # Split compound finals into components
    compound_finals = {
        'ㄳ': ['ㄱ', 'ㅅ'],
        'ㄵ': ['ㄴ', 'ㅈ'],
        'ㄶ': ['ㄴ', 'ㅎ'],
        'ㄺ': ['ㄹ', 'ㄱ'],
        'ㄻ': ['ㄹ', 'ㅁ'],
        'ㄼ': ['ㄹ', 'ㅂ'],
        'ㄽ': ['ㄹ', 'ㅅ'],
        'ㄾ': ['ㄹ', 'ㅌ'],
        'ㄿ': ['ㄹ', 'ㅍ'],
        'ㅀ': ['ㄹ', 'ㅎ'],
        'ㅄ': ['ㅂ', 'ㅅ']
    }

    medial = medials[medial_index]
    medial_split = compound_medials.get(medial, [medial])  # Split compound medials
    final = finals[final_index]
    final_split = compound_finals.get(final, [final]) if final else []

    # Return a flat list of initial, split medial, and split final components
    return [initials[initial_index]] + medial_split + final_split

def split_hangul(text):
    """Split Hangul text into a flat list of all jamo, with detailed medial and final splitting."""
    result = []
    for char in text:
        if 0xAC00 <= ord(char) <= 0xD7A3:
            result.extend(decompose_hangul(char))
        else:
            result.append(char)  # Non-Hangul characters are added directly
    return result

for i in range(len(raw)):
    convert = raw[i].replace(" ", "")
    if convert[0].isdigit():
        match = re.match(r'^\d+', convert)
        number = match.group()
        convert = convert.replace(number, korean_numbers[number])
    for j in nonkr:
        if j in convert:
            convert = convert[:convert.index(j)]
    flag = 0
    for j in numbers:
        if j in convert:
            flag = 1
    if convert not in korean and flag == 0:
        korean.append(convert)
        jamo_list = split_hangul(convert)
        flag = 0
        pops = []
        for j in range(len(jamo_list)):
            if jamo_list[j] not in hangul:
                pops.append(j)
        for j in range(len(pops) - 1, 0, -1):
            jamo_list.pop(pops[j])
        if flag == 0:
            korean_syll += jamo_list

with open('dictionaries/kr-ken.json', 'w', encoding='utf-8') as json_file:
    json.dump(korean, json_file, ensure_ascii=False, separators=(',', ':'))

with open('dictionaries/kr-jamo.json', 'w', encoding='utf-8') as json_file:
    json.dump(korean_syll, json_file, ensure_ascii=False, separators=(',', ':'))'''


# Optional: Detect encoding
'''import chardet

with open("arab.txt", "rb") as f:
    raw_data = f.read()

encoding_info = chardet.detect(raw_data)
encoding = encoding_info['encoding']

print("Detected Encoding:", encoding)
'''

# General txt to json
'''
import json

words = []
with open('arab.txt', 'r') as file:
    line = file.readline()
    while line != "":
        words.append(line[:-1])
        line = file.readline()

with open('dictionaries/ab-git.json', 'w', encoding='utf-8') as json_file:
    json.dump(words, json_file, ensure_ascii=False, separators=(',', ':'))'''

# Hindi Dictionary CSV to JSON
import pandas
import json
import re

df = pandas.read_csv("hindi.csv")
second_column = df.iloc[:, 1]
raw = list(second_column)
new_list = []
for i in range(len(raw)):
    convert = re.sub(r"[a-zA-Z]", "", raw[i])
    convert = re.sub(r"[(){}#*^<>;&:?!.०१२३४५६७८९]", "", convert)
    convert = re.sub(r"[1234567890]", "", convert)
    convert = convert.replace(',', " ")
    convert = convert.replace(':', " ")
    convert = convert.replace(']', " ")
    convert = convert.replace('[', " ")
    convert = convert.replace('/', " ")
    convert = convert.replace("\n", " ")
    convert = convert.replace('\\n', ' ')
    convert = convert.replace('"', '')
    convert_list = convert.split(" ")
    for j in range(len(convert_list)):
        new_list.append(convert_list[j])
with open('dictionaries/hi-git.json', 'w', encoding='utf-8') as json_file:
    json.dump(new_list, json_file, ensure_ascii=False, separators=(',', ':'))