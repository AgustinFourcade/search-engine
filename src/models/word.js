const mongoose = require("mongoose");
const ProductWord = require("../models/product_word");
const ProductTaxon = require("../models/product_taxon");

const WordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
    },
    normalized_word: {
      type: String,
      required: true,
    },
    bgrams: {
      type: Array,
      required: true,
    },
    bgrams_length: {
      type: Number,
      required: true,
    },
    substance_value: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

WordSchema.statics.calculateSubstanceValue = async function (word) {
  const queryProductId = [
    { $match: { word } },
    {
      $group: {
        _id: { product_id: "$product_id" },
      },
    },
    {
      $project: {
        product_id: "$_id.product_id",
        _id: 0,
      },
    },
  ];
  const productIdList = (
    await ProductWord.aggregate(queryProductId).exec()
  ).map((product) => product.product_id);

  const queryProductTaxon = [
    {
      $match: {
        taxonomy_name: "Categories",
        level: 0,
        product_id: { $in: productIdList },
      },
    },
    {
      $group: {
        _id: { taxon_id: "$taxon_id" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        count: 1,
      },
    },
  ];

  const count = (await ProductTaxon.aggregate(queryProductTaxon).exec()).map(
    (product) => product.count
  );
  const substanceValue = count / productIdList.length;
  return isNaN(substanceValue) ? 0 : substanceValue;
};

WordSchema.statics.saveWord = async function (term) {
  let bigrams = generateBigrams(term.originalTerm);
  let word = {
    word: cleanWord(term.originalTerm),
    normalized_word: term.normalizedOutput,
    bgrams: bigrams,
    bgrams_length: Object.keys(bigrams).length,
    substance_value: await this.calculateSubstanceValue(term.normalizedOutput),
  };
  await this.findOneAndUpdate({ word: word.word }, word, {
    upsert: true,
  });
};

const generateBigrams = (word) => {
  word = "_" + cleanWord(word) + "_";
  var bigrams = [];
  for (var i = 0; i < word.length - 1; i++) {
    var token = word.substring(i, i + 2);
    bigrams.push(token);
  }
  const bigramsArr = new Set(bigrams);
  bigrams = [...bigramsArr];
  return bigrams;
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

WordSchema.statics.spelling = async function (text) {
  const bgrams = generateBigrams(text);
  return (
    await this.aggregate([
      { $match: { bgrams: { $in: bgrams } } },
      { $unwind: "$bgrams" },
      { $match: { bgrams: { $in: bgrams } } },
      {
        $group: {
          _id: "$word",
          count: { $sum: 1 },
          bgrams_length: { $first: "$bgrams_length" },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          bgrams_length: 1,
          multiplier: { $multiply: ["$count", 2] },
          divisor: { $sum: ["$bgrams_length", bgrams.length] },
        },
      },
      {
        $project: {
          word: "$_id",
          count: 1,
          bgrams_length: 1,
          multiplier: 1,
          divisor: 1,
          score: { $divide: ["$multiplier", "$divisor"] },
        },
      },
      { $match: { score: { $gte: 0.6 } } },
      { $sort: { score: -1 } },
      { $limit: 1 },
    ]).exec()
  )[0];
};

module.exports = mongoose.model("Word", WordSchema);
