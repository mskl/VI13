var setsSVG = d3.select("#parallel_set > svg"),
    setsWidth = +setsSVG.style("width").replace("px", ""),
    setsHeight = +setsSVG.style("height").replace("px", "");

// Square around the whole SVG
setsSVG.append("rect")
    .attr("width", setsWidth)
    .attr("height", setsHeight)
    .attr("fill", "transparent")
    .attr("stroke", "black");

setsSVG.append("text")
    .attr("fill", "black")
    .attr("font-size", 11)
    .attr("y", 20)
    .attr("x", 20)
    .text("parallel sets");