// Build the grid, the blotter and performance monitor config
var adaptableblotter;
var gridOptions;
document.addEventListener("DOMContentLoaded", function () {
    loadData();
    InitBlotter();
});
function capitalize(string) {
    return (/[a-z]/.test(string) ? string : string.toLowerCase())
        .replace(/[\s\-_]*([^\s\-_])([^\s\-_]+)/g, replacer)
        .replace(/[A-Z]/g, ' $&')
        .trim();
}
function replacer(a, b, c) {
    return b.toUpperCase() + c;
}

function getSchema(data) {
    var schema = [],
        firstRow = Array.isArray(data) && data[0];

    firstRow = (typeof firstRow === 'object') ? firstRow : {};
    for (var p in firstRow) {
        if (firstRow.hasOwnProperty(p)) {
            if (p === 'StringColumn1' || p === 'IntColumn2') {
                schema.push({ headerName: capitalize(p), field: p, editable: true, filter: 'text',cellStyle: {'font-weight': 'bold'}});
            }
            else {
                schema.push({ headerName: capitalize(p), field: p, filter: 'text' });
            }
        }
    }
    return schema;
}
function reInintBlotter() {
    window.location.reload();
}
function reIndexData() {
    gridOptions.api.redrawRows();
}
function loadData() {
    var rowNumberElement = document.getElementById("ab_row_number");
    var rowNumber = localStorage.getItem(rowNumberElement.id);
    if (rowNumber) {
        rowNumberElement.value = rowNumber;
    }
    else {
        rowNumberElement.value = "100";
    }
    var columnNumberElement = document.getElementById("ab_column_number");
    var columnNumber = localStorage.getItem(columnNumberElement.id);
    if (columnNumber) {
        columnNumberElement.value = columnNumber;
    }
    else {
        columnNumberElement.value = "10";
    }
    var tickingDataIntervalElement = document.getElementById("ab_ticking_data_interval");
    var tickingDataInterval = localStorage.getItem(tickingDataIntervalElement.id);
    if (tickingDataInterval) {
        tickingDataIntervalElement.value = tickingDataInterval;
    }
    else {
        tickingDataIntervalElement.value = "250";
    }
}
function saveData() {
    var rowNumberElement = document.getElementById("ab_row_number");
    localStorage.setItem(rowNumberElement.id, rowNumberElement.value);
    var columnNumberElement = document.getElementById("ab_column_number");
    localStorage.setItem(columnNumberElement.id, columnNumberElement.value);
    var tickingDataIntervalElement = document.getElementById("ab_ticking_data_interval");
    localStorage.setItem(tickingDataIntervalElement.id, tickingDataIntervalElement.value);
    document.getElementById("generate_blotter").removeAttribute("disabled");
}
function InitBlotter() {
   //Generate the dumy data
   var dataGen = new datagenerator.DataGenerator();
   var rowNumberElement = document.getElementById("ab_row_number");
   var columnNumberElement = document.getElementById("ab_column_number");
   var data = dataGen.getData(rowNumberElement.value, columnNumberElement.value);


    // let the grid know which columns and what data to use
    gridOptions = {
        columnDefs: getSchema(data),
        rowData: data,
        enableSorting: true,
        enableRangeSelection: true,
        onGridReady: function () {
            var tickingDataIntervalElement = document.getElementById("ab_ticking_data_interval");
            if (tickingDataIntervalElement.value != "NA") {
                dataGen.startTickingDataAggrid(gridOptions, tickingDataIntervalElement.value);
            }
        }
    };
    var eGridDiv = document.getElementById('grid');
    var grid = new agGrid.Grid(eGridDiv, gridOptions);
    

    var container = document.getElementById('content');
    var gridcontainer = document.getElementById('grid');
    adaptableblotter = new adaptableblotteraggrid.AdaptableBlotter(gridOptions, container, gridcontainer, {
        primaryKey: "primaryKey",
        blotterId: "adaptable_blotter_perf_aggrid",
        userName: "Jonathan",
        enableAuditLog: false,
        enableRemoteConfigServer: false,
        predefinedConfigUrl: "predefinedconfig.json",
        maxColumnValueItemsDisplayed: 1000
    });
    adaptableblotter.AdaptableBlotterStore.TheStore.subscribe(function () {
        var csNumberElement = document.getElementById("ab_cs_number");
        csNumberElement.innerText = adaptableblotter.AdaptableBlotterStore.TheStore.getState().ConditionalStyle.ConditionalStyleConditions.length;
    });
}