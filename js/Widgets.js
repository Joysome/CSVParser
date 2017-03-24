if (typeof Widgets === 'undefined') {
    Widgets = {};
}

(function () {
    
    var _datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";

    var _dataTypes = {
        TEXT: {
            toString: function () {

            },
            parse: function (string) {
                return value;//no need to parse
            }
        },
        NUMBER: {
            toString: function () {

            },
            parse: function (string) {
                return value;//no need to parse
            }
        },
        DATE: {
            toString: function () {

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

    var ColumnHeader = function (name) {
        this.columnName = name;
        this.dataType = _dataTypes.TEXT;
        this.sortState = _sortStates.UNSORTED;
    };

    this.Table = function (dataArray) {
        //var isCorrect = true;//TODO: remove this
        this.head = [];//all items should be objects with fields "data"(string) and "sortable"(bool)
        this.columns = [[]];

        var _getDataType = function (value) {
            if (isNaN(value)) {
                if (new RegExp(datePattern).test(value)) {
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
            for (row in rows) {
                if(inputArray[row].length !== colCount){
                    throw new Error("Data array should contain same number of cells in each row");
                }
            }
        };

        

        this.getHTMLMarkup = function (tableClasses, errorClasses) {
            //TODO: data checks here 
            //all classes names should be valid strings
            //TODO: as there are multiple data types now, should be a check for column date type
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
            _validateInputArray(dataArray);
            this.clear();            

            for (var columnNumber = 0; columnNumber < this.head.length; columnNumber++) {

                //setting column header
                this.head.push(new ColumnHeader(dataArray[0][columnNumber]));

                //defining columns data type
                for (var rowNumber = 1; rowNumber < dataArray.length; rowNumber++) {
                    if (rowNumber === 1) {
                        this.head[columnNumber].dataType = _getDataType(dataArray[row][column]);
                    } 
                    else {
                        if (this.head[columnNumber].dataType !== _dataTypes.TEXT) {
                            var cellDataType = _getDataType(dataArray[row][column]);
                            if (cellDataType !== this.head[columnNumber].dataType) {
                                this.head[columnNumber].dataType == _dataTypes.TEXT;
                            }
                        }                        
                    }
                }
                //populating column
                for (var rowNumber = 1; rowNumber < dataArray.length; rowNumber++) {
                    var value = dataArray[rowNumber][columnNumber];
                    this.columns.push(value);
                    
                    
                }
                
                
            }
        };
        this.clear = function () {
            this.head = [];
            this.rows = [[]];
        }
        this.sort = function (columnNumber) {
            //TODO
        };

        this.populate(dataArray);
    }

    
}).call(Widgets);