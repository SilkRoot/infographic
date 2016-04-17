/* ############### creating color array ###############*/
var ids_arr = ['0','21','19','31','25','34','1','26','38','12','3','8','18','20','9','28','13','11','50','22','2','32','49','30','5','10','4','27','37','15','7','6','29','14','16','17','23','40','24','36','33','48','41','39','42','47','45','43','44','46','78','72'];
var color_arr = ['#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#202C55','#A0A0A0','#A0A0A0'];
var colors_arr = [];
var colors_arr_rep = ['#A0A0A0','#A0A0A0','#EFE74B','#A0A0A0','202C55','#EFE74B','#542145','#EFE74B','#A0A0A0','#A0A0A0','#542145','#542145','#A0A0A0','#EFE74B','#542145','#A0A0A0','#542145','#542145','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#EFE74B','#542145','#20512C','#A0A0A0','#A0A0A0','#A0A0A0','#A0A0A0','#542145','#EFE74B','#A0A0A0','#A0A0A0','#542145','#542145','#542145','#EFE74B','#A0A0A0','#542145','#542145','#EFE74B','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#542145','#EFE74B'];
colors_arr_rep[72] = '#A0A0A0';
colors_arr_rep[78] = '#A0A0A0';
var h = "";
var g = 0;
var arrayLength = ids_arr.length;
for (var j = 0; j < arrayLength; j++) {
    g = ids_arr[j];
    h = color_arr[j];
    colors_arr[g] = h;
}

for(var j = 0; j < colors_arr.length; j++){
    console.log(j + " = " + colors_arr[j]);
}

var viewportwidth = window.innerWidth;
var viewportheight = window.innerHeight;

var field = 0;

/* ############### map ###############*/

var width = 960,
    height = 500;

var path = d3.geo.path();

var color;

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
        .style('fill', function(d,i) {
            return colors_arr_rep[i]
        })
        .on('mouseover', function(d, i) {

        	var currentState = this;
        	d3.select(this).style('fill-opacity', 1);
            console.log(i);
            console.log(d);
            update(i);
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
}

/* ############### barchart ###############*/
var width_chart = 820,//maximum width of a bar
    barHeight = 20;//barheight

var x = d3.scale.linear()//define scale type
    .range([0, width_chart]);//define range, so it's adapted to the size

var chart = d3.select(".chart")//css3 selector
    .attr("width", width_chart);//apply style to <svg class="chart">

function barchart(field){

    console.log("the current field is: " + field);//control print to console

    d3.tsv("./data/data_rep.tsv", type, function(error, data) {//open csv file
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
            .transition()
            .delay(100)
            .duration(500)
            .ease("linear")
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

    d3.tsv("./data/data_rep.tsv", type, function(error, data) {//open csv file
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