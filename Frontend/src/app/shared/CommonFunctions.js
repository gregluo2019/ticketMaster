let jsscompress = require("js-string-compression");
let Hauffman = new jsscompress.Hauffman();

export default {
    shuffleArray(array) {
        // Create a copy of the original array to be randomized
        let shuffle = [...array];

        // Defining function returning random value from i to N
        const getRandomValue = (i, N) => Math.floor(Math.random() * (N - i) + i);

        // Shuffle a pair of two elements at random position j
        shuffle.forEach(
            (elem, i, arr, j = getRandomValue(i, arr.length)) =>
                ([arr[i], arr[j]] = [arr[j], arr[i]])
        );

        return shuffle;
    },

    mysqlEscapeString(str) {
        if (typeof str != 'string')
            return str;

        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
            }
        });
    },

    // LZW-compress a string.  From https://stackoverflow.com/questions/294297/javascript-implementation-of-gzip
    CompressString(s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    },

    // Decompress an LZW-encoded string
    DecompressString(s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    },

    CompressStringWithHauffman(text) {
        return Hauffman.compress(text + "GGRREEGG")
    },
    DecompressStringWithHauffman(text) {
        try {
            let result = Hauffman.decompress(text)
            let endIndex = result.indexOf("GGRREEGG");
            return result.slice(0, endIndex);
        } catch {
            return text;
        }
    }
};
