angular.module("csvParserApp", ["csvServices"])
//.config(function (csvParserServiceProvider) {
//    csvParserServiceProvider.setDelimiter(',').setNewLine('\n').setQuote('"');
//})
.controller("CSVParserCtrl", function ($scope, csvParserService) {

    $scope.table = Widgets.createWidget("Table");

    $scope.parseCSV = function () {
        $scope.table.populate(csvParserService.parse($scope.input));
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
