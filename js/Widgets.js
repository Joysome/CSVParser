if (typeof Widgets === 'undefined') {
    Widgets = {};
}

(function () {
    
    var _datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";

    this.Table = function (dataArray) {

        //private fields
        var _dataTypes = {
            TEXT: {
                toString: function (value) {
                    return value;
                },
                parse: function (string) {
                    return string;//no need to parse
                }
            },
            NUMBER: {
                toString: function (value) {
                    return value;
                },
                parse: function (string) {
                    return string;//no need to parse
                }
            },
            DATE: {
                toString: function (value) {
                    var outputString = value.toDateString();
                    return outputString;
                },
                parse: function (string) {
                    return new Date(string);
                }
            }
        };
        var _sortStates = {
            UNSORTED: 0,
            ASCENDING: 1,
            DESCENDING: 2
        };
        var _columnHeader = function (name) {
            this.columnName = name;
            this.dataType = _dataTypes.TEXT;
            this.sortState = _sortStates.UNSORTED;
        };

        //private functions
        var _getDataType = function (value) {
            if (isNaN(value)) {
                if (new RegExp(_datePattern).test(value)) {
                    return _dataTypes.DATE;
                } else {
                    return _dataTypes.TEXT;
                }
            } else {
                return _dataTypes.NUMBER;
            }
        };
        var _validateInputArray = function (inputArray) {
            //TODO: more data checks here
            //TODO: different error types for different catch blocks
            if (inputArray === null) {
                throw new Error("Data array for populating table shouldn't be null.");
            }
            if (inputArray.length <= 2) {
                throw new Error("Table should contain a header and at least one row.");
            }
            var colCount = inputArray[0].length;
            for (row in inputArray) {
                if (inputArray[row].length !== colCount) {
                    throw new Error("Data array should contain same number of cells in each row");
                }
            }
        };

        //public properties
        this.head = [];
        this.columns = [[]];
        this.rows = [[]];

        //public methods
        this.populate = function (dataArray) {
            _validateInputArray(dataArray);
            this.clear();
            this.rows = new Array(dataArray.length);
            for (var i = 0; i < this.rows.length; i++) { // В таблице 10 строк
                this.rows[i] = new Array(dataArray[0].length);            // В каждой строке 10 столбцов
            }

            for (var columnNumber = 0; columnNumber < dataArray[0].length/*this.head.length*/; columnNumber++) {

                //setting column header
                this.head.push(new _columnHeader(dataArray[0][columnNumber]));

                //defining columns data type
                for (var rowNumber = 1; rowNumber < dataArray.length; rowNumber++) {
                    if (rowNumber === 1) {
                        this.head[columnNumber].dataType = _getDataType(dataArray[rowNumber][columnNumber]);
                    }
                    else {
                        if (this.head[columnNumber].dataType !== _dataTypes.TEXT) {
                            var cellDataType = _getDataType(dataArray[rowNumber][columnNumber]);
                            if (cellDataType !== this.head[columnNumber].dataType) {
                                this.head[columnNumber].dataType === _dataTypes.TEXT;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }

                //populating column
                for (rowNumber = 1; rowNumber < dataArray.length; rowNumber++) {
                    var value = dataArray[rowNumber][columnNumber];
                    var parsedValue = this.head[columnNumber].dataType.parse(value);
                    this.rows[rowNumber - 1][columnNumber] = parsedValue;
                }
            }

        };
        this.clear = function () {
            this.head = [];
            this.rows = [[]];
        };
        this.sort = function (columnNumber) {
            //TODO
        };
        this.getHTMLMarkup = function (tableClasses) {
            //TODO: data checks here 
            //all classes names should be valid strings
            //TODO: as there are multiple data types now, should be a check for column date type
            //this.validate();//???

            var html = '<table class="' + tableClasses + '">';
            html += '<thead>';
            html += '<tr>';
            for (columnHeader in this.head) {
                html += '<th>';
                html += this.head[columnHeader].columnName;
                html += '</th>';
            }
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (row in this.rows) {
                html += '<tr>';
                for (cell in this.rows[row]) {
                    html += '<td>';
                    var outputString = this.head[cell].dataType
                        .toString(this.rows[row][cell]);
                    html += outputString;
                    html += '</td>';
                }
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            return html;
        };

        this.populate(dataArray);
    };

    
}).call(Widgets);