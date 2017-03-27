
var module = angular.module("csvServices", []);
module.provider("csvParserService", function () {

    var itemsDelimiterChar = ',';
    var newLineChar = '\n';
    var qChar = '"';

    return {
        setDelimiter: function (value) {
            if (angular.isDefined(value)) {
                itemsDelimiterChar = value;
                return this;
            }
            else {
                return itemsDelimiterChar;
            }
        },
        setNewLine: function (value) {
            if (angular.isDefined(value)) {
                newLineChar = value;
                return this;
            }
            else {
                return newLineChar;
            }
        },
        setQuote: function (value) {
            if (angular.isDefined(value)) {
                qChar = value;
                return this;
            }
            else {
                return qChar;
            }
        },
        $get: function () {
            return {
                parse: function (string) {

                    string.replace(/\\r\\n/, this.newLineChar);

                    var checkStartPosition = 0,
                        quotesFlag = false,
                        resArray = [new Array()],
                        resArrayRowsCounter = 0;

                    for (var i = 0; i < string.length; i++) {

                        if (string[i] === qChar) {
                            if (quotesFlag == false) {
                                if (i === 0 || string[i - 1] == itemsDelimiterChar || string[i - 1] == newLineChar) {
                                    quotesFlag = true;
                                    checkStartPosition = i + 1;
                                }
                                else {
                                    throw new Error("A symbol \'" + string[i] + "\' detected inside the value without being quoted.");
                                }
                            }
                            else {
                                if (string[i + 1] == itemsDelimiterChar || string[i + 1] == newLineChar || i === string.length - 1) {
                                    resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                                    checkStartPosition = i + 1;
                                    quotesFlag = false;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                        else if (string[i] === itemsDelimiterChar && quotesFlag !== true) {
                            if (i === 0) {
                                resArray[resArrayRowsCounter].push("");
                            }
                            else if (string[i - 1] !== qChar) {
                                resArray[resArrayRowsCounter].push(string.slice(checkStartPosition, i));
                                if (i === string.length - 1 || string[i + 1] === newLineChar) {
                                    resArray[resArrayRowsCounter].push("");
                                }
                            }
                            checkStartPosition = i + 1;
                        }
                        else if (string[i] === newLineChar && quotesFlag !== true && i !== string.length - 1) {
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
                }
            };
        }
    }
});