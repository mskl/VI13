// source chloropleth: https://bl.ocks.org/denisemauldin/3436a3ae06f73a492228059a515821fe
let mapSVG = d3.select("#map > svg"),
    mapSvgWidth = +mapSVG.style("width").replace("px", ""),
    mapSvgHeight = +mapSVG.style("height").replace("px", "");

// Append a rectangle to the map
mapSVG.append("rect");
let mapLegendGroup = null;
let countryGroup = mapSVG.append("g").attr("class", "counties");
let linesGroup = mapSVG.append("g").attr("class", "lines");

// Variable used in the map only
let highlightedState = "";

// 18 49 when width=720 height=430
// 38 38 when width=424 height=257
let mapProjection = d3.geoTransverseMercator()
    .center([(-5/74)*mapSvgWidth+2466/37, (11/173)*mapSvgHeight+3747/173])
    .scale(600*Math.min(mapSvgHeight/430, mapSvgWidth/720))
    .rotate([-10, 0, 0]);
let mapPath = d3.geoPath().projection(mapProjection);

let chloroplethMapColor = d3.scaleSequential().domain([0, 4]).interpolator(d3.interpolateBlues);
let selectedMapColor = d3.scaleSequential().domain([0, 0.40]).interpolator(d3.interpolatePuRd);

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

        // Draw the chloropleth
        drawChloropleth();
    });

/**
 * Add entries to the dropdown menu
 */
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

/**
 * Highlight a state
 * @param code: code of the state
 */
function highlightState(code) {
    highlightedState = code;
    drawChloropleth();
}

/**
 * Map tooltip function. The offset is fixed for some of the countries.
 */
var mapTip = d3.tip().attr('class', 'd3-tip').html(
    (stateCode, entries) => {
        let rowString = "";

        // Accumulate rows
        Object.entries(entries).forEach(
            ([key, value]) => {
                rowString += `<tr><td>${key}</td><td>${value}</td></tr>`
            }
        );
        return `<table style="margin-top: 2.5px;">${rowString}</table>`});
/**
 * Get arrays of incoming and arrays of outgoing based on the country code
 * @param code: code of the country
 * @returns {[{}, {}]}: array of two maps [incoming, ourgoing]
 */
function getIncomingOutgoingFromCode(code) {
    let [incoming, outgoing] = [{}, {}];
    if (code !== "") {
        outgoing = countryStudentFlows.map(function(d) {return [d["country"], d[code]]});
        incoming = Object.entries(countryStudentFlows.filter(function (d) {return d.country === code})[0]);
        incoming.splice(0, 1);
    }
    return [incoming, outgoing];
}

/**
 * Draw the colored map
 */
function drawChloropleth() {
    // Update the legend
    drawLegend();

    // Update the header
    if (selectedCountry === "") {
        document.querySelector("#map > h4").innerHTML = "Student flow"
    } else {
        document.querySelector("#map > h4").innerHTML = studentDirection === "incoming"
            ? "Students incoming to " + countryData.get(selectedCountry).name
            : "Students outgoing from " + countryData.get(selectedCountry).name
    }

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

    let selected = (studentDirection === "incoming") ? incoming : outgoing;
    let countrySelection = countryGroup.selectAll("path").data(countryData.values());

    function callToolTip(d) {
        let entries = null;
        if (selectedCountry !== "" && d.country !== selectedCountry) {
            if (studentDirection === "incoming") {
                entries = {
                    [`<b>` + d.name + `</b>`]: "",
                    "Incoming": formatNumber(selected[d.country]),
                    "Percentage": ((selected[d.country] / totalStudentCount) * 100).toFixed(1) + "%"
                };
            } else {
                entries = {
                    [`<b>` + d.name + `</b>`]: "",
                    "Outgoing:": formatNumber(selected[d.country]),
                    "Percentage:": ((selected[d.country] / totalStudentCount) * 100).toFixed(1) + "%"
                };
            }
        } else {
            entries = {
                [`<b>` + d.name + `</b>`]: "",
                "Incoming:": formatNumber(d.receiving),
                "Outgoing:": formatNumber(d.sending)
            };
        }

        // Override the calculated position
        mapTip.show(d.country, entries);
        let box = document.querySelector("#map > svg > g.legend").getBoundingClientRect();
        mapTip.style("left", box.left + "px");
        mapTip.style("top", box.bottom + 10 + "px");
    }

    // First draw
    countrySelection.enter()
        .append("path")
        .attr("stroke-width", 0)
        .attr("d", d => mapPath(d.topo))
        .attr("fill", d => chloroplethMapColor(d.recSendRatio))
        .on('mouseover', d => {
            events.call('stateOnMouseOver', d.country, d.country);
            callToolTip(d);
        })
        .on('mouseout', d => {
            events.call('stateOnMouseOut', d.country, d.country);
            mapTip.hide();
        })
        .on('click', d => selectedCountry === d.country
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.country, d.country))
        .call(mapTip);

    // Update the text
    countrySelection.on('mouseover', d => {
        events.call('stateOnMouseOver', d.country, d.country);
        callToolTip(d);
    }).call(mapTip);

    // Update the stroke
    countrySelection
        .attr("stroke-width", d => (d.country === selectedCountry || d.country === highlightedState) ? 1 : 0);

    // Update the colors
    countrySelection
        .transition()
        .duration(400)
        .attr("fill", d => {
            if (selectedCountry === "") {
                return chloroplethMapColor(d.recSendRatio);
            } else {
                if (d.country === selectedCountry) {
                    return "white";
                } else {
                    return selectedMapColor(selected[d.country] / totalStudentCount);
                }
            }
        });
}

