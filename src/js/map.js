var mapData = d3.map();
var countryNames = d3.map();

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Square around the whole SVG
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .attr("stroke", "black");

// Setup the mercator projection into the middle of the Europe
var path = d3.geoPath().projection(d3.geoTransverseMercator().center([18,54]).scale(750).rotate([-10,0,0]));

var promises = [
    // The outline of world states
    d3.json("data/map/world-50m.v1.json"),
    // The data to be used in the map
    d3.csv("data/map/chloroplet-ratio.csv", function(d) {
        mapData.set(d.numeric, parseFloat(d.receiving) / parseFloat(d.sending));
        countryNames.set(d.numeric, d.name);
    }),
];

// The color scheme
var color = d3.scaleSequential().domain([0, 4])
     .interpolator(d3.interpolateReds);

// Editable options
let legendWidth = 220;
let legendTicks = 10;
let legendMin = 0;
let legendMax = 4;
let legendPosY = 20;

// Calculated stuff
let legendPosX = width - legendWidth - 20;
let tickWidth = legendWidth / legendTicks;
let legendHeight = tickWidth / 2;

// Create the legend
let legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + legendPosX + ", " + legendPosY + ")");

legend.selectAll("rect")
    .data(d3.range(legendMin, legendMax, (legendMax - legendMin) / legendTicks))
    .enter()
    .append("rect")
    .attr("height", legendHeight)
    .attr("x", function (d, i) {
        return i*tickWidth;
    })
    .attr("width", tickWidth)
    .attr("fill", function(d) {
        return color(d);
    });

legend.selectAll("text")
    .data(d3.range(legendMin, legendMax, (legendMax - legendMin) / legendTicks))
    .enter()
    .append("text")
    .attr("font-size", 8)
    .attr("y", legendHeight - 3)
    .attr("x", function (d, i) {
        return i*tickWidth + 3;
    })
    .text(function (d, i) {
        if (i % 3 == 0) {
            return d.toFixed(1);
        } else {
            return "";
        }
    });

legend.append("text")
    .attr("font-size", 11)
    .attr("y", -3)
    .attr("x", 3)
    .text("number of students incoming per one outgoing");

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
                // console.log(d.id, error);
            }
        }).attr("d", path)
        .append("title").text(function(d) {
            try {
                return countryNames.get(d.id) + ": " + mapData.get(d.id).toFixed(2);
            } catch (error) {
                // console.log(d.id, error);
            }
        });
}