(function () {

    var controller = function ($scope) {

        //table
        var _datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";
        var _classPattern = "^([A-Za-z_][A-Za-z\d_-]*)+( [A-Za-z_][A-Za-z\d_-]*)*$";

        $scope.errorMessage = null;

        //private fields
        var _dataTypes = {
            TEXT: {
                toString: function (value) {
                    return value.replace("\n", "<br />");
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
        var _columnHeader = function (name, id) {
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
            if (inputArray === null || inputArray === undefined) {
                throw new Error("Data array for populating table shouldn't be null or undefined.");
            }
            else if (!angular.isArray(inputArray)) {
                throw new Error("An array needed to populate the table.");
            }
            else if (inputArray.length < 2) {
                throw new Error("Table should contain a header and at least one row.");
            }
            else {
                var colCount = inputArray[0].length;
                for (row in inputArray) {
                    if (inputArray[row].length !== colCount) {
                        throw new Error("Data array should contain same number of cells in each row");
                    }
                }
            }
        };
        var _validateCSSClassName = function (cssClassName) {
            if (cssClassName === undefined || !(new RegExp(_classPattern).test(cssClassName))) {
                throw new Error("Invalid table class name.");
            }
        }
        var _clear = function () {
            $scope.columns.length = 0;
            $scope.rows.length = 0;
        };

        //public properties
        $scope.columns = [];
        $scope.rows = [[]];

        //public methods
        $scope.populate = function (dataArray) {
            _clear();
            $scope.rows = new Array(dataArray.length);
            for (var i = 0; i < ($scope.rows.length - 1) ; i++) {
                $scope.rows[i] = new Array(dataArray[0].length + 1);
            }

            //adding an ID column
            for (var idRow = 0; idRow < dataArray.length; idRow++) {
                if (idRow === 0) {
                    $scope.columns.push(new _columnHeader("ID"));
                    $scope.columns[0].dataType = _dataTypes.NUMBER;
                }
                else {
                    $scope.rows[idRow - 1][0] = idRow - 1;
                }
            }

            // populating columns
            // ATTENTION: row&column numeration in the following loop refer to the Table rows and columns, not the dataArray ones.
            // for dataArray: column = columnNumber - 1, row = rowNumber + 1
            for (var columnNumber = 1; columnNumber <= dataArray[0].length; columnNumber++) {
                // adding column header
                $scope.columns.push(new _columnHeader(dataArray[0][columnNumber - 1]));

                // defining column data type
                for (var rowNumber = 0; rowNumber < dataArray.length - 1; rowNumber++) {
                    if (rowNumber === 0) {
                        $scope.columns[columnNumber].dataType = _dataTypes.getDataTypeOf(dataArray[rowNumber + 1][columnNumber - 1]);
                    }
                    else {
                        if ($scope.columns[columnNumber].dataType !== _dataTypes.TEXT) {
                            var cellDataType = _dataTypes.getDataTypeOf(dataArray[rowNumber + 1][columnNumber - 1]);
                            if (cellDataType !== $scope.columns[columnNumber].dataType) {
                                $scope.columns[columnNumber].dataType === _dataTypes.TEXT;
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
                    var parsedValue = $scope.columns[columnNumber].dataType.parse(value);
                    $scope.rows[rowNumber][columnNumber] = parsedValue;
                }
            }
        };
        $scope.sort = function (columnNumber) {

            if (isNaN(columnNumber) || columnNumber < 0 || columnNumber >= $scope.columns.length) {
                throw new Error("Invalid column number to sort.");
            }

            // vars
            var sortFunction,
                    sortStateSortFunction,
                    nextSortState;

            // set next sort state
            $scope.columns[columnNumber].setNextSortState();

            // get exact sort function from sort state
            sortStateSortFunction = $scope.columns[columnNumber].currentSortState.sortFunction;

            // check for UNSORTED state or error case
            if (sortStateSortFunction === null) {
                // set sort by row ID (default)
                sortFunction = function (a, b) { return a[0] - b[0]; };
            }
            else {
                sortFunction = function (a, b) { return sortStateSortFunction(a[columnNumber], b[columnNumber]); };
            }

            $scope.rows.sort(sortFunction);

            for (var col = 0; col < $scope.columns.length; col++) {
                if (col !== columnNumber) {
                    $scope.columns[col].currentSortState = _sortStates.UNSORTED;
                }
            }

            var elem = angular.element(event.currentTarget);

            for (sortState in _sortStates) {
                if (_sortStates[sortState] !== $scope.columns[columnNumber].currentSortState) {
                    elem.removeClass(_sortStates[sortState].sortClass);
                }
                else {
                    elem.addClass(_sortStates[sortState].sortClass);
                }
            }
        };


        $scope.$watch('datasource', function (newValue, oldValue) {
            $scope.errorMessage = null;
            try {
                if (newValue === newValue && angular.isArray(newValue) && newValue.length !== 0) {
                    _validateInputArray(newValue);
                    _validateCSSClassName($scope.mainTableClass);
                    _validateCSSClassName($scope.exceptionClass);

                    $scope.populate($scope.datasource);
                }
                    
            }
            catch (e) {
                $scope.errorMessage = e.message;
            }
        }, true);

        // dynamic template choice for errors displaying
        $scope.getTemplateUrl = function () {
            if ($scope.errorMessage === null) {
                return "./directiveTemplates/tableTemplate.html";
            }
            else {
                return "./directiveTemplates/errorTemplate.html";
            }
        };
    }

    controller.$inject = ['$scope'];

    var simpleTable = function () {
        return {
            template: '<ng-include src="getTemplateUrl()"/>',
            scope: {
                datasource: "=",
                mainTableClass: "@tabStyle",
                exceptionClass: "@errStyle"
            },
            restrict: 'E',
            controller: controller,
            replace: true
        };
    };

    angular.module("simpleTable", [])
        .directive("sTable", simpleTable);

}());