#!/usr/bin/env node

//Helpers
var path = require('path');
var marked = require('marked');
var Proofreader = require('../lib/proofreader.js');


const config = {
  "dictionaries": {
    "build-in": ["en_US"],
    "custom": []
  },
  "selectors": {
    "whitelist": "p, li, h1, h2, h3, h4, th, td, dl, figcaption",
    "blacklist": "pre, code"
  }
};


const testInput = "\n\
Content (the title, author, and date are automatically included)\n\
\n\
\n\
## Lists\n\
\n\
Unordered\n\
\n\
+ Create a list by starting a line with `+`, `-`, or `*`\n\
+ Sub-lists are made by indenting 2 spaces:\n\
  - Marker character change forces new list start:\n\
    * Ac tristique libero volutpat at\n\
    + Facilisis in pretium nisl aliquet\n\
    - Nulla volutpat aliquam velit\n\
+ Very easy!\n\
\n\
Ordered\n\
\n\
1. Lorem ipsum dolor sit amet\n\
2. Consectetur adipiscing elit\n\
3. Integer molestie lorem at massa";


var proofreader = new Proofreader();

proofreader.setWhitelist(config.selectors.whitelist);
proofreader.setBlacklist(config.selectors.blacklist);
proofreader.setWriteGoodSettings(config['write-good']);

config.dictionaries['build-in'].forEach(function (dictName) {
  proofreader.addDictionary(path.join(__dirname, '../dictionaries/' + dictName + '.dic'),
    path.join(__dirname, '../dictionaries/' + dictName + '.aff'));
});

function printResults(results) {
  results.forEach(function (result) {
    var writeGood = result.suggestions.writeGood;
    var spelling = result.suggestions.spelling;

    //Printing output
    if (writeGood.length || spelling.length) {
      console.log(result.text);

      writeGood.forEach(function (item) {
        console.log(' - ' + item.reason);
      });

      spelling.forEach(function (item) {
        console.log(' - "' + item.word + '" -> ' + item.suggestions);
      });

      console.log();
    }
  });
}

proofreader.proofread(marked(testInput))
  .then(function (result) {
    printResults(result);
    return result;
  })
  .catch(function (error) {
    console.error('Proofreading failed', error);
  });
