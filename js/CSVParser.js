var CSVParser = {
    //TODO: make a right architecture here

}
//test
var getAll = function (string) {
    var t = new Table(string);
    return getHTMLTable(t);
}
//endtest
//НЕ СТРОИТЬ ВЕСЬ ПАРСЕР ВОКРУГ ТЕЙБЛА. JS - не ООП-язык, тут не нужна объекты. Надо разбить функциональность на именно функции, а тейбл сделать просто такой себе view-model.



function getHTMLTable(table) {
    if (table.isCorrect) {
       var html = '<table class="table table-hover">';
       html += '<thead>';
       html += '<tr>';
        for (header in table.columnNames) {
           html+= '<th>';
           html += table.columnNames[header];
           html+= '</th>';
        }
       html += '</tr>';
       html += '</thead>';
       html += '<tbody>';
        for (row in table.rows) {
           html += '<tr>';
           for (cell in table.rows[row]) {
               html += '<td>';
               html += table.rows[row][cell];
               html += '</td>';
            }
           html += '</tr>';
        }
       html += '</tbody>';
       html += '</table>';
    }
    else {
        html += "<p> Incorrect CSV data </p>";
    }
    return html;
}
//function getHTMLTable(table) {
//    if (table.isCorrect) {
//        var html = '<table class="table table-hover">';
//        html += '<thead>';
//        html += '<tr>';
//        html += '<th>';
//        html += table.columnNames.join("</th><th>")
//        html += '</th>';
//        html += '</tr>';
//        html += '</thead>';
//        html += '<tbody>';
//        for (row in table.rows) {
//            html += '<tr>';
//            html += '<td>';
//            html += table.rows[row].join("</td><td>");
//            html += '</td>';
//            html += '</tr>';
//        }
//        html += '</tbody>';
//        html += '</table>';
//    }
//    else {
//        html += "<p> Incorrect CSV data </p>";
//    }
//    return html;
//}

var Table = function (data) {
    this.isCorrect = true;
    //TODO: input data checks here
    this.columnNames;//TODO: rename this
    this.rows = [[]];
    this.parseString = function (string) {
        var patternBeforeElem = "((?<=^)|(?<=\,))+";
        var pattenrAfterElem = "((?=\,)|(?=$))+";
        var patternNonQuoted = + "(?:[^\,\"$])*";
        var patternDoubleQuoted = "\"+(?:[\s\S]|\"(?!\,)|(?<!\")\,)*\"+";
        var patternComplete = "((?<=^)|(?<=\,))+(\"+(?:[\s\S]|\"(?!\,)|(?<!\")\,)*\"+)|((?:[^\,\"$])*)((?=\,)|(?=$))+";
        var pattern = new RegExp(patternComplete, "g");
        var res = string.match(pattern);
        return res;
    }
    this.parseTable = function (strings) {
        for (var row = 0; row < strings.length; row++) {
            var cells = this.parseString(strings[row]);
            if (row === 0) {
                this.columnNames = cells;
            }
            else {
                if (cells.length === this.columnNames.length) {
                    this.rows.push(cells);
                } else {
                    this.isCorrect = false;
                    break;
                }
            }
        }
    }
    this.parseTable(data.match(/[^\r?\n]+/g));

    
}



function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}