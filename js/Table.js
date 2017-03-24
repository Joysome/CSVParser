if (typeof Table === 'undefined') {
    Table = {};
}

(function () {
    var isCorrect = true;
    this.head = [];
    this.rows = [[]];

    this.getHTMLMarkup = function (tableClasses, errorClasses) {
        //TODO: data checks here 
        //all classes names should be valid strings
        this.validate();//???
        
        if (this.isCorrect) {
            var html = '<table class="' + tableClasses + '">';
            html += '<thead>';
            html += '<tr>';
            for (columnHeader in this.head) {
                html += '<th>';
                html += this.head[columnHeader];
                html += '</th>';
            }
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (row in this.rows) {
                html += '<tr>';
                for (cell in this.rows[row]) {
                    html += '<td>';
                    html += this.rows[row][cell];
                    html += '</td>';
                }
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
        }
        else {
            html = '<p class="' + errorClasses + '"> Incorrect data </p>';
        }
        return html;
    };
    this.populate = function (dataArray) {
        for (var rowNumber = 0; rowNumber < dataArray.length; rowNumber++) {
            if (rowNumber === 0) {
                this.columnNames = dataArray[rowNumber];
            }
            else {
                //todo: here will be some logic for defining row type
                if (dataArray[rowNumber].length === this.head.length) {
                    this.rows.push(dataArray[rowNumber]);
                }
                else {
                    this.isCorrect = false;
                    break;
                }
            }
        }
    };
    var _validate = function () {
        //TODO
    };
    this.sort = function (columnNumber) {
        //TODO
    };
}).call(Table);