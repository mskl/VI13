var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();
var ms;

var promises = [
    // The map itself
    d3.json("data/map/us-10m.v1.json"),
    // d3.json("data/map/world-110m.v1.json"),
];

// Load all of the promises and then call the ready funtion
Promise.all(promises).then(ready);

function ready([mapshapes], reject) {
    ms = mapshapes;
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(mapshapes, mapshapes.objects.counties).features)
        .enter().append("path")
        .attr("fill", "rgb(155,23,42)")
        .attr("d", path);
}

/* var stateNames = d3.map();
// The state names
d3.tsv("data/map/us-state-names.tsv", function(d) {
    stateNames.set(d.id, d.name)
}),

// The map
d3.tsv("data/map/map.tsv", function(d) {
    chloromap.set(d.name, +d.value);
})*/