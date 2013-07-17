//nxt-graph.js

// create the directives as re-usable components
app
    .directive('nxtTimeseries', function($http) {
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
                            }
                    });  // $.ajax
                }
                var addGraph = function(formatted) {
                    nv.addGraph(function() {
                        //console.log('scope.url2 ', scope.url, '-', scope_url);
                    console.log('formatted 2', formatted);
                        

                            //console.log("dataaa", data, formatted);
                            var chart = nv.models.lineChart()
                                          .x(function(d) { return Date.parse(d[0]) })
                                          .y(function(d) { return d[1] })
                                          .clipEdge(true);

                            chart.xAxis
                                .tickFormat(function(d) {
                                 return d3.time.format('%x')(new Date(d)) 
                               });

                            chart.yAxis
                                .tickFormat(d3.format(',.2f'));

                            console.log('element', $(element).attr('id'), element);
                            // Make sure your context as an id or so...
                            d3.select(element.context)
                              .datum(formatted)
                                .transition().duration(500).call(chart);

                            nv.utils.windowResize(chart.update);

                            return chart;

                    });  // nv.addGraph
                };

                scope.$watch('url', function (url) {
                    if (url !== '') {
                        getData(url, addGraph);
                    }
                });  // scope.watch
            }
        }
    });

app
    .directive('nxtCrossSection', function($http) {
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
                                  "key": "depth", 
                                  "values": data.depth
                                }];
                                console.log('formatted 1', formatted, data);
                                fn(formatted);
                            }
                    });  // $.ajax
                }
                var addGraph = function(formatted) {
                    nv.addGraph(function() {
                        //console.log('scope.url2 ', scope.url, '-', scope_url);
                    console.log('formatted 2', formatted);
                        

                            //console.log("dataaa", data, formatted);
                            var chart = nv.models.lineChart()
                                          .x(function(d) { return d[0] })
                                          .y(function(d) { return d[1] })
                                          .clipEdge(true);

                            chart.xAxis
                                .tickFormat(d3.format(',.2f'));

                            chart.yAxis
                                .tickFormat(d3.format(',.2f'));

                            console.log('element', $(element).attr('id'), element);
                            // Make sure your context as an id or so...
                            d3.select(element.context)
                              .datum(formatted)
                                .transition().duration(500).call(chart);

                            nv.utils.windowResize(chart.update);

                            return chart;

                    });  // nv.addGraph
                };

                scope.$watch('url', function (url) {
                    if (url !== '') {
                        getData(url, addGraph);
                    }
                });  // scope.watch
            }
        }
    });
