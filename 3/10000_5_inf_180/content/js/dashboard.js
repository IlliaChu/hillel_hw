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

    var data = {"OkPercent": 96.14246668840211, "KoPercent": 3.8575333115978903};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8788502966278577, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7775811650549962, 500, 1500, "GET All characters"], "isController": false}, {"data": [0.9058477179637214, 500, 1500, "POST - create character"], "isController": false}, {"data": [0.9276838677160469, 500, 1500, "PUT - change character name"], "isController": false}, {"data": [0.8290847876872337, 500, 1500, "GET - characters ID"], "isController": false}, {"data": [0.9290737530533449, 500, 1500, "DELETE - delete character"], "isController": false}, {"data": [0.9252402889154296, 500, 1500, "GET - Created characters ID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 328189, 12660, 3.8575333115978903, 5092.764973841274, 1, 226550, 1037.0, 148465.9, 224693.9, 226381.98, 1401.8640889500189, 14488.211003608361, 246.79145017652033], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET All characters", 60186, 7341, 12.19718871498355, 21280.855780413982, 1, 226514, 687.0, 149674.9, 223460.85, 226170.0, 257.81772073816416, 14176.797323615354, 35.14943543071358], "isController": false}, {"data": ["POST - create character", 54688, 989, 1.8084406085430076, 1123.0863077823255, 2, 149197, 381.0, 887.0, 4004.0, 75285.0, 235.22226284436223, 74.3684592007355, 51.87766974827416], "isController": false}, {"data": ["PUT - change character name", 51586, 453, 0.878145233202807, 485.50472996549394, 2, 147935, 370.0, 704.9000000000015, 837.0, 7031.920000000013, 222.50114300009488, 60.50725582660473, 48.960486567592284], "isController": false}, {"data": ["GET - characters ID", 58216, 2805, 4.818263020475471, 3961.8907345059656, 1, 226550, 451.0, 12551.600000000035, 79466.8, 226330.97, 249.47718468236826, 91.34954332001654, 37.102612148171005], "isController": false}, {"data": ["DELETE - delete character", 50764, 398, 0.7840201717752738, 565.4390118981946, 2, 146479, 365.0, 723.0, 875.0, 11120.860000000503, 219.0577289870457, 63.75762900209504, 39.47974028725328], "isController": false}, {"data": ["GET - Created characters ID", 52749, 674, 1.2777493412197387, 848.6585527687736, 2, 148009, 371.0, 741.0, 1023.0, 63031.96000000721, 227.03268041370228, 64.22452864943122, 35.943540757442726], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 335, 2.646129541864139, 0.10207532854544181], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2592, 20.473933649289098, 0.7897888107157766], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 623, 4.921011058451817, 0.18982964084719475], "isController": false}, {"data": ["404/Not Found", 945, 7.464454976303317, 0.2879438372401269], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 8164, 64.4865718799368, 2.4875909917760803], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: No buffer space available (maximum connections reached?): connect", 1, 0.007898894154818325, 3.047024732699755E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 328189, 12660, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 8164, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2592, "404/Not Found", 945, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 623, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 335], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET All characters", 60186, 7341, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 6712, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 367, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 244, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 18, "", ""], "isController": false}, {"data": ["POST - create character", 54688, 989, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 473, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 378, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 77, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 60, "Non HTTP response code: java.net.SocketException/Non HTTP response message: No buffer space available (maximum connections reached?): connect", 1], "isController": false}, {"data": ["PUT - change character name", 51586, 453, "404/Not Found", 295, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 74, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 52, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 12], "isController": false}, {"data": ["GET - characters ID", 58216, 2805, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1556, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 761, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 297, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 191, "", ""], "isController": false}, {"data": ["DELETE - delete character", 50764, 398, "404/Not Found", 270, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 71, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 47, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4], "isController": false}, {"data": ["GET - Created characters ID", 52749, 674, "404/Not Found", 380, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 168, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 97, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 23, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
