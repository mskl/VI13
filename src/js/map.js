// numeric -> ratio
let mapData = d3.map();
let countryData = d3.map();
let codeToNumeric = d3.map();

let mapSVG = d3.select("#map > svg"),
    width = +mapSVG.style("width").replace("px", ""),
    height = +mapSVG.style("height").replace("px", "");

// Square around the whole SVG
mapSVG.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .attr("stroke", "black");

let projection = d3.geoTransverseMercator().center([18, 49]).scale(600).rotate([-10, 0, 0]);
let path = d3.geoPath().projection(projection);
let color = d3.scaleSequential().domain([0, 4]).interpolator(d3.interpolateReds);

let countryCenterCoordinates = d3.map();    // Center of country
d3.csv("data/map/countrypos.csv", function (d) {
    countryCenterCoordinates.set(d.country.toLowerCase(), {"long": d.long, "lat": d.lat})
});

let countryStudentFlows;                    // "Correlation" counts for each pair
d3.csv("data/map/corstudentcount.csv").then(function (data) {
    countryStudentFlows = data
});

let detailedCoordinates;                    // Coords for each university
d3.csv("data/map/coordinates.csv").then(function (data) {
    detailedCoordinates = data;
});

let promises = [
    // The outline of world states
    d3.json("data/map/world-50m.v1.json"),
    // The data to be used in the map
    d3.csv("data/map/chloroplet-ratio.csv", function (d) {
        mapData.set(d.numeric, parseFloat(d.receiving) / parseFloat(d.sending));
        countryData.set(d.numeric, d);
        codeToNumeric.set(d.country.toLowerCase(), d.numeric);
    })
];

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
    // Add the states to a country dropdown menu
    populateCountryList();

    // Draw the map outline
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
            } catch (error) {
                /* console.log(d.id, error) */
            }
        })
        .on('click', function (d) {
            if (codeToNumeric.get(selectedCountry) === d.id) {
                events.call('stateSelectedEvent', "", "");
            } else {
                let countryShortcut = countryData.get(d.id).country.toLowerCase();
                events.call('stateSelectedEvent', countryShortcut, countryShortcut);
            }
        })
        .on('mouseover', function (d) {
            try {
                let code = countryData.get(d.id).country.toLowerCase();
                events.call('stateHoverEvent', code, code);
            } catch (error) {
                /* console.log(d.id, error); */
            }

        })
        .attr("d", path)
        .append("title").text(function(d) {
            try {
                return countryData.get(d.id).country + ": " + mapData.get(d.id).toFixed(2);
            } catch (error) {
                /* console.log(d.id, error); */

            }
        });
}

function clearLines() {
    try {
        document.querySelector("#map > svg > g.lines").remove();
    } catch (error) {
        /* console.log(d.id, error); */
    }
}

function drawLines2(code="at") {
    // Clear all of the lines in the map
    clearLines();

    // Convert the country shortcode into a numeric
    let numeric = codeToNumeric.get(code);

    let incoming = d3.map();
    countryStudentFlows.map(function(d) {incoming.set(d["country"], d[code])});
    let incomingArray = incoming.values().map(function (d, i) {
        return [Object.keys(incoming)[i], d]
    });

    let outgoing = d3.map(countryStudentFlows.filter(function (d) {return d.country === code})[0]);
    delete outgoing["country"];
    let outgoingArray = outgoing.values().map(function (d, i) {
        return [Object.keys(outgoing)[i], d]
    });

    if (studentDirection === "incoming") {
        mapSVG.append("g")
            .attr("class", "lines")
            .selectAll("line")
            .data(incomingArray)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                return projection([countryCenterCoordinates.get(code).lat, countryCenterCoordinates.get(code).long])[0];
            })
            .attr("y1", function (d) {
                return projection([countryCenterCoordinates.get(code).lat, countryCenterCoordinates.get(code).long])[1];
            })
            .attr("x2", function (d) {
                return projection([countryCenterCoordinates.get(d[0].replace("$", "")).lat,
                    countryCenterCoordinates.get(d[0].replace("$", "")).long])[0];
            })
            .attr("y2", function (d) {
                return projection([countryCenterCoordinates.get(d[0].replace("$", "")).lat,
                    countryCenterCoordinates.get(d[0].replace("$", "")).long])[1];
            })
            .attr("stroke", "rgba(0, 0, 0, 1)")
            .attr("stroke-width", function (d) {
                return d[1] / 100.0;
            })
            .attr("pointer-events", "none");
    } else {

    }
}

function drawLines(countryShortcut) {
    // Clear all of the lines in the map
    clearLines();

    // Convert the country shortcode into a numeric
    let countryCode = codeToNumeric.get(countryShortcut);

    mapSVG.append("g")
        .attr("class", "lines")
        .selectAll("line")
        .data(detailedCoordinates.filter(function(d){
            if (studentDirection === "incoming") {
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