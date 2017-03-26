if (typeof CSVParser === 'undefined') {
    CSVParser = {};
}    

(function () {

    //var _patternBeforeNonQuoted = "(?<=^|\,)";//TODO: need to fix lookbehind
    //var _patternBeforeQuoted = "(?<=(?<=^|\,)\")";//TODO: need to fix lookbehind
    //var _patternAfterNonQuoted = "(?=\,|$)";
    //var _pattenrAfterQuoted = "(?=\"{1}(?=\,|$))";
    //var _patternNonQuoted = "(?:[^\,\"\r\n])*";
    //var _patternQuoted = "(?:[^\"]|\"(?!(\,|$)))*";
    //var _patternNonQuotedComplete = _patternBeforeNonQuoted + _patternNonQuoted + _pattenrAfterNonQuoted;
    //var _patternQuotedComplete = _patternBeforeQuoted + _patternQuoted + _pattenrAfterQuoted;
    //var _patternComplete = "(" + _patternNonQuotedComplete + "|" + _patternQuotedComplete + ")";

    
    this.parse = function (string) {

        //for ie compatibility should replace '\r\n' to '\n' in the input string first

        var checkStartPosition = 0,
            quotesFlag = false,
            resArray = [new Array()],
            resArrayRowsCounter = 0;

        for (var i = 0; i < string.length; i++) {

            if (string[i] === '"') {
                if (quotesFlag == false) {
                    if (i === 0 || string[i - 1] == ',' || string[i - 1] == '\n') {
                        quotesFlag = true;
                        checkStartPosition = i + 1;
                    }
                    else {
                        throw new Error("A symbol \'" + string[i] + "\' detected inside the value without being quoted.");
                    }
                }
                else {
                    if (string[i + 1] == ',' || string[i + 1] == '\n' || i === string.length - 1) {
                        resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                        checkStartPosition = i + 1;
                        quotesFlag = false;
                    }
                    else {
                        continue;
                    }
                }
            }
            else if (string[i] === ',' && quotesFlag !== true) {
                if (i === 0) {
                    resArray[resArrayRowsCounter].push("");
                }
                else if (string[i - 1] !== '"') {
                    resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                    if (i === string.length - 1 || string[i + 1] === '\n') {
                        resArray[resArrayRowsCounter].push("");
                    }
                }
                checkStartPosition = i + 1;
            }
            else if (string[i] === '\n' && quotesFlag !== true && i !== string.length - 1) {
                if (i !== 0) {
                    resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                }
                checkStartPosition = i + 1;
                resArray.push(new Array());
                resArrayRowsCounter += 1;
            }

            if (i === string.length - 1) {
                if (quotesFlag === true) {
                    throw new Error("Unclosed quotes detected.");
                }
                resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i + 1));
            }
        }

        return resArray;
    };

}).call(CSVParser);