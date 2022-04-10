const processText = async (textString, correct_spelling = true) => {
  //TOKENIZE
  let words = tokenizeText(textString);
  //SPELLFIX

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