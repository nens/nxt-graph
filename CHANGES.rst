Changelog of nxt-graph
===================================================


0.16 (unreleased)
-----------------

- Nothing changed yet.


0.15 (2015-01-14)
-----------------

- Update bootstrap.py.

- Adjusted the time series so that small changes are not magnified.


0.14 (2014-11-27)
-----------------

- Remove objects from dom to prevent memory leaks, as well as not adding circles
 (patched included nvd3).

- Updated crosssection as well as timeseries graphs.


0.12 (2014-10-07)
-----------------

- Fixed default profile in case of server errors.


0.11 (2014-07-14)
-----------------

- Better y scaling for profiles.


0.10 (2014-03-31)
-----------------

- Changed tooltip for profile.

- Removed carsten timeseries.


0.9 (2014-03-13)
----------------

- Changed tooltip display.


0.8 (2014-03-12)
----------------

- Changed input for nxt crosssection: added ground water and renamed fields.


0.7 (2014-02-17)
----------------

- Added requestAnimationFrame. There is still a problem when requesting graphs repeatedly.


0.6 (2014-02-06)
----------------

- Bugfix and re-enabled busy=true.


0.5 (2014-02-05)
----------------

- Disabled 'busy = true': multiple graphs in one popup are now possible, because of this.


0.4 (2014-01-13)
----------------

- Enabled 'readyForNext': graphs are now always updated to the newest available version.


0.3 (2013-09-19)
----------------

- Changed axis label Time (HH:MM) -> Time.

- Changed water/land to depth/elevation.


0.2 (2013-08-20)
----------------

- Improvements in axis and layout.

- Added nxtCarstenTimeSeries.

- Slightly changed nv.d3.css to prevent slash with leaflet.


0.1 (2013-07-29)
----------------

- You can look at time series and cross sections, they will update every time when the url is updated.

- Initial project structure created with nensskel 1.32.
