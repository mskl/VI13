let boxplotSVG = d3.select("#boxplot > svg"),
    boxplotWidth = +boxplotSVG.style("width").replace("px", ""),
    boxplotHeight = +boxplotSVG.style("height").replace("px", "");

// Square around the whole SVG
boxplotSVG.append("rect")
    .attr("width", boxplotWidth)
    .attr("height", boxplotHeight)
    .attr("fill", "transparent")
    .attr("stroke", "black");

boxplotSVG.append("text")
    .attr("fill", "black")
    .attr("font-size", 11)
    .attr("y", 20)
    .attr("x", 20)
    .text("boxplot");