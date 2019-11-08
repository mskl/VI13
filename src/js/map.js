var mapData = d3.map();
var countryNames = d3.map();

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Setup the mercator projection into the middle of the Europe
var path = d3.geoPath().projection(d3.geoTransverseMercator().center([15,52]).scale(750).rotate([-10,0,0]));

var promises = [
    // The outline of world states
    d3.json("data/map/countries-10m.json"),
    // The data to be used in the map
    d3.csv("data/map/chloroplet-ratio.csv", function(d) {
        mapData.set(d.numeric, parseFloat(d.receiving) / parseFloat(d.sending));
        countryNames.set(d.numeric, d.name);
    }),
];

// The color scheme
var color = d3.scaleThreshold()
    .domain(d3.range(0, 10))
    .range(d3.schemeBlues[9]);

/*
var x = d3.scaleLinear().domain([0, 10]).rangeRound([600, 860]);
var g = svg.append("g").attr("class", "key").attr("transform", "translate(0,40)");
g.selectAll("rect")
    .data(color.range().map(function(d) {
        d = color.invertExtent(d);
        if (d[0] == null)
            d[0] = x.domain()[0];
        if (d[1] == null)
            d[1] = x.domain()[1];
        return d;
    }))
    .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });
g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Unemployment rate");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x : x + "%"; })
    .tickValues(color.domain()))
    .select(".domain")
    .remove();
 */

// Load all of the promises and then call the ready funtion
Promise.all(promises).then(ready);

function ready([outline], reject) {
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(outline, outline.objects.countries).features)
        .enter().append("path")
        .attr("fill", function (d) {
            try {
                let ratio = mapData.get(d.id);
                return color(ratio);
            } catch (error) {
                console.log(error);
            }
        }).attr("d", path)
        .append("title")
        .text(function(d) {
            try {
                return countryNames.get(d.id) + ": " + mapData.get(d.id).toFixed(2);
            } catch (error) {
                console.log(error);
            }
        });

}