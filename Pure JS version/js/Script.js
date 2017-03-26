var table;

if (window.addEventListener) {
    window.addEventListener("load", init, false);
}
else if (window.attachEvent) {
    window.attachEvent("onload", init);
}

function init() {
    table = Widgets.createWidget("Table");

    var e = document.getElementById("generate-button");
    if (e.addEventListener) {
        e.addEventListener("click", getOutputMarkup, false);
    }
    if (e.attachEvent) {
        e.attachEvent("onclick", getOutputMarkup);
    }
}

function getOutputMarkup() {
    var parsedDataArray,
        outputHTML;

    var inputData = document.getElementById("csv-input").value;
    var tableContainer = document.getElementById("table-container");
    try {
        parsedDataArray = CSVParser.parse(inputData);
        table.populate(parsedDataArray);
        table.sort(2);
        outputHTML = table.buildHTML("table");
    }
    catch (e) {
        outputHTML = "<p class=\"alert alert-danger\">" + e.message + "</p>";
    }    
    tableContainer.innerHTML = outputHTML;
}