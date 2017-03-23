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
    tableContainer.innerHTML = getAll(inputData);//test

    //document.write(testParse(inputData).join("<br />"));
}

function testParse(string) {
    document.write(string);
    var res = string.match(/([^*,]+)/g);
    return res;
}