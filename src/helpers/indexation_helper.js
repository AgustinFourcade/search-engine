const { processText, cleanWord } = require("../helpers/normalization_helper");
const ProductWord = require("../models/product_word");
const ProductViews = require("../models/product_view");
const Word = require("../models/word");

const indexProducts = async (products = []) => {
  const response = [];
  for (let product of products) {
    // PROCESS TEXTS
    for (const text of product.texts) {
      const words = text ? await processText(text, false) : [];
      for (const word of words) {
        for (const term of word.innerTerms) {
          if (term.normalizedOutput) {
            let object = {
              product_id: product.id,
              word: cleanWord(term.normalizedOutput),
            };
            await ProductWord.findOneAndUpdate(object, object, {
              upsert: true,
            });

            await Word.saveWord(term);
          }
        }
      }
    }
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

    response.push(product);
  }

  return { response };
};

module.exports = { indexProducts };
