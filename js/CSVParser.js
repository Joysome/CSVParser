if (typeof CSVParser === 'undefined') {
    CSVParser = {};
}    

//begin private closure
(function () {

    var _patternBeforeElem = "((?<=^)|(?<=\,)){1}";
    var _pattenrAfterElem = "((?=\,)|(?=$)){1}";
    var _patternNonQuoted = "(?:[^\,\"$])*";
    var _patternDoubleQuoted = "\"+(?:[\s\S]|\"(?!\,)|(?<!\")\,)*\"+";
    var _patternComplete = "((?<=^)|(?<=\,))+(\"+(?:[\s\S]|\"(?!\,)|(?<!\")\,)*\"+)|((?:[^\,\"$])*)((?=\,)|(?=$))+";

    //This function should return a [[]] array or null for error
    this.parse = function (string) {

    };

}).call(CSVParser);