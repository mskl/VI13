let mapData = d3.map();
let countryNames = d3.map();
let coordinates = [];

let mapSVG = d3.select("#map > svg"),
    width = +mapSVG.style("width").replace("px", ""),
    height = +mapSVG.style("height").replace("px", "");

// Square around the whole SVG
mapSVG.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .attr("stroke", "black");

let selectedCountry = null;
let projection = d3.geoTransverseMercator().center([18, 49]).scale(600).rotate([-10, 0, 0]);
let path = d3.geoPath().projection(projection);

let promises = [
    // The outline of world states
    d3.json("data/map/world-50m.v1.json"),
    // The data to be used in the map
    d3.csv("data/map/chloroplet-ratio.csv", function (d) {
        mapData.set(d.numeric, parseFloat(d.receiving) / parseFloat(d.sending));
        countryNames.set(d.numeric, d.name);
    }),
    // The coordinates
    d3.csv("data/arrowmap/coordinates.csv", function(d) {
        coordinates.push(d);
    })
];

// The color scheme
let color = d3.scaleSequential().domain([0, 4])
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
drawLegend();

// Load all of the promises and then call the ready funtion
Promise.all(promises).then(ready);

function ready([outline], reject) {
    drawOutline(outline);
}

function drawOutline(outline) {
    mapSVG.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(outline, outline.objects.countries).features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            try {
                return color(mapData.get(d.id));
            } catch (error) { /* console.log(d.id, error) */ }
        })
        .on('click', function (d) {
            if (selectedCountry === d.id) {
                selectedCountry = null;
                clearLines();
            } else {
                selectedCountry = d.id;
                drawLines(selectedCountry);
            }
        })
        .attr("d", path)
        .append("title").text(function(d) {
        try {
            return countryNames.get(d.id) + ": " + mapData.get(d.id).toFixed(2);
        } catch (error) { /* console.log(d.id, error); */ }
    });
}

function clearLines() {
    try {
        document.querySelector("#map > svg > g.lines").remove();
    } catch (error) { }
}

function drawLines(countryCode) {
    clearLines();

    mapSVG.append("g")
        .attr("class", "lines")
        .selectAll("line")
        .data(coordinates.filter(function(d){
            if (studentDirection === studentDirectionEnum.incoming) {
                return d.receivingNumeric === countryCode;
            } else {
                return d.sendingNumeric === countryCode;
            }

        }))
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return projection([d.sendLon, d.sendLat])[0]
        })
        .attr("y1", function (d) {
            return projection([d.sendLon, d.sendLat])[1]
        })
        .attr("x2", function (d) {
            return projection([d.receiveLon, d.receiveLat])[0]
        })
        .attr("y2", function (d) {
            return projection([d.receiveLon, d.receiveLat])[1]
        })
        .attr("stroke", "rgba(0, 0, 0, 0.02)")
        .attr("stroke-width", function () {
            return 1;
        })
        .attr("pointer-events", "none");
}

function drawLegend() {
    let legend = mapSVG.append("g")
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
        .attr("fill", "black")
        .attr("y", legendHeight - 3)
        .attr("x", function (d, i) {
            return i*tickWidth + 3;
        })
        .text(function (d, i) {
            if (i % 3 === 0) {
                return d.toFixed(1);
            } else {
                return "";
            }
        });

    legend.append("text")
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("y", -3)
        .attr("x", 3)
        .text("number of students incoming per one outgoing");
}