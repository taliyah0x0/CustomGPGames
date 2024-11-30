alphabets = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  ["A", "Á", "B", "C", "D", "E", "É", "F", "G", "H", "I", "Í", "J", "K", "L", "M", "N", "Ñ", "O", "Ó", "P", "Q", "R", "S", "T", "U", "Ú", "Ü", "V", "W", "X", "Y", "Z", "´"],
  ["A", "À", "Â", "B", "C", "Ç", "D", "E", "É", "È", "Ê", "Ë", "F", "G", "H", "I", "Î", "Ï", "J", "K", "L", "M", "N", "O", "Ô", "Œ", "P", "Q", "R", "S", "T", "U", "Ù", "Û", "Ü", "V", "W", "X", "Y", "Z"],
  ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "っ"],
  ["ㄅ", "ㄆ", "ㄇ", "ㄈ", "ㄉ", "ㄊ", "ㄋ", "ㄌ", "ㄍ", "ㄎ", "ㄏ", "ㄐ", "ㄑ", "ㄒ", "ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ", "ㄚ", "ㄛ", "ㄜ", "ㄝ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄢ", "ㄣ", "ㄤ", "ㄥ", "ㄦ", "ㄧ", "ㄨ", "ㄩ", "ㄭ"],
]

sort_order = alphabets[4]
dictionary = 'md-sub.json'
#sort_order = [x.lower() for x in sort_order]

import json
from collections import Counter

def count_and_sort_frequencies_percentage(json_file_path, sort_order):
    # Load the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

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
    
    # Calculate total number of characters
    total_characters = sum(char_counts.values())
    
    # Calculate cumulative frequencies
    cumulative_frequencies = []
    cumulative_sum = 0
    for char in sort_order:
        frequency = (char_counts.get(char, 0) / total_characters) if total_characters > 0 else 0
        cumulative_sum += frequency
        cumulative_frequencies.append(cumulative_sum)
    
    return cumulative_frequencies

json_file_path = f'dictionaries/{dictionary}'
frequencies_percentage = count_and_sort_frequencies_percentage(json_file_path, sort_order)

print(frequencies_percentage)