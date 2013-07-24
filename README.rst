nxt-graph
==========================================

Introduction
------------

Generic javascript graph library.

Prerequisities
--------------

You must use AngularJS in order to use nxt-graph (get it from elsewhere). Also include d3, nv, nxt-graph js and css (embedded in nxt-graph) in your document::


  <script type="text/javascript" src="{{ STATIC_URL }}angular/angular.min.js"></script>
  <script type="text/javascript" src="{{ STATIC_URL }}vendor/d3js/d3.v3.min.js?{{ random_string }}"></script>
  <script type="text/javascript" src="{{ STATIC_URL }}vendor/nvd3/nv.d3.js?{{ random_string }}"></script>
  <script type="text/javascript" src="{{ STATIC_URL }}nxt_graph/nxt-graph.js?{{ random_string }}"></script>
  <link href="{{ STATIC_URL }}vendor/nvd3/source/nv.d3.css" rel="stylesheet"/>




Usage
-----

Make directives and modify the infourl from Angular. The nxt-timeseries and nxt-profile will automagically become fancy nv d3 graphs! Even more: every time when the inner url is updated, the graph will refresh itself. This way you can get realtime moving graphs!


Example::


  app.controller("InfoPoint", ["$scope", function($scope) {
      $scope.$on("infopoint", function(message, content) {
          $scope.$apply(function() {
              console.log("open box infopoint");
              var lonlat = content.point;
              var $layer = document.getElementsByClassName("workspace-wms-layer")[0];  // there is only one
              $scope.infourl = $layer.dataset['workspaceWmsUrl'].split('/wms')[0] + '/data?' + "REQUEST=gettimeseries&LAYERS=" + content.loaded_model + "&SRS=EPSG:4326&POINT="+lonlat.lng.toString() + ',' + lonlat.lat.toString();
          });        
      });

  }]);      


Timeseries
==========

Example::

  <nxt-timeseries url="{[{ infourl }]}"></nxt-timeseries>

The url must contain data in the format::

  {"timeseries": [["2012-01-01T00:01:00", -0.946], ["2012-01-01T00:02:00", -0.946], 
                  ["2012-01-01T00:03:00", -0.946], ["2012-01-01T00:04:00", -0.946], 
                  ["2012-01-01T00:05:00", -0.946], ["2012-01-01T00:06:00", -0.946]]}


Profiles
========

Example::

  <nxt-profile url="{[{ infourl }]}"></nxt-profile>

The url must contain data in the format::

  {"depth": [[0.0, 0.2673], [1e-05, 0.2673], [3e-05, 0.2673], [3e-05, 0.2673], [4e-05, 0.2773]], 
   "waterheight": [[0.0, 0.2673], [1e-05, 0.2673], [3e-05, 0.2673], [3e-05, 0.2673], [4e-05, 0.2773]], 
   "bathymetry": [[0.0, 0.2673], [1e-05, 0.2673], [3e-05, 0.2673], [3e-05, 0.2673], [4e-05, 0.2773]]}
