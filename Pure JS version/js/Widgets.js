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
            },
            getDataTypeOf: function (value) {
                if (isNaN(value)) {
                    if (new RegExp(_datePattern).test(value)) {
                        return _dataTypes.DATE;
                    } else {
                        return _dataTypes.TEXT;
                    }
                } else {
                    return _dataTypes.NUMBER;
                }
            }
        };
        var _sortStates = {
            UNSORTED: {
                getNextSortState: function () { return _sortStates.DESCENDING; },
                sortFunction: null,
                sortClass: null
            },
            ASCENDING: {
                getNextSortState: function () { return _sortStates.UNSORTED; },
                sortFunction: function (a, b) { return a > b; },
                sortClass: "header-sort-ascending"
            },
            DESCENDING: {
                getNextSortState: function () { return _sortStates.ASCENDING; },
                sortFunction: function (a, b) { return b > a; },
                sortClass: "header-sort-descending"
            }
        };
        var _columnHeader = function (name, id) {//TODO: need to be renamed as Column and probably made public.
            this.columnName = name;
            this.dataType = _dataTypes.TEXT;
            this.currentSortState = _sortStates.UNSORTED;
            this.setNextSortState = function () {
                // change sort state for next if there is one
                nextSortState = this.currentSortState.getNextSortState();
                if (nextSortState !== null) {
                    this.currentSortState = nextSortState;
                }
            };
        };

        //private functions
        var _validateInputArray = function (inputArray) {
            if (inputArray === null) {
                throw new Error("Data array for populating table shouldn't be null.");
            }
            if (inputArray.length < 2) {
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
        this.columns = [];//need to be renamed as this.columns = [];
        this.rows = [[]];

        //public methods
        this.populate = function (dataArray) {
            _validateInputArray(dataArray);
            this.clear();
            this.rows = new Array(dataArray.length);
            for (var i = 0; i < (this.rows.length - 1); i++) {
                this.rows[i] = new Array((dataArray[0].length + 1));
            }

            //adding an ID column
            for (var idRow = 0; idRow < dataArray.length; idRow++) {
                if (idRow === 0) {
                    this.columns.push(new _columnHeader("ID"));
                    this.columns[0].dataType = _dataTypes.NUMBER;
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
                this.columns.push(new _columnHeader(dataArray[0][columnNumber - 1]));

                // defining column data type
                for (var rowNumber = 0; rowNumber < dataArray.length - 1; rowNumber++) {
                    if (rowNumber === 0) {
                        this.columns[columnNumber].dataType = _dataTypes.getDataTypeOf(dataArray[rowNumber + 1][columnNumber - 1]);
                    }
                    else {
                        if (this.columns[columnNumber].dataType !== _dataTypes.TEXT) {
                            var cellDataType = _dataTypes.getDataTypeOf(dataArray[rowNumber + 1][columnNumber - 1]);
                            if (cellDataType !== this.columns[columnNumber].dataType) {
                                this.columns[columnNumber].dataType === _dataTypes.TEXT;
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
                    var parsedValue = this.columns[columnNumber].dataType.parse(value);
                    this.rows[rowNumber][columnNumber] = parsedValue;
                }
            }
        };
        this.clear = function () {
            this.columns = [];
            this.rows = [[]];
        };
        this.sort = function (columnNumber) {
            // vars
            var sortFunction,
                    sortStateSortFunction,
                    nextSortState;
            
            // set next sort state
            this.columns[columnNumber].setNextSortState();

            // get exact sort function from sort state
            sortStateSortFunction = this.columns[columnNumber].currentSortState.sortFunction;

            // check for UNSORTED state or error case
            if (sortStateSortFunction === null) {
                // set sort by row ID (default)
                sortFunction = function (a, b) { return a[0] - b[0]; };
            }
            else {
                sortFunction = function (a, b) { return sortStateSortFunction(a[columnNumber], b[columnNumber]); };
            }

            this.rows.sort(sortFunction);

            for (var col = 0; col < this.columns.length; col++) {
                if (col !== columnNumber) {
                    this.columns[col].currentSortState = _sortStates.UNSORTED;
                }
            }
        };
        this.buildHTML = function (tableClasses) {
            //TODO: data checks here 
            //all classes names should be valid strings

            var html = '<table id="CSVTable" class="' + tableClasses + '">';
            html += '<thead>';
            html += '<tr>';
            for (columnHeader in this.columns) {
                html += '<th';
                var sortClass = this.columns[columnHeader].currentSortState.sortClass;
                if (sortClass !== null) {
                    html += ' class = "' + sortClass + '" ';
                }
                html += '>';
                html += this.columns[columnHeader].columnName;
                html += '</th>';
            }
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (row in this.rows) {
                html += '<tr>';
                for (cell in this.rows[row]) {
                    html += '<td>';
                    var outputString = this.columns[cell].dataType
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


    this.createWidget = function (type) {
        var _widget;

        switch (type) {
            case "Table":
                {
                    return new this.Table();
                }
            default:
                {
                    throw new Error("Invalid widget type.");
                }
        }
    };

}).call(Widgets);