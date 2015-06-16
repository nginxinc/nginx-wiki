RRD Graph
=========

= mod_rrd_graph =

''Note: this module is not distributed with the Nginx source. Installation instructions are [[#Installation|below]] .''

[http://oss.oetiker.ch/rrdtool/ RRDtool]  stores and graphs time-series data. '''<code>mod_rrd_graph</code>''' provides an HTTP interface to RRDtool's graphing facilities. By linking RRDtool directly into Nginx, ngx_rrd_graph is faster than scripts and CGIs with similar purposes.

== Directives ==
* [[#rrd_graph|rrd_graph]]
* [[#rrd_graph_root|rrd_graph_root]]

== rrd_graph ==
'''syntax:''' ''rrd_graph''

'''default:''' ''n/a''

'''context:''' ''location''

ngx_rrd_graph can be enabled at a particular location with the "rrd_graph" directive, like so:

<geshi lang="nginx">
location /rrdtool {
    rrd_graph;
}
</geshi>

RRDtool graphing commands can then be appended to that location in request URLs. The syntax is just the same as the arguments to the "rrdtool graph" command, omitting the filename. (Refer to [http://oss.oetiker.ch/rrdtool/doc/rrdgraph.en.html rrdgraph(1)] .) These commands should be URL-encoded, so that this command-line invocation:

 rrdtool graph --start now-300s \
 --end now \
 DEF:ds0=test.rrd:reading:AVERAGE \
 LINE1:ds0#00FF00


becomes:

http://mysite.com/rrdtool--start%20now-300s%20--end%20now%20DEF%3Ads0%3Dtest.rrd%3Areading%3AAVERAGE%20LINE1%3Ads0%2300FF00

The module supports all the features of your copy of RRDtool. It can output PNG, PDF, SVG, and EPS graphics (see the --imgformat option of [http://oss.oetiker.ch/rrdtool/doc/rrdgraph.en.html rrdgraph(1)]).

== rrd_graph_root ==

'''syntax:''' ''rrd_graph_root /path/to/rrds''

'''default:''' ''""''

'''context:''' ''location''

If you'd prefer not to provide absolute paths to files referenced in DEF commands, you may supply a root directory with the "rrd_graph_root" directive. Files mentioned in DEF commands will be automatically prefixed with the value of rrd_graph_root.


== Installation ==

ngx_rrd_graph requires [http://oss.oetiker.ch/rrdtool-trac/wiki/RRDtool13 RRDtool 1.3]  or later.

After installing RRDtool, download the mod_rrd_graph module here: ( [[Image:Mod_rrd_graph-0.2.0.tar.gz]] )

Extract the archive and add the following option to your Nginx ./configure command:

 --add-module=/path/to/mod_rrd_graph

Then "make" and "make install" as usual.

== Bugs ==

Please report bugs to [http://www.evanmiller.org/ Evan Miller].
