let mapSVG = d3.select("#map > svg"),
    mapSvgWidth = +mapSVG.style("width").replace("px", ""),
    mapSvgHeight = +mapSVG.style("height").replace("px", "");

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
let chloroplethMapColor = d3.scaleSequential().domain([0, 4]).interpolator(d3.interpolateBlues);
let selectedMapColor = d3.scaleSequential().domain([0, 0.41]).interpolator(d3.interpolatePuRd);

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

let highlightedState = "";

function highlightState(code) {
    highlightedState = code;
    drawChloropleth();
}

function getIncomingOutgoingFromCode(code) {
    let [incoming, outgoing] = [{}, {}];

    if (code !== "") {
        incoming = countryStudentFlows.map(function(d) {return [d["country"], d[code]]});
        outgoing = Object.entries(countryStudentFlows.filter(function (d) {return d.country === code})[0]);
        outgoing.splice(0, 1);
    }

    return [incoming, outgoing];
}

function drawChloropleth() {
    // Calculate the total amount of students
    let totalStudentCount = 0;
    let [incoming, outgoing] = [[], []];
    if (selectedCountry !== "") {
       [incoming, outgoing] = getIncomingOutgoingFromCode(selectedCountry);
        let selected = (studentDirection === "incoming") ? incoming : outgoing;

        // Sum all of the elements in the array
        totalStudentCount = selected.map(d => d[1]).reduce((x, y) => parseInt(x) + parseInt(y));

        // Convert the array into an object
        incoming = incoming.reduce((o, key) => Object.assign(o, {[key[0]]: key[1]}), {});
        outgoing = outgoing.reduce((o, key) => Object.assign(o, {[key[0]]: key[1]}), {});
    }

    let countrySelection = countryGroup.selectAll("path")
        .data(countryData.values());

    // Enter
    countrySelection.enter()
        .append("path")
        .attr("stroke-width", 0)
        .attr("d", d => mapPath(d.topo))
        .attr("fill", d => chloroplethMapColor(d.recSendRatio))
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
        .attr("stroke-width", d => (d.country === selectedCountry || d.country === highlightedState) ? 1 : 0)
        .transition()
        .duration(1000)
        .attr("fill", d => {
            if (selectedCountry === "") {
                return chloroplethMapColor(d.recSendRatio);
            } else {
                if (d.country === selectedCountry) {
                    return "white";
                } else {
                    let selected = (studentDirection === "incoming") ? incoming : outgoing;
                    return selectedMapColor(selected[d.country] / totalStudentCount);
                }
            }
        });
}

function drawLegend() {
    // Editable options
    const legendTicks = 10;
    const legendWidth = 240;

    const [legendMin, legendMax]   = [0                       ,  4];
    const [legendPosX, legendPosY] = [mapSvgWidth - legendWidth - 20, 20];
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
            return chloroplethMapColor(d);
        });

    legend.selectAll("text")
        .data(d3.range(legendMin, legendMax, (legendMax - legendMin) / legendTicks))
        .enter()
        .append("text")
        .attr("font-size", 7)
        .attr("fill", "black")
        .attr("y", legendHeight - 3)
        .attr("x", function (d, i) {
            return i * tickWidth + 3;
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

function drawLines(code) {
     let lineSelection = linesGroup.selectAll("line")
         .data(detailedCoordinates.filter(d => studentDirection === "incoming"
             ? d.sendingCode === code
             : d.receivingCode === code),
             d => d.sendLat + " " + d.sendLon);

     lineSelection.enter()
         .merge(lineSelection)
         .append("line")
         .attr("pointer-events", "none")
         .attrs(d => {
             let send = mapProjection([d.sendLon, d.sendLat]);
             let receive = mapProjection([d.receiveLon, d.receiveLat]);

             return {"x1": receive[0], "y1": receive[1], "x2": receive[0], "y2": receive[1]};
         })
         .transition()
         .duration(1000)
         .attrs(d => {
             let send = mapProjection([d.sendLon, d.sendLat]);
             let receive = mapProjection([d.receiveLon, d.receiveLat]);

             if (studentDirection === "incoming")
                return {"x1": send[0], "y1": send[1], "x2": receive[0], "y2": receive[1]};
             else
                 return {"x1": receive[0], "y1": receive[1], "x2": send[0], "y2": send[1]};
         })
         .attr("stroke", d => "rgba(0, 0, 0, 1)") // Math.min(1, d.count/10)
         .attr("stroke-width", d => d.count * 0.05);


     lineSelection.exit().remove();
}

/*
function drawLinesSimple(code) {
    let [incoming, outgoing] = [[], []];
    let codeCoords = [];

    if (code !== "") {
        [incoming, outgoing] = getIncomingOutgoingFromCode(code);
        codeCoords = mapProjection([countryData.get(code).country_pos.lat,
            countryData.get(code).country_pos.long]);
    }

    // Define the selection
    let lineSelection = linesGroup.selectAll("line")
        .data(() => {
            return studentDirection === "incoming" ? incoming : outgoing;
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
        .transition()
        .duration(1000)
        .attrs(d => {
            try {
                let targetCoords = mapProjection([countryData.get(d[0]).country_pos.lat, countryData.get(d[0]).country_pos.long]);

                return studentDirection === "incoming"
                    ? {"x2": codeCoords[0], "y2": codeCoords[1]}
                    : {"x2": targetCoords[0], "y2": targetCoords[1]};
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
*/