/**
 * Draw the legend based on the selected country variable. The legend is removed before creating a new one.
 */
function drawLegend() {
    // Editable options
    const mapLegendTicks = 10;
    const mapLegendWidth = 240;

    const [mapLegendMin, mapLegendMax] =
        selectedCountry === ""
        ? chloroplethMapColor.domain()
        : selectedMapColor.domain() ;

    const [mapLegendPosX, mapLegendPosY] = [mapSvgWidth - mapLegendWidth - 20, 20];
    const mapLegendTickWidth = mapLegendWidth / mapLegendTicks;
    const mapLegendHeight = mapLegendTickWidth / 2;

    // Remove the legend if it already exists
    if (mapLegendGroup != null) {
        mapLegendGroup.remove();
    }

    mapLegendGroup = mapSVG.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${mapLegendPosX}, ${mapLegendPosY})`);

    const [padding_x, padding_y] = [4, 4];
    mapLegendGroup.append("rect")
        .attr("width", mapLegendWidth + padding_x * 2)
        .attr("height", (mapLegendHeight + padding_y) * 2)
        .attr("transform", `translate(${-padding_x}, ${-(mapLegendHeight + padding_y)})`)
        .attr("fill", "white")
        .attr("stroke-width", "1px")
        .attr("stroke", "rgba(0, 0, 0, 0.05)")
        .attr("rx", "2px")
        .attr("ry", "2px")
        .classed("legend");

    mapLegendGroup.selectAll("rect.numbers")
        .data(d3.range(mapLegendMin, mapLegendMax, (mapLegendMax - mapLegendMin) / mapLegendTicks))
        .enter()
        .append("rect")
        .attr("width", mapLegendTickWidth)
        .attr("height", mapLegendHeight)
        .attr("stroke", "black")
        .attr("stroke-width", 0.01)
        .attr("x", function (d, i) {
            return i * mapLegendTickWidth;
        })
        .attr("fill", function(d) {
            if (selectedCountry === "") {
                return chloroplethMapColor(d);
            } else {
                return selectedMapColor(d);
            }
        }).classed("numbers");

    mapLegendGroup.selectAll("text")
        .data(d3.range(mapLegendMin, mapLegendMax, (mapLegendMax - mapLegendMin) / mapLegendTicks))
        .enter()
        .append("text")
        .attr("font-size", "9px")
        .attr("fill", "black")
        .attr("y", mapLegendHeight - 3)
        .attr("x", function (d, i) {
            return i * mapLegendTickWidth + 3;
        }).text((d, i) => {
            // Only draw every third tick
            if (i % 3 === 0) {
                return selectedCountry === ""
                    ? d.toFixed(1)
                    : (d*100).toFixed(0) + "%";
            }
        });

    mapLegendGroup
        .append("text")
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("y", -3)
        .attr("x", 4)
        .text(() => selectedCountry === ""
                ? "number of students incoming per one outgoing"
                : "percentage of students " + studentDirection);
}

/**
 * Draws lines between a selected country and a hovered country
 * @param selectedCode selected country code
 * @param otherCode hovered country code
 */
function drawLines(selectedCode, otherCode) {
     let lineSelection = linesGroup.selectAll("line")
         .data(detailedCoordinates.filter(d => {
             if (otherCode !== "") {
                 return studentDirection === "incoming"
                    ? d.sendingCode === selectedCode && d.receivingCode === otherCode
                    : d.receivingCode === selectedCode && d.sendingCode === otherCode
             }
         }, d => d.sendLat + " " + d.sendLon));

     lineSelection.enter()
         .merge(lineSelection)
         .append("line")
         .attr("stroke", "rgba(0, 0, 0, 0.5)")
         .attr("pointer-events", "none")
         .attr("stroke-width", 0)
         .attrs(d => {
             let receive = mapProjection([d.receiveLon, d.receiveLat]);
             return {"x1": receive[0], "y1": receive[1], "x2": receive[0], "y2": receive[1]};
         })
         .transition()
         .duration(400)
         .attrs(d => {
             let send = mapProjection([d.sendLon, d.sendLat]);
             let receive = mapProjection([d.receiveLon, d.receiveLat]);

             if (studentDirection === "incoming")
                return {"x1": send[0], "y1": send[1], "x2": receive[0], "y2": receive[1]};
             else
                 return {"x1": receive[0], "y1": receive[1], "x2": send[0], "y2": send[1]};
         })
         .attr("stroke-width", d => d.count * 0.05);

     lineSelection.exit().remove();
}