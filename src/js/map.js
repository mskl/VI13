var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var chloromap = d3.map();
var stateNames = d3.map();
var path = d3.geoPath();

var promises = [
    // The map itself
    d3.json("data/map/us-10m.v1.json"),

    // The state names
    d3.tsv("data/map/us-state-names.tsv", function(d) {
        stateNames.set(d.id, d.name)
    }),

    // The map
    d3.tsv("data/map/map.tsv", function(d) {
        chloromap.set(d.name, +d.value);
    })
];

// Load all of the promises and then call the ready funtion
Promise.all(promises).then(ready);

function ready([us], reject) {
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("fill", "rgb(155, 102, 102)")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);
}