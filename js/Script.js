var table;

if (window.addEventListener) {
    window.addEventListener("load", init, false);
}
else if (window.attachEvent) {
    window.attachEvent("onload", init);
}

function init() {
    var e = document.getElementById("generate-button");
    if (e.addEventListener) {
        e.addEventListener("click", generateTable, false);
    }
    if (e.attachEvent) {
        e.attachEvent("onclick", generateTable);
    }
}

function generateTable() {
    var inputData = document.getElementById("csv-input").value;
    var tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = getTable(inputData);//test
}

function getTable(inputData) {

    var value = new Date(Date.parse("5.3.2015"));
    var q = value.getUTCFullYear();
    var w = value.toDateString();
    var e = value.getUTCDay();
    //var outputString = value.getYear().toString() + "-"
    //                    + value.getMonth().toString() + "-"
    //                    + value.getDay().toString();
    //alert(outputString);

    var parsedDataArray = CSVParser.parse(inputData);
    //TODO: make table a gloabal variable
    var parsedCSVDataTable = new Widgets.Table(parsedDataArray);
    return parsedCSVDataTable.getHTMLMarkup("table");
}