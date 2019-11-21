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

let projection = d3.geoTransverseMercator().center([18, 49]).scale(600).rotate([-10, 0, 0]);
let path = d3.geoPath().projection(projection);
let color = d3.scaleSequential().domain([0, 4]).interpolator(d3.interpolateReds);

// Center of country
let countryCenterCoordinates = d3.map();
let countryPosPromise = d3.csv("data/map/countrypos.csv", d => {
    countryCenterCoordinates.set(d.country.toLowerCase(), {"long": d.long, "lat": d.lat})
});

// "Correlation" counts for each pair
let countryStudentFlows;
let corStudentCountPromise = d3.csv("data/map/corstudentcount.csv").then(data => {
    countryStudentFlows = data
});

// Coords for each university
let detailedCoordinates;
let coordinatesPremise = d3.csv("data/map/coordinates.csv").then(data => {
    detailedCoordinates = data;
});

let codeToNumeric = d3.map();
let numericToCode = d3.map();
let mapRatio = d3.map();
let countryData = d3.map();
let ratioPremise = d3.csv("data/map/chloroplet-ratio.csv", d => {
    mapRatio.set(d.numeric, parseFloat(d.receiving) / parseFloat(d.sending));
    countryData.set(d.numeric, d);
    codeToNumeric.set(d.country.toLowerCase(), d.numeric);
    numericToCode.set(d.numeric, d.country.toLowerCase());
});

let chloroplethData = d3.map();
let worldMapPremise = d3.json("data/map/world-50m.v1.json").then(outline=>{
    let features = topojson.feature(outline, outline.objects.countries).features;

    features.map((feat) => {
        feat["color"] =  color(mapRatio.get(feat.id));
        feat["stroke"] = 0;

        let featCode = numericToCode.get(feat.id);
        chloroplethData.set(featCode, feat);
    });
});

// After all of the premises are loaded, draw the shit.
Promise.all([countryPosPromise, corStudentCountPromise, coordinatesPremise, ratioPremise, worldMapPremise])
    .then(() => {
        // Populate the dropdown menu
        populateCountryList();
        // Create the legend
        drawLegend();
        // Draw the chloropleth
        drawOutline();
    });

function populateCountryList() {
    let select = document.getElementById("dropdown_country");

    for(let i = 0; i < countryData.values().length; i++) {
        let opt = countryData.values()[i];
        let el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.country.toLocaleLowerCase();
        select.appendChild(el);
    }
}

function highlightState(code) {
    chloroplethData.get(code).stroke = 1;
    drawOutline();
}

function unHiglightState(code) {
    chloroplethData.get(code).stroke = 0;
    drawOutline();
}

function drawOutline() {
    let countrySelection = countryGroup.selectAll("path")
        .data(chloroplethData.values());

    // Enter
    countrySelection.enter()
        .append("path")
        .attr("stroke-width", 0)
        .attr("fill", d => d.color)
        .attr("d", d => path(d))
        .on('mouseover', d => {
            let code = countryData.get(d.id).country.toLowerCase();
            events.call('stateOnMouseOver', code, code);
        })
        .on('mouseout', d => {
            let code = countryData.get(d.id).country.toLowerCase();
            events.call('stateOnMouseOut', code, code);
        })
        .on('click', d => {
            if (codeToNumeric.get(selectedCountry) === d.id) {
                events.call('stateSelectedEvent', "", "");
            } else {
                let countryShortcut = countryData.get(d.id).country.toLowerCase();
                events.call('stateSelectedEvent', countryShortcut, countryShortcut);
            }
        })
        .append("title").text(function(d) {
            return countryData.get(d.id).country + ": " + mapData.get(d.id).toFixed(2);
        });

    // Update
    countrySelection.attr("stroke-width", d => {return d.stroke});
}

function drawLines(code) {
    // Convert the country shortcode into a numeric
    let numeric = codeToNumeric.get(code);

    let incoming = [];
    let outgoing = [];
    let codeCoords = [];

    if (code !== "") {
        incoming = countryStudentFlows.map(function(d) {return [d["country"], d[code]]});
        outgoing = Object.entries(countryStudentFlows.filter(function (d) {return d.country === code})[0]);
        outgoing.splice(0, 1);

        codeCoords = projection([countryCenterCoordinates.get(code).lat, countryCenterCoordinates.get(code).long]);
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
            let targetCoords = projection([countryCenterCoordinates.get(d[0]).lat, countryCenterCoordinates.get(d[0]).long]);
            if (studentDirection === "incoming") {
                return {"x1": targetCoords[0], "y1": targetCoords[1], "x2": targetCoords[0], "y2": targetCoords[1]}
            } else {
                return {"x1": codeCoords[0], "y1": codeCoords[1], "x2": codeCoords[0], "y2": codeCoords[1]}
            }
         })
        .transition().duration(1000)
        .attrs(d => {
            let targetCoords = projection([countryCenterCoordinates.get(d[0]).lat, countryCenterCoordinates.get(d[0]).long]);

            if (studentDirection === "incoming") {
                return {"x2": codeCoords[0], "y2": codeCoords[1]};
            } else {
                return {"x2": targetCoords[0], "y2": targetCoords[1]};
            }
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