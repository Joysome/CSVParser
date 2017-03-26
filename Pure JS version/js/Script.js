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
        e.addEventListener("click", generateTableFromCSV, false);
    }
    if (e.attachEvent) {
        e.attachEvent("onclick", generateTableFromCSV);
    }
}

function generateTableFromCSV() {
    parseCSV();
    drawTable();
}

function parseCSV() {
    var parsedDataArray;

    var inputData = document.getElementById("csv-input").value;
    try{
        parsedDataArray = CSVParser.parse(inputData);
        table.populate(parsedDataArray);
    }
    catch (e) {
        console.log(e.message);
    }
}

function drawTable() {
    var outputHTML;

    var tableContainer = document.getElementById("table-container");
    try {
        outputHTML = table.buildHTML("table");
    }
    catch (e) {
        outputHTML = "<p class=\"alert alert-danger\">" + e.message + "</p>";
    }

    tableContainer.innerHTML = outputHTML;

    var CSVtable = document.getElementById("CSVTable");
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
}

function getOutputMarkup() {
    

   
    

    
    
    
}