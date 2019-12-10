var selectedNode;
var highlightedNode;
var highlightedNode2;
var linksToSelectedNode;
var selectedLink;
var degree_data;
var sankeyTip;
var sankey_svg = d3.select("#parallel_set > svg"),
    setsWidth = +sankey_svg.style("width").replace("px", ""),
    setsHeight = +sankey_svg.style("height").replace("px", "");

let formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " students"; },
    parallelsets_color = d3.scaleOrdinal(d3.schemeCategory10);

var sankeyLinkTip = d3.tip().attr('class', 'd3-tip').html(
    function(d){
        var content = "";
        content +=`
                        <table style="margin-top: 2.5px;">
                                <tr><td> ` + d.source.name + " → " + d.target.name + "\n" +`</td> <td style="text-align: right">` + format(d.value) + `</td></tr>
                        </table>
                        `;
        return content;
    });
var sankeyNodeTip = d3.tip().attr('class', 'd3-tip').html(
    function(d){
        let content = `<span style='margin-left: 1.5px;'><b>` + d.name + `</b></span><br>`;
        const nodesWithSource = d.sourceLinks.map(e => {
            let string = `<tr><td style="text-align: left;">`+ e.target.name + ":"+ `</td><td style="text-align: right">`+ format(e.target.value)+ `</td></tr>`;
            return string
        });
        const nodesWithTarget = d.targetLinks.map( e => {
            let string = `<tr><td style="text-align: left;">`+ e.source.name + ":"+ `</td><td style="text-align: right">`+ format(e.source.value)+ `</td></tr>`;
            return string
        });
        if (d.index > 34){
            content += `<table style="margin-top: 2.5px;"> ` + nodesWithTarget.join('') + `</table>`;
        }
        else{
            content += `<table style="margin-top: 2.5px;"> ` + nodesWithSource.join('') + `</table>`;
        }
        return content;
    });

function drawSankey(selectedCountry, studentDirection){
    if (selectedCountry == ""){
        d3.json("data/parallel_sets/degree_flow.json").then(function (data) {
            degree_data = data;
            gen_sankeyvis();
        });
    }
    else if (selectedCountry && studentDirection == "incoming"){
        d3.json("data/parallel_sets/receiving_countryselection_degree.json").then(function (data) {

            degree_data = data[selectedCountry.toUpperCase()];
            console.log(selectedCountry)
        }).then(function (){
            gen_sankeyvis();
            console.log("hello")
        });
    }
    else if (selectedCountry && studentDirection=="outgoing"){
        d3.json("data/parallel_sets/sending_countryselection_degree.json").then(function (data) {
            degree_data = data[selectedCountry.toUpperCase()];
            gen_sankeyvis(degree_data);
        });
    }
}

d3.json("data/parallel_sets/degree_flow.json").then(function (data) {
    degree_data = data;
    gen_sankeyvis(degree_data);
});



function gen_sankeyvis() {
    sankey_svg.selectAll("*").remove();

    if(selectedCountry == ""){
        sankey_svg.append("text").attr("y", setsHeight + 5).attr("x", 23).attr("font-size", 11).text("Outgoing students");
        sankey_svg.append("text").attr("y", setsHeight + 5).attr("x", setsWidth-110).attr("font-size", 11).text("Incoming student")
    }
    if (selectedCountry.length == 2){

    }

    const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(7)
        .extent([[40, 5], [setsWidth - 45, setsHeight - 10]]).nodeSort(null);

    var link = sankey_svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.15)
        .selectAll("path");

    var node = sankey_svg.append("g")
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
    link.on("mouseover", sankeyLinkTip.show)
        .on("mousemove", function(d){
            //sankeyTooltip.style('top', d.y0 )          // NEW
             //   .style('left', 100);             // NEW
        })
        .on("mouseout", sankeyLinkTip.hide);
    link.call(sankeyLinkTip);

    node = node
        .data(degree_data.nodes)
        .enter().append("g");


    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return Math.max(2, d.y1 - d.y0); })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return parallelsets_color(d.name.replace(/ .*/, "")); })
        .attr("fill-opacity", 0.7)
        .attr("title", function (d) {return d.name + d.index})
        .on("mouseover", function(d){
            dispatch.call("mouseoverNode", d, d);
            dispatch.call("hoverShowTextBox", d, d);
            if (d.name.length == 2){
                events.call("sankeyNodeOnMouseOver", d.name.toLowerCase(), d.name.toLowerCase());
            }
            if (d.name.length == 2) {
                sankeyNodeTip.show(d)
            }

        })
        .on("mouseout", function(d){
            dispatch.call("mouseoutNode", d, d);
            if (d.name.length == 2) {
                events.call("sankeyNodeOnMouseOut", d.name.toLowerCase(), d.name.toLowerCase())
            }
            if (d.name.length == 2) {
                sankeyNodeTip.hide();
            }

        })
        .on("click", function (d) {
           events.call("stateSelectedEvent", d.name.toLowerCase(), d.name.toLowerCase())
        })
        .call(sankeyNodeTip);

    node.append("text")
        .attr("x", function(d) {return d.x0 + 18; })
        .attr("y", function(d) {
                return (d.y1 + d.y0) / 2;})
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x0 < (setsWidth) / 2; })
        .attr("x", function(d) { if(d.name == "PhD"){return d.x0+17}
         return d.x1 - 18; })
        .attr("y", function(d){if (d.name == "PhD"){
            return d.y0-5;}
        else{
            return (d.y1 + d.y0) / 2;
        }})
        .attr("text-anchor", "end");

}


