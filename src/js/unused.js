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