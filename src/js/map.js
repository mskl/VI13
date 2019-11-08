var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();
var world;

var promises = [
    d3.json("data/map/countries-10m.json")
];

var projection = d3.geoMercator().center([10,52]).scale(600);

path = path.projection(projection);

// Load all of the promises and then call the ready funtion
Promise.all(promises).then(ready);

function ready([wr], reject) {
    world = wr;
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
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