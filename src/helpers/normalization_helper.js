const Word = require("../models/word");

const processText = async (textString, correct_spelling = true) => {
  //TOKENIZE
  let words = tokenizeText(textString);
  //SPELLFIX
  if (correct_spelling) {
    words = await Promise.all(
      words.map(async (word) => {
        const spellfix =
          word.cleanWord && (await Word.spelling(word.cleanWord));

        word.isSpellfixed = false;
        if (spellfix) {
          word.newWord = spellfix.word;
          word.innerTerms[0].originalTerm = word.newWord;
          word.innerTerms[0].normalizedOutput = word.newWord;
          word.isSpellfixed = spellfix.score != 1;
        }

        return word;
      })
    );
  }
  //SYNONYMS
  //NORMALIZE

  return words;
};

const tokenizeText = (textString) => {
  //{originalWord: '', innerTerms: [{originalTerm: '', newTerm: '', normalizedOutput: ''}]}
  const words = textString.split(" ").map((text) => ({
    originalWord: text,
    cleanWord: cleanWord(text),
    newWord: text,
    innerTerms: [
      {
        originalTerm: text,
        normalizedOutput: text,
      },
    ],
  }));
  return words;
};

const cleanWord = (word) => {
  //DOWNCASE
  word = word.toLowerCase();

  //DIACRITICS
  word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  //SPECIALCHARACTERS
  word = word.replace(/[^a-zA-Z0-9]/g, "");

  return word;
};

module.exports = { processText, cleanWord };
