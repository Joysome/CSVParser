if (typeof CSVParser === 'undefined') {
    CSVParser = {};
}    

//begin private closure
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

    //This function should return a [[]] array or null for error. It should be a facade for verifying and parsing actions.
    this.parse = function (string) {
        //var res;
        //var pattern = _patternComplete;
        //var regex = new RegExp(pattern, "g");
        //try{
        //    while ((res = regex.exec(string)) !== null) {
        //        //infinite loop fix
        //        if (res.index === regex.lastIndex) {
        //            regex.lastIndex++;
        //        }
        //        alert("Found " + res + " at index " + res.index +
        //        ".\nNext symbol index: " + pattern.lastIndex);//test
        //    };
        //}
        //catch (err) {
        //    return null;
        //}     

        //just a mock here for now
        var resArrayTest = [
            [
                "Text", "Numbers", "Date"
            ],
            [
                "ABText", 324, "2015-03-25"
            ],
            [
                "ACText", 186, "2010-08-02"
            ],
            [
                "SomeOtherText", 1829247, "2015-10-12"
            ]
        ]
        return resArrayTest;
    };

}).call(CSVParser);