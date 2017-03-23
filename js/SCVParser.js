var CSVParser = {
    //TODO: make a right architecture here

}
//test
var getAll = function (string) {
    var t = new Table(string);
    return getHTMLTable(t);
}
//endtest




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

var Table = function (data) {
    this.isCorrect = true;
    //TODO: input data checks here
    this.columnNames;//TODO: rename this
    this.rows = [[]];//data.split(/\r?\n|\r/);
    this.parseString = function (string) {
        //CSVToArray(string, ",");//test
        return string.split(',');//test
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
    this.parseTable(data.match(/[^\r\n]+/g));

    
}
