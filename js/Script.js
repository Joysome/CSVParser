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
    var tableHTML = getTableHTML(inputData);
    tableContainer.innerHTML = tableHTML;
}

//test
function getTableHTML(inputData) {
    var rows = inputData.split(/\r?\n|\r/);
    
    var table = '<table class="table table-hover">';
    for (var row = 0; row < rows.length; row++) {
        if (row === 0) {
            table += '<thead>';
            table += '<tr>';
        } else {
            table += '<tr>';
        }
        rows[row] = rows[row].split(',');
        for (var cell = 0; cell < rows[row].length; cell++) {
            if (row === 0) {
                table += '<th>';
                table += rows[row][cell];
                table += '</th>';
            } else {
                table += '<td>';
                table += rows[row][cell];
                table += '</td>';
            }
        }
        if (row === 0) {
            table += '</tr>';
            table += '</thead>';
            table += '<tbody>';
        } else {
            table += '</tr>';
        }
    }
    table += '</tbody>';
    table += '</table>';

    return table;
}