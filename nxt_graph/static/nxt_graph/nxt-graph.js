//nxt-graph.js

// create the directives as re-usable components
app
    .directive('nxtTimeseries', function($http) {
        var busy = false;
        var readyForNext = null;
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'url': '@'
            },
            template: '<svg></svg>',
            link: function(scope, element, attrs) {
                var getData = function(url, fn){
                    $.ajax({
                            url: url,
                            success: function(data) {
                                var formatted = [{
                                            "key": "timeseries", 
                                            "values": data['timeseries']
                                        }];
                                console.log('formatted 1', formatted, data);
                                fn(formatted);
                                // TODO: possibly a user does not see the very
                                // latest graph...

                                // if (readyForNext !== null) {
                                //     console.log("ReadyForNext!!");
                                //     getData(readyForNext, addGraph);
                                //     readyForNext = null;
                                // } 
                                setTimeout(function() {
                                    busy = false;
                                }, 600);  // wait a while before accepting new
                            }
                    });  // $.ajax
                }
                var addGraph = function(formatted) {
                    nv.addGraph(function() {
                        //console.log('scope.url2 ', scope.url, '-', scope_url);
                        //console.log('formatted 2', formatted);                    

                        //console.log("dataaa", data, formatted);
                        var chart = nv.models.lineChart()
                                      .x(function(d) { return Date.parse(d[0]) })
                                      .y(function(d) { return d[1] })
                                      .clipEdge(true);

                        chart.xAxis
                            .tickFormat(function(d) {
                             return d3.time.format('%X')(new Date(d)) 
                           });

                        chart.yAxis
                            .tickFormat(d3.format(',.2f'));

                        //console.log('element', $(element).attr('id'), element);
                        // Make sure your context as an id or so...
                        d3.select(element.context)
                          .datum(formatted)
                            .transition().duration(500).call(chart);

                        nv.utils.windowResize(chart.update);
                        //console.log('busy? ', busy);
                        return chart;

                    });  // nv.addGraph
                };

                scope.$watch('url', function (url) {
                    //if ((url !== '') && (!busy)) {
                    if ((url !== '') ) {
                        //console.log("time series whahaha", url);
                        if (busy) {
                            // We don't have time for it now, but later you want
                            // the latest available graph.
                            console.log("timeseries: busy!!"); 
                            readyForNext = url;
                            //showalert("Skipped ", url);
                            return;
                        }
                        // console.log('Get ready for the graph update');
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
                'url': '@'
            },
            template: '<svg></svg>',
            link: function(scope, element, attrs) {
                var getData = function(url, fn){
                    $.ajax({
                            url: url,
                            success: function(data) {
                                var formatted = [{
                                  "key": "bathymetry", 
                                  "values": data.bathymetry
                                },{
                                  "key": "depth", 
                                  "values": data.depth
                                }];
                                //console.log('formatte 1', formatted, data);
                                fn(formatted);
                                setTimeout(function() {
                                    busy = false;
                                }, 600);
                            }
                    });  // $.ajax
                }
                var addGraph = function(formatted) {
                    nv.addGraph(function() {
                        //console.log('scope.url2 ', scope.url, '-', scope_url);
                        //console.log('formatted 2', formatted);
                        
                        //console.log("dataaa", data, formatted);
                        // 2 * pi * r / 360 = 111 km per degrees, approximately
                        var chart = nv.models.stackedAreaChart()
                        //var chart = nv.models.lineChart()
                                      .x(function(d) { return 111*d[0] })
                                      .y(function(d) { return d[1] })
                                      .clipEdge(true);

                        chart.xAxis
                            .tickFormat(d3.format(',.2f'));

                        chart.yAxis
                            .tickFormat(d3.format(',.2f'));

                        chart.showControls(false);
                        chart.yDomain([0, 3]);

                        //console.log('element', $(element).attr('id'), element);
                        // Make sure your context as an id or so...
                        d3.select(element.context)
                          .datum(formatted)
                            .transition().duration(500).call(chart);

                        nv.utils.windowResize(chart.update);
                        return chart;

                    });  // nv.addGraph
                };

                scope.$watch('url', function (url) {
                    if (busy) {
                        // Only update if an old request is already finished
                        //console.log("profile: busy!!"); 
                        return;
                    }
                    if (url !== '') {
                        //console.log('updating profile graph...');
                        busy = true;
                        getData(url, addGraph);
                    }
                    //setTimeout(function(){busy = false;}, 5000);
                });  // scope.watch
            }
        }
    });
