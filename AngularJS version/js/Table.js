﻿
angular.module("simpleTable", [])
.directive("sTable", function () {

    var controller = ['$scope', function ($scope) {

        //table
        var _datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";

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
            return true;
        };
        var _clear = function () {
            $scope.columns.length = 0;
            $scope.rows.length = 0;
        };

        //public properties
        $scope.columns = [];//need to be renamed as $scope.columns = [];
        $scope.rows = [[]];

        //public methods
        $scope.populate = function (dataArray) {
            _validateInputArray(dataArray);
            _clear();
            $scope.rows = new Array(dataArray.length);
            for (var i = 0; i < ($scope.rows.length - 1) ; i++) {
                $scope.rows[i] = new Array((dataArray[0].length + 1));
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
            // for dataArray column = columnNumber - 1, row = rowNumber + 1
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
        };
        


        $scope.$watch('datasource', function (neww, old) {
            try {
                if (angular.isArray(neww) && neww.length !== 0)
                    $scope.populate($scope.datasource);
            }
            catch (e) {
                alert(e.message);//TEST
            }
        }, true);

        $scope.getTemplateUrl = function () {
            if ($scope.errorMessage === null) {
                return "./directiveTemplates/tableTemplate.html";
            }
            else {
                return "./directiveTemplates/errorTemplate.html";
            }
        }
    }]
    return {
        template: '<ng-include src="getTemplateUrl()"/>',
        scope: {
            datasource: "="
        },
        restrict: 'E',
        controller: controller,
        replace: true
        //    function () {
        //        //chooseTemplate();
        //        var html = "<ul>" +
        //                   '<li ng-click="testClick($index)" ng-repeat="item in columns track by $index">{{item.columnName}} : {{$index}}</li>' +
        //                   "</ul>";
        //        html = '<table class="table">' +
        //               '<thead>' +
        //               '<tr>' +
        //               '<th ng-repeat="column in columns track by $index" ng-click="sort(this.$index)">{{column.columnName}}</th>' +
        //               '</tr>' +
        //               '</thead>' +
        //                '<tbody>' +
        //                '<tr ng-repeat="row in rows">' +
        //                '<td ng-repeat="cell in row track by $index">{{cell}}</td>' +
        //                '</tr>' +
        //                '</tbody>' +
        //               '</table>';
        //    return html;
        //}
    }
})
        .controller("defaultCtrl", function ($scope) {

            $scope.arrayQQ = [1, 2, 3, 4];
            $scope.newItem;

            $scope.changePrices = function () {
                for (var i = 0; i < $scope.arrayQQ.length; i++) {
                    $scope.arrayQQ[i]++;
                }
            }

            $scope.addNew = function () {
                
                var item = $scope.newItem;
                $scope.arrayQQ.push(item);
            }
        })