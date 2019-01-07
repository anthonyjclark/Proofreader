#!/usr/bin/env node

var marked = require('marked');
var Proofreader = require('../lib/proofreader.js');

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

function formatResults(results) {

  let prettyOutput = '';

  results.forEach(function (result) {
    var writeGood = result.suggestions.writeGood;
    var spelling = result.suggestions.spelling;

    if (writeGood.length || spelling.length) {
      prettyOutput += result.text + '\n';

      writeGood.forEach(function (item) {
        prettyOutput += ' - ' + item.reason + '\n';
      });

      spelling.forEach(function (item) {
        prettyOutput += ' - "' + item.word + '" -> ' + item.suggestions + '\n';
      });

      prettyOutput += '\n';
    }
  });

  return prettyOutput;
}

proofreader.proofread(marked(testInput))
  .then(function (result) {
    console.log(formatResults(result));
    return result;
  })
  .catch(function (error) {
    console.error('Proofreading failed', error);
  });
