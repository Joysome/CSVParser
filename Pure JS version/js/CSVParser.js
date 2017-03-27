if (typeof CSVParser === 'undefined') {
    CSVParser = {};
}    

(function () {

    this.itemsDelimiterChar;
    this.newLineChar;
    this.qChar;

    this.parse = function (string, delimiterChar, newLineChar, qchar) {
        switch (arguments.length) {
            case 1: this.itemsDelimiterChar = ',';
            case 2: this.newLineChar = '\n';
            case 3: this.qChar = '"';
            case 4: break;
            default: throw new Error('No csv string passed.')
        }

        string.replace(/\\r\\n/, this.newLineChar);

        var checkStartPosition = 0,
            quotesFlag = false,
            resArray = [new Array()],
            resArrayRowsCounter = 0;

        for (var i = 0; i < string.length; i++) {

            if (string[i] === this.qChar) {
                if (quotesFlag == false) {
                    if (i === 0 || string[i - 1] == this.itemsDelimiterChar || string[i - 1] == this.newLineChar) {
                        quotesFlag = true;
                        checkStartPosition = i + 1;
                    }
                    else {
                        throw new Error("A symbol \'" + string[i] + "\' detected inside the value without being quoted.");
                    }
                }
                else {
                    if (string[i + 1] == this.itemsDelimiterChar || string[i + 1] == this.newLineChar || i === string.length - 1) {
                        resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                        checkStartPosition = i + 1;
                        quotesFlag = false;
                    }
                    else {
                        continue;
                    }
                }
            }
            else if (string[i] === this.itemsDelimiterChar && quotesFlag !== true) {
                if (i === 0) {
                    resArray[resArrayRowsCounter].push("");
                }
                else if (string[i - 1] !== this.qChar) {
                    resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                    if (i === string.length - 1 || string[i + 1] === this.newLineChar) {
                        resArray[resArrayRowsCounter].push("");
                    }
                }
                checkStartPosition = i + 1;
            }
            else if (string[i] === this.newLineChar && quotesFlag !== true && i !== string.length - 1) {
                if (i !== 0) {
                    resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                }
                checkStartPosition = i + 1;
                resArray.push(new Array());
                resArrayRowsCounter += 1;
            }

            if (i === string.length - 1 && string[i] !== '"') {
                if (quotesFlag === true) {
                    throw new Error("Unclosed quotes detected.");
                }
                resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i + 1));
            }
        }

        return resArray;
    };

}).call(CSVParser);