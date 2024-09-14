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

# Create jp.json
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

with open('new.json', 'w', encoding='utf-8') as json_file:
    # Write the dictionary to the JSON file in a single line
    json.dump(new, json_file, ensure_ascii=False, separators=(',', ':'))'''