var table;

if (window.addEventListener) {
    window.addEventListener("load", init, false);
}
else if (window.attachEvent) {
    window.attachEvent("onload", init);
}

function init() {
    table = new Widgets.Table();

    var e = document.getElementById("generate-button");
    if (e.addEventListener) {
        e.addEventListener("click", getTableHTML, false);
    }
    if (e.attachEvent) {
        e.attachEvent("onclick", getTableHTML);
    }
}

function getTableHTML() {
    var inputData = document.getElementById("csv-input").value;
    var parsedDataArray = CSVParser.parse(inputData);
    table.populate(parsedDataArray);
    table.sort(2);
    var tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = table.getHTMLMarkup("table");
}