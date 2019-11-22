let mapSVG = d3.select("#map > svg"),
    width = +mapSVG.style("width").replace("px", ""),
    height = +mapSVG.style("height").replace("px", "");

// Square around the whole SVG
mapSVG.append("rect")
    .attr("fill", "transparent")
    .attr("stroke", "black");

let countryGroup = mapSVG.append("g")
    .attr("class", "counties");

let linesGroup = mapSVG.append("g")
    .attr("class", "lines");

let mapProjection = d3.geoTransverseMercator().center([18, 49]).scale(600).rotate([-10, 0, 0]);
let mapPath = d3.geoPath().projection(mapProjection);
let mapColor = d3.scaleSequential().domain([0, 4]).interpolator(d3.interpolateReds);

// "Correlation" counts for each pair
let countryStudentFlows;
let corStudentCountPromise = d3.csv("data/map/corstudentcount.csv").then(data => {
    countryStudentFlows = data
});

// Coords for each university
let detailedCoordinates;
let coordinatesPromise = d3.csv("data/map/coordinates.csv").then(data => {
    detailedCoordinates = data;
});

let codeToNumeric = d3.map();
let numericToCode = d3.map();
let countryData = d3.map();
let ratioPromise = d3.csv("data/map/chloroplet-ratio.csv", d => {
    d["country"] = d.country.toLowerCase();
    d["recSendRatio"] = parseFloat(d.receiving) / parseFloat(d.sending);
    countryData.set(d.country, d);

    codeToNumeric.set(d.country, d.numeric);
    numericToCode.set(d.numeric, d.country);
});

let countryPosPromise = d3.csv("data/map/countrypos.csv", d => {
    try {
        countryData.get(d.country.toLowerCase())["country_pos"] = {"long": d.long, "lat": d.lat}
    } catch (e) {
        // Some of the countries are not defined in the countryData so this fails
    }
});

let chloroplethDataPromise = d3.json("data/map/world-50m.v1.json").then(outline=>{
    topojson.feature(outline, outline.objects.countries).features.map((feat) => {
        try {
            let featCode = numericToCode.get(feat.id);
            countryData.get(featCode)["topo"] = feat;
        } catch (e) {
            // Some of the countries are not defined in the countryData so this fails
        }
    });
});

// After all of the premises are loaded, draw the shit.
Promise.all([countryPosPromise, corStudentCountPromise, coordinatesPromise, ratioPromise, chloroplethDataPromise])
    .then(() => {
        // Populate the dropdown menu
        populateCountryList();
        // Create the legend
        drawLegend();
        // Draw the chloropleth
        drawChloropleth();
    });

function populateCountryList() {
    let select = document.getElementById("dropdown_country");

    for (let i = 0; i < countryData.values().length; i++) {
        let opt = countryData.values()[i];
        let el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.country.toLocaleLowerCase();
        select.appendChild(el);
    }
}

function highlightState(code) {
    drawChloropleth();
}

function unHiglightState(code) {
    drawChloropleth();
}

function drawChloropleth() {
    let countrySelection = countryGroup.selectAll("path")
        .data(countryData.values());

    // Enter
    countrySelection.enter()
        .append("path")
        .attr("stroke-width", 0)
        .attr("d", d => mapPath(d.topo))
        .attr("fill", d => mapColor(d.recSendRatio))
        .on('mouseover', d => events.call('stateOnMouseOver', d.country, d.country))
        .on('mouseout', d => events.call('stateOnMouseOut', d.country, d.country))
        .on('click', d => selectedCountry === d.country
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.country, d.country))
        .append("title").text(d => {
            try {
                return d.country + ": " + d.recSendRatio.toFixed(2);
            } catch (e) {
                return "unknown";
            }
        });

    // Update
    countrySelection
        .attr("stroke-width", d => d.country === selectedCountry ? 1 : 0)
        .attr("fill", d => {
            if (selectedCountry === "") {
                return mapColor(d.recSendRatio);
            } else {
                if (d.country === selectedCountry) {
                    return "yellow";
                } else {
                    return "grey";
                }
            }
        });
}

function drawLines(code) {
    let [incoming, outgoing, codeCoords] = [[], [], []];

    if (code !== "") {
        incoming = countryStudentFlows.map(function(d) {return [d["country"], d[code]]});
        outgoing = Object.entries(countryStudentFlows.filter(function (d) {return d.country === code})[0]);
        outgoing.splice(0, 1);

        codeCoords = mapProjection([countryData.get(code).country_pos.lat, countryData.get(code).country_pos.long]);
    }

    // Define the selection
    let lineSelection = linesGroup.selectAll("line")
        .data(() => {
            if (studentDirection === "incoming") {
                return incoming;
            } else {
                return outgoing;
            }
        }, (d) => (d[0] + d[1] + codeCoords[0] + codeCoords[1]));

    // Enter
    lineSelection.enter()
        .merge(lineSelection)
        .append("line")
        .attr("stroke", "rgba(0, 0, 0, 0.8)")
        .attrs({"pointer-events": "none"})
        .attrs((d) => {
            try {
                let targetCoords = mapProjection([countryData.get(d[0]).country_pos.lat, countryData.get(d[0]).country_pos.long]);
                if (studentDirection === "incoming") {
                    return {"x1": targetCoords[0], "y1": targetCoords[1], "x2": targetCoords[0], "y2": targetCoords[1]}
                } else {
                    return {"x1": codeCoords[0], "y1": codeCoords[1], "x2": codeCoords[0], "y2": codeCoords[1]}
                }
            } catch (e) {console.log("Error in " + d.country)}
         })
        .transition().duration(1000)
        .attrs(d => {
            try {
                let targetCoords = mapProjection([countryData.get(d[0]).country_pos.lat, countryData.get(d[0]).country_pos.long]);

                if (studentDirection === "incoming") {
                    return {"x2": codeCoords[0], "y2": codeCoords[1]};
                } else {
                    return {"x2": targetCoords[0], "y2": targetCoords[1]};
                }
            } catch (e) {console.log("Error in " + d.country)}
        })
        .attr("stroke-width", d => {return d[1] / 200;});

    // Exit
    lineSelection.exit()
        .transition()
        .duration(1000)
        .attr("stroke-width", 0)
        .remove();
}

function drawLegend() {
    // Editable options
    const legendTicks = 10;
    const legendWidth = 220;

    const [legendMin, legendMax]   = [0                       ,  4];
    const [legendPosX, legendPosY] = [width - legendWidth - 20, 20];
    const tickWidth = legendWidth / legendTicks;
    const legendHeight = tickWidth / 2;

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
            return mapColor(d);
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

/*
function drawLinesDetailed(countryShortcut) {
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
*/