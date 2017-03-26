var table,
    outputContainer,
    isTableDrawn = false;

if (window.addEventListener) {
    window.addEventListener("load", init, false);
}
else if (window.attachEvent) {
    window.attachEvent("onload", init);
}

function init() {
    table = Widgets.createWidget("Table");
    outputContainer = document.getElementById("output-container");

    var button = document.getElementById("generate-button");
    if (button.addEventListener) {
        button.addEventListener("click", generateTableFromCSV, false);
    }
    if (button.attachEvent) {
        button.attachEvent("onclick", generateTableFromCSV);
    }

    var input = document.getElementById("csv-input");
    if (input.addEventListener) {
        input.addEventListener("change", onInputChanged, false);
    }
    if (input.attachEvent) {
        input.attachEvent("onchange", onInputChanged);
    }
}

function onInputChanged() {
    if (isTableDrawn) {
        generateTableFromCSV();
    }
}

function generateTableFromCSV() {
    var parsedDataArray;
    var inputData = document.getElementById("csv-input").value;

    try {
        parsedDataArray = CSVParser.parse(inputData);
        table.populate(parsedDataArray);
        drawTable();
    }
    catch (e) {
        showError(e.message);
    }
}

function drawTable() {
    var outputHTML;

    try {
        outputContainer.innerHTML = "";
        outputHTML = table.buildHTML("table");
        outputContainer.innerHTML = outputHTML;

        var CSVtable = document.getElementById("CSVTable");//tableContainer.children[0]
        if (CSVtable !== null) {
            for (var i = 0; i < CSVtable.rows[0].cells.length; i++) {
                var col = CSVtable.rows[0].cells[i];
                if (col.addEventListener) {
                    col.addEventListener("click", function () {
                        table.sort(this.cellIndex);
                        drawTable();
                    }, false);
                }
                if (col.attachEvent) {
                    col.attachEvent("onclick", function () {
                        table.sort(this.cellIndex);
                        drawTable();
                    });
                }
            }
        }
        isTableDrawn = true;
    }
    catch (e) {
        showError(e.message);
    }
}

function showError(message) {
    outputContainer.innerHTML = "<p class=\"alert alert-danger\">" + message + "</p>";
    //isTableDrawn = false;
}