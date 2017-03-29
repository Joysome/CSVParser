(function () {

    var CSVParserCtrl = function ($scope, csvParserService) {

        $scope.parsedArray = new Array();

        $scope.input;

        $scope.parseCSV = function () {
            var testtmp = csvParserService.parse($scope.input);
            $scope.parsedArray.length = 0;
            $scope.parsedArray.push.apply($scope.parsedArray, testtmp);
            $scope.showTable = true;
        };

        $scope.onInputChanged = function (input) {
            if ($scope.showTable) {
                $scope.parseCSV();
            }
        }

        $scope.showTable = false;
    }

    CSVParserCtrl.$inject = ["$scope", "csvParserService"];

    angular.module("csvParserApp", ["csvServices", "simpleTable"])
        //.config(function (csvParserServiceProvider) {
        //    csvParserServiceProvider.setDelimiter(',').setNewLine('\n').setQuote('"');
        //})
        .controller("CSVParserCtrl", CSVParserCtrl);

}());



