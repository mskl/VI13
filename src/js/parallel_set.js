var selectedNode;
var previousNodeColor;
var linksToSelectedNode;
var selectedLink;


var svg = d3.select("#parallel_set > svg"),
    setsWidth = +svg.style("width").replace("px", ""),
    setsHeight = +svg.style("height").replace("px", "");

// Square around the whole SVG
svg.append("rect")
    .attr("width", setsWidth)
    .attr("height", setsHeight)
    .attr("fill", "transparent")
    .attr("stroke", "black");

let formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " students"; },
    parallelsets_color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("data/parallel_sets/degree_flow.json").then(function (data) {
    degree_data = data;
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
        .attr("stroke-width", function(d) { return Math.max(1, d.width); })
        .attr("id", function (d) {return "link" + d.index})
       ;


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
        .attr("fill", function(d) { return parallelsets_color(d.name.replace(/ .*/, "")); })
        .attr("title", function (d) {return d.name + d.index})
        .attr("stroke", "#000")
        .on("mouseover", function(d){
        dispatch.call("mouseoverNode", d, d)
    }).on("mouseout", function(d){
        dispatch.call("mouseoutNode", d, d)
    });

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

var dispatch = d3.dispatch("mouseoverNode", "mouseoutNode","hoverLink");

dispatch.on("mouseoverNode", function(node){
    console.log("hellomousein");

    selectedNode = d3.select("rect[title=\'" + node.name + node.index + "\']");
    //previousColor = selectedNode.style.background;
    selectedNode.attr("fill","black");
    linksToSelectedNode = node.sourceLinks.concat(node.targetLinks);
    for (i = 0; i < linksToSelectedNode.length; i++) {
        let htmlLink = d3.select("#link"+ linksToSelectedNode[i].index);
        htmlLink.transition().duration('50').attr("stroke-opacity", 0.5);
    }
});
dispatch.on("mouseoutNode", function(node){
    console.log("hellomouseout");
    selectedNode.transition().duration('50').attr("fill", parallelsets_color(node.name.replace(/ .*/, "")));
    //change back link opacity to 0.2
    for (i = 0; i < linksToSelectedNode.length; i++) {
        let htmlLink = d3.select("#link"+ linksToSelectedNode[i].index);
        htmlLink.attr("stroke-opacity", 0.2);
    }
});


dispatch.on("hoverLink", function(link){
    console.log(link['source'].name);

    if (selectedLink != null){
        selectedLink.attr("stroke", "#000")
    }
    selectedLink = d3.select("#link"+ link.index);
    let colorToSource =  parallelsets_color(link['source'].name.replace(/ .*/, ""));
    console.log(colorToSource);
    selectedLink.attr("stroke", colorToSource);
});
