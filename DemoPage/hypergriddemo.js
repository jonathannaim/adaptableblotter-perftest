// Build the grid, the blotter and performance monitor config
var adaptableblotter;
var grid;
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
            schema.push({ name: p, header: capitalize(p) });
        }
    }
    return schema;
}
function reInintBlotter() {
    window.location.reload();
}
function reIndexData() {
    grid.behavior.reindex();
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
    var tickingDataIntervalElement = document.getElementById("ab_ticking_data_interval");
    var data = dataGen.getData(rowNumberElement.value, columnNumberElement.value);

    //create the Hypergrid
    grid = new fin.Hypergrid('#grid', { data: data, schema: getSchema(data) });
    var fpsNumberElement = document.getElementById("ab_fps_number");
    setInterval(function () { fpsNumberElement.innerText = grid.canvas.currentFPS.toFixed(1) + " FPS"; }, 1000);
    if (tickingDataIntervalElement.value != "NA") {
        dataGen.startTickingData(grid, tickingDataIntervalElement.value);
    }
    //Set to `true` to render `0` and `false`. Otherwise these value appear as blank cells.
    grid.addProperties({ renderFalsy: true });
    grid.addProperties({ editOnKeydown: false });
    //needed to compute FPS
    grid.addProperties({ enableContinuousRepaint: true });
    //Set to `true` to render `0` and `false`. Otherwise these value appear as blank cells

    //create Adaptable Blotter
    var container = document.getElementById('content');
    //tradeId is the primary for the datasource
    //Jonathan is the username for the demo. Can be plugged to an authent service if required
    adaptableblotter = new adaptableblotterhypergrid.AdaptableBlotter(
        grid,
        container,
        {
            primaryKey: "primaryKey",
            blotterId: "adaptable_blotter_perf",
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
    grid.behavior.setColumnProperties(2, {
        editor: 'textfield'
    });
    grid.behavior.setColumnProperties(3, {
        editor: 'textfield',
        format: 'number'
    });
    var origgetCell = grid.behavior.dataModel.getCell;
    grid.behavior.dataModel.getCell = function (config, declaredRendererName) {
        if (config.isDataRow) {
            if (!adaptableblotter.isColumnReadonly(config.field)) {
                config.font = lightTheme.fontBold;
            }
        }
        return origgetCell.call(grid.behavior.dataModel, config, declaredRendererName);
    };
    grid.addProperties(lightTheme);
}

var lightTheme = {
    font: '14px Helvetica Neue, Helvetica, Arial, sans-serif',
    fontBold: 'bold 14px Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#003f59',
    backgroundColor: 'white',
    altbackground: '#e6f2f8',
    foregroundSelectionColor: 'white',
    backgroundSelectionColor: 'rgba(13, 106, 146, 0.5)',

    columnHeaderFont: '14px Helvetica Neue, Helvetica, Arial, sans-serif',
    columnHeaderColor: '#00435e',
    columnHeaderBackgroundColor: '#d9ecf5',
    columnHeaderForegroundSelectionColor: 'rgb(25, 25, 25)',
    columnHeaderBackgroundSelectionColor: 'rgb(255, 220, 97)',

    rowHeaderFont: '14px Helvetica Neue, Helvetica, Arial, sans-serif',
    rowHeaderColor: '#00435e',
    rowHeaderBackgroundColor: '#d9ecf5',
    rowHeaderForegroundSelectionColor: 'rgb(25, 25, 25)',
    rowHeaderBackgroundSelectionColor: 'rgb(255, 220, 97)',

    backgroundColor2: 'rgb(201, 201, 201)',
    lineColor: '#bbdceb',
    voffset: 0,
    scrollbarHoverOver: 'visible',
    scrollbarHoverOff: 'visible',
    scrollingEnabled: true,

    fixedRowAlign: 'center',
    fixedColAlign: 'center',
    cellPadding: 15,
    gridLinesH: false,
    gridLinesV: true,

    defaultRowHeight: 30,
    defaultFixedRowHeight: 15,
    showRowNumbers: false,
    editorActivationKeys: ['alt', 'esc'],
    columnAutosizing: true,
    readOnly: false
};