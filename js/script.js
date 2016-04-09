/* ############### map ###############*/

var width = 960,
    height = 500;

var radius = d3.scale.sqrt()
    .domain([0, 1e6])
    .range([0, 10]);

var path = d3.geo.path();

//var color = d3.scale.category20();
var color = d3.scale.linear().domain([0,33]).range(['red', 'blue']);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "us-state-centroids.json")
    .await(ready);

function ready(error, us, centroid) {
    var countries = topojson.feature(us, us.objects.states).features,
        neighbors = topojson.neighbors(us.objects.states.geometries);

    svg.selectAll("states")
        .data(countries)
        .enter().insert("path", ".graticule")
        .attr("class", "states")
        .attr("d", path)
    //    .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); })
		.style('fill', function(d,i) {return color(i)})
        .on('mouseover', function(d, i) {

        	var currentState = this;
        	d3.select(this).style('fill-opacity', 1);
/*                var thoseStates = d3
                        .selectAll('path')[0]
                        .filter(function(state) {
                            return state !== currentState;
                        });

                d3.selectAll(thoseStates)
                        .style({
                            'fill-opacity':.5
                        });
                })/**/
        })
        .on('mouseout', function(d, i) {
        	console.log(i);
        	console.log(d);
            d3.selectAll('path')
	            .style({
                    'fill-opacity':.7
                });
        });
/*
        var paths = svg.append("path")
                .attr("class", "states")
                .datum(topojson.feature(us, us.objects.states))
                .attr("d", path)
                .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); })
                .on('mouseover', function(d, i) {

                var currentState = this;
                var thoseStates = d3
                        .selectAll('path')[0]
                        .filter(function(state) {
                            return state !== currentState;
                        });

                d3.selectAll(thoseStates)
                        .transition()
                        .duration(300)
                        .style({
                            'stroke-opacity': 1,
                            'stroke': '#f00'
                        });

        });


        svg.selectAll(".symbol")
                .data(centroid.features.sort(function(a, b) { return b.properties.population - a.properties.population; }))
                .enter().append("path")
                .attr("class", "symbol")
                .attr("d", path.pointRadius(function(d) { return radius(d.properties.population); }));

    }/**/
}

/* ############### barchart ###############*/

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width);

d3.tsv("data.tsv", type, function(error, data) {
  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d.value) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.value; });
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}