function highlightSankeyNode(country){
    try{
        let nodeIndex = degree_data.nodes.find(node => node.name === country.toUpperCase()).index;
        highlightedNode = d3.select("rect[title=\'" + country.toUpperCase() + nodeIndex + "\']");

        highlightedNode.attr("stroke", "#000").attr("stroke-width", 1.5).attr("fill-opacity", 1);
        if (selectedCountry === ""){
            let index2 = degree_data.nodes.length - ((degree_data.nodes.length - 3)/2 - nodeIndex);
            console.log(index2);
            highlightedNode2 = d3.select(("rect[title=\'" + country.toUpperCase() + index2  + "\']")).attr("stroke", "#000").attr("stroke-width", 1.5).attr("fill-opacity", 1);;
        }
    }catch(error){
        highlightedNode = "none";
        console.log("Country not highlighted in sankey, because there is no incoming/outgoing students from there for selected country. " );
    }

}
function unHighlightSankeyNode() {
    if (highlightedNode !== "none"){
        highlightedNode.attr("stroke-width", 0).attr("fill-opacity", 0.7);
    }
    if (selectedCountry === ""){
        highlightedNode2.attr("stroke-width", 0).attr("fill-opacity", 0.7);
    }
}
var dispatch = d3.dispatch("mouseoverNode", "mouseoutNode", "hoverShowTextBox");

dispatch.on("mouseoverNode", function(node){

    if (selectedNode != null){
        for (i = 0; i < linksToSelectedNode.length; i++) {
            let htmlLink = d3.select("#link"+ linksToSelectedNode[i].index);
            htmlLink.attr("stroke-opacity", 0.2);
        }
    }
    selectedNode = d3.select("rect[title=\'" + node.name + node.index + "\']");
    //previousColor = selectedNode.style.background;
    selectedNode.attr("stroke", "#000").attr("stroke-width", 1.5).attr("fill-opacity", 1);

    linksToSelectedNode = node.sourceLinks.concat(node.targetLinks);
    for (i = 0; i < linksToSelectedNode.length; i++) {
        let htmlLink = d3.select("#link"+ linksToSelectedNode[i].index);
        htmlLink.transition().duration('50').attr("stroke-opacity", 0.4);
    }
});
dispatch.on("mouseoutNode", function(node){
    console.log("hellomouseout");
    selectedNode.attr("stroke-width", 0).attr("fill-opacity", 0.7);

    //change back link opacity to 0.2
    for (i = 0; i < linksToSelectedNode.length; i++) {
        let htmlLink = d3.select("#link"+ linksToSelectedNode[i].index);
        htmlLink.attr("stroke-opacity", 0.2);
    }
});

/**/
dispatch.on("hoverShowTextBox", function (node) {
    var text = sankey_svg.selectAll(".nodeInfo").data(node).enter().append("text").attr("class", "nodeInfo");
    text.attr("x", 280)
        .attr("y", 350)
        .text(function (d) {
            linksToNode = node.links();
            console.log(linksToNode);
            if (!(d.index in [ 34, 35, 36])) {
                return d.name + "\n"+ "Bachelorstudents:" + node.links()
            }else{
                return "hello pado"
            }})
        .attr("font_family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "red");
});



