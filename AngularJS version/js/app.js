
var model = "Hello world";

var csvParserApp = angular.module("csvParserApp", []);

csvParserApp.controller("CSVParserCtrl", function ($scope) {

    $scope.table = Widgets.createWidget("Table");

    $scope.parseCSV = function () {
        $scope.table.populate(CSVParser.parse($scope.input));
        $scope.showTable = true;
    };

    $scope.onInputChanged = function (input) {
        if ($scope.showTable) {
            $scope.parseCSV();
        }
    }

    $scope.showTable = false;

    $scope.showError = false;
});
