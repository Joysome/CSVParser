if (typeof CSVParser === 'undefined') {
    CSVParser = {};
}    

//begin private closure
(function () {

    var _patternBeforeNonQuoted = "(?<=^|\,)";
    var _patternBeforeQuoted = "(?<=(?<=^|\,)\")";
    var _patternAfterNonQuoted = "(?=\,|$)";
    var _pattenrAfterQuoted = "(?=\"{1}(?=\,|$))";
    var _patternNonQuoted = "(?:[^\,\"\r\n])*";
    var _patternQuoted = "(?:[^\"]|\"(?!(\,|$)))*";
    var _patternComplete = "((?<=(?<=^|\,)\")(?:[^\"]|\"(?!(\,|$)))*(?=\"{1}(?=\,|$))|((?<=^|\,)(?:[^\,\"\r\n])*(?=\,|$)))";

    //This function should return a [[]] array or null for error
    this.parse = function (string) {
        var res;
        var pattern = _patternComplete;
        var regex = new RegExp(pattern, "g");

        while ((res = regex.exec(string)) !== null) {
            //infinite loop fix
            if (res.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            alert("Найдено " + res + " at index "
            + res.index + ".\nNext symbol index: " + pattern.lastIndex);//test
        };
    };

}).call(CSVParser);