// const MD5 = require("crypto-js/md5");
const { processText } = require("../helpers/normalization_helper");
const ProductWord = require("../models/product_word");
const ProductViews = require("../models/product_view");
const Word = require("../models/word");

const indexProducts = async (products = []) => {
  await ProductWord.remove({});
  await ProductViews.remove({});
  await Word.remove({});

  const success = [];
  for (let product of products) {
    // PROCESS TEXTS
    for (const text of product.texts) {
      const words = text ? await processText(text, false) : [];
      for (const word of words) {
        for (const term of word.innerTerms) {
          if (term.normalizedOutput) {
            let object = {
              product_id: product.id,
              word: term.normalizedOutput,
            };
            await ProductWord.findOneAndUpdate(object, object, {
              upsert: true,
            });

            await Word.saveWord(term);
          }
        }
      }
    }

    //PROCESS TAXONS
    //PROCESS ATTRIBUTES
    //PROCESS MEASUREMENTS
    //NOVELTY MEASUREMENT
    //CUSTOM MEASUREMENTS
    //PRINT MEASUREMENTS
    //VIEW MEASUREMENTS
    //BUY MEASUREMENTS
    //CHECKSUM cont

    //PROCESS VIEWS
    for (const view of product.views) {
      let object = {
        product_id: product.id,
        name: view.name,
        content: view.content,
      };
      await ProductViews.findOneAndUpdate(
        {
          product_id: product.id,
          name: view.name,
        },
        object,
        { upsert: true }
      );
    }

    success.push(product);
  }

  return { success };
};

module.exports = { indexProducts };
