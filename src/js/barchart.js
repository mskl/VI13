let barchartSVG = d3.select("#barchart > svg"),
    barchartWidth = +barchartSVG.style("width").replace("px", ""),
    barchartHeight = +barchartSVG.style("height").replace("px", "");

// Square around the whole SVG
barchartSVG.append("rect")
    .attr("width", barchartWidth)
    .attr("height", barchartHeight)
    .attr("fill", "transparent")
    .attr("stroke", "black");

barchartSVG.append("text")
    .attr("fill", "black")
    .attr("font-size", 11)
    .attr("y", 20)
    .attr("x", 20)
    .text("barchart");