
// Модель
var model = "Hello world";

// AngularJS прилоежние состоит из одного или нескольких модулей.
// angular.module - создание нового angularJS модуля.
// первый параметр - имя модуля для создания или получения
// второй мараметр - Набор модулей, от которых будет зависить создаваемый модуль. Если параметр указан, то новый модуль будет создан.
// https://docs.angularjs.org/api/ng/function/angular.module

var csvParserApp = angular.module("csvParserApp", []);

// Контроллер
// В AngularJS переменные которые начинаются с символа $ являются встроенными элементами фрэймворка.
// $scope - используется для передачи данных в представление.
// .controller - метод создающий контроллер.
// первый параметр - имя контроллера (<Name>Ctrl соглашение по именованию контроллеров)
// второй параметр - функция контроллера
csvParserApp.controller("CSVParserCtrl", function ($scope) {

    $scope.table = Widgets.createWidget("Table");

    // Поведение / Behavior
    $scope.parseCSV = function () {
        $scope.table.populate(CSVParser.parse($scope.input));
        $scope.showTable = true;
    };
    $scope.showTable = false;
});
