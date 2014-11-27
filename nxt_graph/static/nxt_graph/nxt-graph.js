//nxt-graph.js

// create the directives as re-usable components
app
    .directive('nxtTimeseries', function($http) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'url': '@',
                'title': '@',
                'unit': '@'
            },
            template: '<svg></svg>',
            link: function(scope, element, attrs) {
                var readyForNext = null;
                var busy = false;
                var getData = function(url, fn){
                    //console.log(url);
                    $.ajax({
                            url: url,
                            type: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                //console.log('data!!!', data);
                                var formatted = [{
                                            "key": "timeseries",
                                            "values": data['timeseries']
                                        }];
                                fn(formatted);

                                console.log('readyForNext: ', readyForNext);
                                if (readyForNext !== null) {
                                    setTimeout(function() {
                                        requestAnimationFrame(function() {
                                            // possibly a user does not see the very
                                            // latest graph...
                                            if (readyForNext !== null) {
                                                console.log("ReadyForNext!!");
                                                var next = readyForNext;
                                                readyForNext = null;
                                                getData(next, addGraph);
                                            }
                                            busy = false;
                                        });
                                    }, 1000);  // wait a while before accepting new
                                } else {
                                    busy = false;
                                }
                            },
                            error: function (data) {
//                                console.log('error!!!', data);
                                var empty = [{"key": "timeseries",
                                            "values": [['1979-05-25 14:30', 0], ['1979-05-25 14:31', 0]]}];
                                fn(empty);
                                setTimeout(function() {
                                    requestAnimationFrame(function() {
                                        busy = false;
                                    });
                                }, 1000);  // wait a while before accepting new
                            }
                    });  // $.ajax
                }
                var addGraph = function(formatted) {
                    var result = nv.addGraph(function() {
                        var chart = nv.models.lineChart()
                                      .x(function(d) { return Date.parse(d[0]) })
                                      .y(function(d) { return d[1] })
                                      .clipEdge(true)
                                      .tooltipContent(function(key, y, e, graph) {
                                        var header = (scope.title != undefined) ? scope.title : key;
                                        if ((scope.unit != undefined) && (scope.unit != '') && (scope.unit != null) ) {
                                            header = header + ' - ' + scope.unit;
                                        }
                                        return '<h3 class="graph-header">' + header + ' </h3>' +
                                               '<p>' +  e + '</p>'
                                    });
                        var epoch = 0;
                        try {
                            // try to get the startdate.
                            epoch = +Date.parse(formatted[0].values[0][0]);
                        } catch(err) {
                        }
//                        console.log('epoch for this graph is ', epoch);
                        chart.xAxis
                            .axisLabel('Time')
                            .tickFormat(function(d) {
                                //var hours = +(d- new Date("2012-01-01")) / 1000 / 60 / 60;
                                //console.log('debug ', ((+d) - epoch));
                                var minutes = ((+d) - epoch)  / 1000 / 60;
                             //return Math.round(hours*10)/10;
                                var minutes_mod = Math.floor(minutes%60);
                                if (minutes_mod < 10) {minutes_mod = '0' + minutes_mod;}
                             return Math.floor(minutes/60)+':'+minutes_mod;
                             //return d3.time.format('%d %H:%M')(new Date(d))
                           });

                        chart.yAxis
                             .axisLabel('Depth (m)')
                             .tickFormat(d3.format(',.2f'));

                        chart.showLegend(false);

                        //console.log('element', $(element).attr('id'), element);
                        // Make sure your context as an id or so...
                        d3.select(element.context)
                          .datum(formatted)
                            .transition().duration(500).call(chart);

                        nv.utils.windowResize(chart.update);
                        scope.current_chart = chart;
                        return chart;

                    });  // nv.addGraph
                    return result;
                };

                var set_null_on_selection = function(selection) {
                    for (o in selection.remove()) {
                        o = null;
                    };
                }

                scope.$watch('url', function (url) {
                    if ((url !== '') ) {
                        if (busy) {
                            // We don't have time for it now, but later you want
                            // the latest available graph.
                            readyForNext = url;
                            return;
                        }
                        if (scope.current_chart !== null) {
                            // uncomment this to use slightly less memory, but the line
                            // graph will flicker on update
/*                            set_null_on_selection(d3.selectAll('svg g.nv-pointpaths path'));
                            set_null_on_selection(d3.selectAll('svg g.nv-pointpaths'));
                            set_null_on_selection(d3.selectAll('svg g.nv-group'));
                            set_null_on_selection(d3.selectAll('svg g.nv-groups'));
                            set_null_on_selection(d3.selectAll('svg g.nv-wrap'));
                            set_null_on_selection(d3.selectAll('svg g.nv-scatterWrap'));
                            set_null_on_selection(d3.selectAll('svg g.nv-linesWrap'));
                            set_null_on_selection(d3.selectAll('svg g.nv-axis'));
                            set_null_on_selection(d3.selectAll('svg g.nvd3'));
*/
                            scope.current_chart = null;

                            window.nv.charts = {};
                            window.nv.graphs = [];
                            window.nv.logs = {};
                            window.onresize = null;
                        }

                        // NB: busy = true commented because it doesn't allow
                        // for multiple graphs in the same popup. This is needed
                        // for example for the graphs in the threedi orifice popup.
                        busy = true;

                        //console.log('busy', busy);
                        getData(url, addGraph);

                    }
                });  // scope.watch
            }
        }
    });


