if (typeof Widgets === 'undefined') {
    Widgets = {};
}

(function () {

    var _datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";

    this.Table = function () {

        //private fields
        var _dataTypes = {
            TEXT: {
                toString: function (value) {
                    return value;
                },
                parse: function (string) {
                    return string;
                }
            },
            NUMBER: {
                toString: function (value) {
                    return value;
                },
                parse: function (string) {
                    return string;
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
            UNSORTED: {
                getNextSortState: function () { return _sortStates.ASCENDING; },
                sortFunction: null
            },
            ASCENDING: {
                getNextSortState: function () { return _sortStates.DESCENDING; },
                sortFunction: function (a, b) { return a - b; }
            },
            DESCENDING: {
                getNextSortState: function () { return _sortStates.UNSORTED; },
                sortFunction: function (a, b) { return b - a; }
            }
        };
        var _columnHeader = function (name, id) {//TODO: need to be renamed as Column and probably made public.
            this.columnName = name;
            this.id = id;//TODO: figure out is there is a way to access an index to parent array and use it instead of is property
            this.dataType = _dataTypes.TEXT;
            this.currentSortState = _sortStates.UNSORTED;
            this.getSortFunction = function () {
                var sortFunction,
                    sortStateSortFunction,
                    nextSortState;
                // change sort state for next if there is one
                nextSortState = this.currentSortState.getNextSortState();
                if (nextSortState !== null) {
                    this.currentSortState = nextSortState;
                }
                sortStateSortFunction = this.currentSortState.sortFunction;
                // for UNSORTED state of error case
                if (sortStateSortFunction === null) {
                    // set sort by row ID
                    sortFunction = function (a, b) { return a[0] - b[0]; };
                }
                else {
                    var index = this.id;
                    sortFunction = function (a, b) { return sortStateSortFunction(a[index], b[index]); };
                }
                return sortFunction;
            };
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
        this.head = [];//need to be renamed as this.columns = [];
        this.rows = [[]];

        //public methods
        this.populate = function (dataArray) {
            _validateInputArray(dataArray);
            this.clear();
            this.rows = new Array(dataArray.length);
            for (var i = 0; i < (this.rows.length - 1) ; i++) {
                this.rows[i] = new Array((dataArray[0].length + 1));
            }

            //adding an ID column
            for (var idRow = 0; idRow < dataArray.length; idRow++) {
                if (idRow === 0) {
                    this.head.push(new _columnHeader("ID", 0));
                    this.head[0].dataType = _dataTypes.NUMBER;
                }
                else {
                    this.rows[idRow - 1][0] = idRow - 1;
                }
            }

            // populating columns
            // ATTENTION: row&column numeration in the following loop refer to the Table rows and columns, not the dataArray ones.
            // for dataArray column = columnNumber - 1, row = rowNumber + 1
            for (var columnNumber = 1; columnNumber <= dataArray[0].length; columnNumber++) {
                // adding column header
                this.head.push(new _columnHeader(dataArray[0][columnNumber - 1], columnNumber));

                // defining column data type
                for (var rowNumber = 0; rowNumber < dataArray.length - 1; rowNumber++) {
                    if (rowNumber === 0) {
                        this.head[columnNumber].dataType = _getDataType(dataArray[rowNumber + 1][columnNumber - 1]);
                    }
                    else {
                        if (this.head[columnNumber].dataType !== _dataTypes.TEXT) {
                            var cellDataType = _getDataType(dataArray[rowNumber + 1][columnNumber - 1]);
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
                for (rowNumber = 0; rowNumber < dataArray.length - 1; rowNumber++) {
                    var value = dataArray[rowNumber + 1][columnNumber - 1];
                    var parsedValue = this.head[columnNumber].dataType.parse(value);
                    this.rows[rowNumber][columnNumber] = parsedValue;
                }
            }
        };
        this.clear = function () {
            this.head = [];
            this.rows = [[]];
        };
        this.sort = function (columnNumber) {
            //get sort function first
            var sortFunction = this.head[columnNumber].getSortFunction();
            for (col in this.head) {
                if (col !== columnNumber) {
                    this.head[col].sortState = _sortStates.UNSORTED;
                }
            }
            this.rows.sort(sortFunction);
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
    };


}).call(Widgets);