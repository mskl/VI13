var setsSVG = d3.select("#parallel_set > svg"),
    setsWidth = +setsSVG.style("width").replace("px", ""),
    setsHeight = +setsSVG.style("height").replace("px", "");

// Square around the whole SVG
setsSVG.append("rect")
    .attr("width", setsWidth)
    .attr("height", setsHeight)
    .attr("fill", "transparent")
    .attr("stroke", "black");


const width = 500;
const height = 600;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " students"; },
    color = d3.scaleOrdinal(d3.schemeCategory10);


d3.json("degree_allnodes.json").then(function (data) {
    degree_data = data
    gen_vis();
});

function gen_vis() {

    const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [setsWidth - 1, setsHeight - 6]]).nodeSort(null);

    var link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .selectAll("path");

    var node = svg.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g");

    sankey(degree_data);

    link = link
        .data(degree_data.links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return Math.max(1, d.width); });

    // link hover values
    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    node = node
        .data(degree_data.nodes)
        .enter().append("g");


    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", "#000");

    node.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x0 < width / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    function dragmove(d) {
        d3.select(this)
            .attr("transform",
                "translate("
                + d.x + ","
                + (d.y = Math.max(
                    0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
}