app
    .directive('nxtCrossSection', function($http) {
        var busy = false;
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'url': '@',
                'unit': '@'
            },
            template: '<svg></svg>',
            link: function(scope, element, attrs) {
                scope.current_chart = null;
                scope.to_be_deleted = null;
                var getData = function(url, fn){
                    $.ajax({
                            url: url,
                            success: function(data) {
                                var formatted = [{
                                  "key": "offset",
                                  "values": data.offset,
                                  "color": "#ffffff"
                                },{
                                  "key": "groundwater_delta",
                                  "values": data.groundwater_delta,
                                  "color": "#2D8265"
                                },{
                                  "key": "elevation",
                                  "values": data.bathymetry_delta,
                                  "color": "#2C9331"
                                },{
                                  "key": "depth",
                                  "values": data.depth,
                                  "color": "LightSkyBlue"
                                }];
                                //console.log('formatte 1', formatted, data);
                                // new graph and contents
                                fn(formatted, data.summary);

                                setTimeout(function() {
                                    requestAnimationFrame(function() {
                                        busy = false;
                                    });
                                }, 600);
                            },
                            error: function (data) {
                                var empty = [{
                                    "key": "offset",
                                    "values": [[0, 0], [1/111, 0]],
                                    "color": "#ffffff",
                                    "opacity": "0.5"
                                },{
                                    "key": "groundwater_delta",
                                    "values": [[0, 0], [1/111, 0]],
                                    "color": "#2D8265",
                                    "opacity": "0.5"
                                },{
                                    "key": "elevation",
                                    "values": [[0, 0], [1/111, 0]],
                                    "color": "#2C9331"
                                },{
                                  "key": "depth",
                                  "values": [[0,0], [1/111, 0]],
                                  "color": "LightSkyBlue"
                                }];
                                fn(empty);
                                setTimeout(function() {
                                    requestAnimationFrame(function() {
                                        busy = false;
                                    });
                                }, 600);
                            }
                    });  // $.ajax
                }
                var addGraph = function(formatted, summary) {
                    nv.addGraph(function() {
                        //console.log('scope.url2 ', scope.url, '-', scope_url);
                        //console.log('formatted 2', formatted);


                        //console.log("dataaa", data, formatted);
                        // 2 * pi * r / 360 = 111 km per degrees, approximately
                        var chart = nv.models.stackedAreaChart()
                        .height(310).width(380)
                        //var chart = nv.models.lineChart()
                                      .x(function(d) { return 111*d[0] })
                                      .y(function(d) { return d[1] })
                                      .clipEdge(true)
                                      .tooltipContent(function(key, y, e, graph) {
                                        var header = (scope.title != undefined) ? scope.title : key;
                                        if ((scope.unit != undefined) && (scope.unit != '') && (scope.unit != null) ) {
                                            header = header + ' - ' + scope.unit;
                                        }
                                        var unit_x = 'km';
                                        return '<h3 class="graph-header">' + header + ' </h3>' +
                                               '<p>' + e + ' at ' + y + unit_x + ' </p>';
                                    });

                        chart.xAxis
                            .axisLabel('Distance')
                            .tickFormat(d3.format(',.2f'));

                        chart.yAxis
                            .axisLabel('Depth')
                            .tickFormat(d3.format(',.2f'));
                            // .tickFormat(function(d){return d-5});

                        if (summary !== undefined) {
                            // Get summary data from threedi-wms?
                            var minVal = summary.minimum;
                            var maxVal = summary.maximum;
                            var marginVal = summary.margin;
                        } else {
                            console.log('Please update threedi-wms for a better experience...')
                            // Old threedi-wms...
                            var minVal = d3.min(formatted[0].values, function(d) {return d[1];});

                            //Try stacked.y0????

                            // Maximum heights
                            var sumArray = new Array(formatted[0].values.length);
                            for (var i=0; i<formatted[0].values.length; i++) {
                                sumArray[i] = (minVal +
                                    formatted[1].values[i][1] +
                                    formatted[2].values[i][1] +
                                    formatted[3].values[i][1]);
                            }
                            var maxVal = d3.max(sumArray);
                            var marginVal = 0.1 * (maxVal - minVal);
                        }

                        chart.yDomain([minVal, maxVal + marginVal]);

                        // TODO: disable click handler?
                        // TODO: doesn't rescale correctly when negative 2D is applied??
                        // TODO: BUG: when you click on the graph, it doesn't show
                        // individual profiles correctly anymore
                        // var noChartSelected = function() {
                        //     var cstate = chart.state();
                        //     if (cstate.disabled === undefined) {
                        //         return true;
                        //     }
                        //     if (cstate.disabled.indexOf(true) === -1) {
                        //         return true;
                        //     }
                        //     return false;
                        // };

                        // if (noChartSelected()) {
                        //     chart.yDomain([minVal, maxVal + marginVal]);
                        // }

                        chart.showControls(false);
                        chart.showLegend(false);

                        //console.log('element', $(element).attr('id'), element);
                        // Make sure your context as an id or so...
                        d3.select(element.context)
                          .datum(formatted)
                            .transition().duration(100).call(chart);

                        nv.utils.windowResize(chart.update);
                        scope.current_chart = chart;
                        return chart;

                    });  // nv.addGraph

                };

                var set_null_on_selection = function(selection) {
                    for (o in selection.remove()) {
                        o = null;
                    };
                }

                scope.$watch('url', function (url) {
                    //console.log('profile url update');
                    if (busy) {
                        // Only update if an old request is already finished
                        //console.log("profile: busy!!");
                        return;
                    }
                    if (scope.current_chart !== null) {
                        // Still experimental, these are other options we may have to use.
                        // d3.selectAll('circle').remove();
                        // d3.selectAll('path').remove();
                        // d3.selectAll('svg').remove();
                        // remove stuff so memory clears up a bit.
                        // set_null_on_selection(d3.selectAll('svg g'));
                        // set_null_on_selection(d3.selectAll('svg path'));

                        // remove elements down up to prevent detached elements
                        set_null_on_selection(d3.selectAll('svg g.nv-areaWrap path'));
                        set_null_on_selection(d3.selectAll('svg g.nv-areaWrap'));
                        set_null_on_selection(d3.selectAll('svg g.nv-axis'));
                        set_null_on_selection(d3.selectAll('svg g.nv-stackedWrap'));
                        set_null_on_selection(d3.selectAll('svg g.nv-scatterWrap'));
                        set_null_on_selection(d3.selectAll('svg g.nv-legendWrap'));
                        set_null_on_selection(d3.selectAll('svg g.nv-controlWrap'));
                        set_null_on_selection(d3.selectAll('svg g.nv-wrap'));
                        set_null_on_selection(d3.selectAll('svg g.nvd3'));

                        scope.current_chart = null;

                        window.nv.charts = {};
                        window.nv.graphs = [];
                        window.nv.logs = {};
                        window.onresize = null;
                    }
                    if (url !== '') {
                        //console.log('updating profile graph...');
                        busy = true;

                        getData(url, addGraph);
                    }
                });  // scope.watch
            }
        }
    });
