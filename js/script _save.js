var field = 0;

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
            console.log(i);
            console.log(d);
            update(i);
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
            d3.select(".opacity_corr").style('fill-opacity', 1);
            d3.select(".opacity_corr2").style('fill-opacity', 1);
        })
        .on('mouseout', function(d, i) {
            d3.selectAll('path')
	            .style({
                    'fill-opacity':.7
                });
            d3.select(".opacity_corr").style('fill-opacity', 1);
            d3.select(".opacity_corr2").style('fill-opacity', 1);
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
var width = 420,//maximum width of a bar
        barHeight = 20;//barheight

    var x = d3.scale.linear()//define scale type
        .range([0, width]);//define range, so it's adapted to the size

    var chart = d3.select(".chart")//css3 selector
        .attr("width", width);//apply style to <svg class="chart">


function barchart(field){

    console.log("the current field is: " + field);//control print to console

    d3.tsv("./data/data_dem.tsv", type, function(error, data) {//open csv file
        x.domain([0, d3.max(data, function(d) { return d[field]; })]);
        console.log("the file data.tsv is now loaded");

        chart.attr("height", barHeight * data.length);

        var bar = chart.selectAll("g")
            .data(data)

        bar.exit()
            .remove();

        bar.enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

        bar.append("rect")
    //        .transition()
    //        .delay(100)
    //        .duration(500)
    //        .ease("linear")
            .attr("width", function(d) { return x(d[field]); })
            .attr("height", barHeight - 1);

        bar.append("text")
            .attr("x", function(d) { return x(d[field] - 3); })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return d[field]; });
    });
}

function type(d) {
  d[field] = +d[field]; // coerce to number
  return d;
}

function update(field) {
    console.log("An update was triggered!");
    console.log("the current field is: " + field);//control print to console

    d3.tsv("./data/data_dem.tsv", type, function(error, data) {//open csv file
        x.domain([0, d3.max(data, function(d) { return d[field]; })]);
        console.log("the file data.tsv is now loaded");

        chart.attr("height", barHeight * data.length);

        var bar = chart.selectAll("g")
            .data(data)

        bar.exit()
            .remove();

        bar.enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

        bar.selectAll("rect")
            .transition()
            .delay(50)
            .duration(200)
            .ease("linear")
            .attr("width", function(d) { return x(d[field]); })
            .attr("height", barHeight - 1);

        bar.selectAll("text")
            .attr("x", function(d) { return x(d[field] - 1); })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) { return d[field]; });
    });
};

window.onload = barchart(0);