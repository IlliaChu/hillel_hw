/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.1175, "KoPercent": 4.8825};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9158541666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75725, 500, 1500, "GET All characters"], "isController": false}, {"data": [0.93475, 500, 1500, "POST - create character"], "isController": false}, {"data": [0.963275, 500, 1500, "PUT - change character name"], "isController": false}, {"data": [0.91275, 500, 1500, "GET - characters ID"], "isController": false}, {"data": [0.9627, 500, 1500, "DELETE - delete character"], "isController": false}, {"data": [0.9644, 500, 1500, "GET - Created characters ID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120000, 5859, 4.8825, 742.5222833333315, 0, 34759, 16.0, 26.0, 37.0, 29654.99, 3371.070595836728, 2114.2786073527964, 592.5014035153945], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET All characters", 20000, 1743, 8.715, 2787.0982000000045, 1, 34759, 19.0, 15263.0, 23299.0, 28107.99, 561.9082403843453, 1183.464357457927, 79.64563673861433], "isController": false}, {"data": ["POST - create character", 20000, 707, 3.535, 607.7189000000009, 0, 32717, 18.0, 152.0, 287.0, 29287.800000000032, 562.0187714269657, 200.89767131034677, 121.7722888741359], "isController": false}, {"data": ["PUT - change character name", 20000, 707, 3.535, 125.7252999999995, 0, 17146, 18.0, 46.0, 167.0, 515.9900000000016, 562.2557701498412, 160.0714723721571, 122.02498611931068], "isController": false}, {"data": ["GET - characters ID", 20000, 1288, 6.44, 597.5139499999984, 0, 30498, 18.0, 257.0, 356.0, 28237.950000000008, 562.0029786157867, 229.93652110496808, 82.15781043639531], "isController": false}, {"data": ["DELETE - delete character", 20000, 707, 3.535, 85.79990000000026, 0, 18595, 18.0, 34.0, 161.0, 485.8700000000208, 562.3190035707256, 165.7012974632384, 100.25464154799393], "isController": false}, {"data": ["GET - Created characters ID", 20000, 707, 3.535, 251.27744999999948, 0, 30533, 18.0, 140.90000000000146, 178.0, 9802.100000000144, 562.0661551864654, 174.79225507967288, 86.9235034549504], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 20, 0.3413551800648575, 0.016666666666666666], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 859, 14.661204983785629, 0.7158333333333333], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3408, 58.166922683051716, 2.84], "isController": false}, {"data": ["404/Not Found", 1507, 25.72111281788701, 1.2558333333333334], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 65, 1.1094043352107867, 0.05416666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120000, 5859, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 3408, "404/Not Found", 1507, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 859, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 65, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 20], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET All characters", 20000, 1743, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1681, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 21, "", "", "", ""], "isController": false}, {"data": ["POST - create character", 20000, 707, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 408, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 292, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1, "", ""], "isController": false}, {"data": ["PUT - change character name", 20000, 707, "404/Not Found", 526, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 163, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 4, "", ""], "isController": false}, {"data": ["GET - characters ID", 20000, 1288, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1195, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", ""], "isController": false}, {"data": ["DELETE - delete character", 20000, 707, "404/Not Found", 627, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 71, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 9, "", "", "", ""], "isController": false}, {"data": ["GET - Created characters ID", 20000, 707, "404/Not Found", 354, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 243, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 110, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
