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
    var datePattern = "(((19|20)([2468][048]|[13579][26]|0[48])|2000)[/-]02[/-]29|((19|20)[0-9]{2}[/-](0[4678]|1[02])[/-](0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}[/-](0[1359]|11)[/-](0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}[/-]02[/-](0[1-9]|1[0-9]|2[0-8])))";
    alert("1995-03-05" + new RegExp(datePattern).test("1995-03-05"));
    var d = new Date("1995-03-05");
    var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    alert(datestring);

    var parsedDataArray = CSVParser.parse(inputData);//TODO: maybe a try/catch block here
    var table = Widgets.Table(parsedDataArray);

}