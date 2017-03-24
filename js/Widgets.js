if (typeof Widgets === 'undefined') {
    Widgets = {};
}

(function () {
    
    var _datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";

    var _dataTypes = {
        TEXT: 0,
        NUMBERS: 1,
        DATE: 2
    };
    var _sortStates = {
        UNSORTED: 0,
        ASCENDING: 1,
        DESCENDING: 2
    };

    var ColumnHeader = function (name) {
        this.columnName = name;
        this.dataType = _dataTypes.TEXT;
        this.sortState = _sortStates.UNSORTED;
    };

    this.Table = function (dataArray) {
        var isCorrect = true;
        this.head = [];//all items should be objects with fields "data"(string) and "sortable"(bool)
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
            this.clear();
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
            _validate();
            for(colNum in this.head){
                _defineColumnDataType(columnNumber);
            }
        };
        var _validate = function () {
            //TODO
        };
        var _parseCell = function (cellValue) {
            if (isNaN(cellValue)) {
                if (new RegExp(datePattern).test(cellValue)) {
                    var date = Date.parse(cellValue);
                }
            }
            
        };
        var _defineColumnDataType = function(columnNumber){
            for (row in this.rows) {
                
            }
            //number
            
            //date in ISO format: YYYY-MM-DD

            //text

        }
        this.clear = function () {
            this.head = [];
            this.rows = [[]];
        }
        this.sort = function (columnNumber) {
            //TODO
        };

        if(dataArray !== null){
            this.populate(dataArray);
        }
    }

    
}).call(Widgets);