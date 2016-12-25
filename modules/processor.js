"use strict";

let readline = require('readline'),
    fs = require('fs'),
    fileName = 'dictionary.txt',
    utterances = [];

const rl = readline.createInterface({
    input: fs.createReadStream(fileName)
});

rl.on('line', (line) => {
    var index = line.indexOf(' ');
    if (index>0) {
        var handler = line.substring(0, index);
        var utterance = line.substring(index + 1);
        utterances.push({utterance: utterance, handler:handler});
    }
});

rl.on('close', () => {
    console.log('end of file');
});

let match = text => {
    for (var i=0; i<utterances.length; i++) {
        var match = text.match(new RegExp(utterances[i].utterance, 'i'));
        if (match) {
            var handler = utterances[i].handler;
            return {handler, match};
        }
    }
    console.log('no match');
};

exports.match = match;
