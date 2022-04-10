const { processText } = require("../helpers/normalization_helper");
const Word = require("../models/word");

const performSearch = async (params) => {
  const response = {};
  params.text = params.text ? params.text.trim() : null;

  //EXTRACT SEARCH TERMS
  const words = params.text ? await processText(params.text) : null;

  response.isSpellfixed = words
    ? words.some((word) => word.isSpellfixed)
    : false;

  //COLLECT PRODUCTS
  const arrayCombinatorialWords = [];

  if (words) {
    await combinatorialArrayWords(words, arrayCombinatorialWords);
  }

  const textSearch =
    words && (await performTextSearch(arrayCombinatorialWords));

  //SEARCHS INTERSECTION
  let data = [textSearch];
  data = data.filter((e) => e);
  if (data.length > 0) {
    response.all_product_ids = data
      .reduce((a, b) => a.filter((c) => b.includes(c)))
      .filter((id) => excluded_ids.indexOf(id) == -1);
  } else {
    response.all_product_ids = [];
  }

  return response;
};

const performTextSearch = async (combinatorialWords, i = 0, results = []) => {
  const texts = combinatorialWords[i].map((word) =>
    word.innerTerms.map((term) => term.normalizedOutput)
  );

  const query = [
    { $match: { word: { $in: texts.flat() } } },
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 },
        words: { $addToSet: "$word" },
      },
    },
    {
      $match: {
        $and: texts.map((e) => ({
          words: { $in: e },
        })),
      },
    },
    { $project: { product_id: 1, count: 1, words: 1 } },
  ];

  const newResults = (await ProductWord.aggregate(query).exec()).map(
    (product) => product._id
  );

  results = [...newResults, ...results];

  if (combinatorialWords.length === i + 1) {
    return results;
  }
  i = i + 1;
  return performTextSearch(combinatorialWords, i, results);
};

const combinatorialArrayWords = async (words, arrayResult) => {
  for (let i = 0; i < words.length; i++) {
    const arrayCombinaciones = [];
    const n = words.length - i;
    combinatorial(words, n, arrayCombinaciones);

    for (let i2 = 0; i2 < arrayCombinaciones.length; i2++) {
      const element = arrayCombinaciones[i2];
      element.sort((a, b) => {
        return a.originalWord < b.originalWord
          ? -1
          : a.originalWord > b.originalWord
          ? 1
          : 0;
      });
    }

    const unicos = [];
    for (let i2 = 0; i2 < arrayCombinaciones.length; i2++) {
      const conjunctWords = arrayCombinaciones[i2];
      let duplicate = false;
      for (let compare of unicos) {
        if (JSON.stringify(conjunctWords) === JSON.stringify(compare)) {
          duplicate = true;
        }
      }
      if (!duplicate) {
        unicos.push(conjunctWords);
      }
    }
    await substanceValueOrder(unicos);
    for (let element of unicos) {
      delete element.substance_value;
      arrayResult.push(element);
    }
  }
};

const combinatorial = (arrayWords, n, results, result) => {
  if (!result) {
    result = [];
  }
  for (let i = 0; i < arrayWords.length; ++i) {
    const newResult = result.slice();
    const newArrayWords = arrayWords.slice();
    newResult.push(arrayWords[i]);
    newArrayWords.splice(i, 1);
    if (n > 1) {
      combinatorial(newArrayWords, n - 1, results, newResult);
    } else {
      results.push(newResult);
    }
  }
};

const substanceValueOrder = async (arrayWords) => {
  for (let i = 0; i < arrayWords.length; i++) {
    const words = arrayWords[i];
    words.substance_value = 0;
    for (let index = 0; index < words.length; index++) {
      const word = words[index];
      const result = await Word.findOne({
        word: word.newWord,
      });
      if (result) {
        if (result.substance_value) {
          words.substance_value =
            words.substance_value + result.substance_value;
        }
      }
    }
  }
  arrayWords.sort((a, b) => {
    return a.substance_value > b.substance_value
      ? -1
      : a.substance_value < b.substance_value
      ? 1
      : 0;
  });
};

module.exports = {
  performSearch,
  performTextSearch,
  combinatorialArrayWords,
};
