var selectedNode;
var highlightedNode;
var highlightedNode2;
var linksToSelectedNode;
var degree_data;
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
                            <tr><td> ` + ((d.source.name.length > 2 ) ? d.source.name : countryData.get(d.source.name.toLowerCase()).name) + " → " + ((d.target.name.length > 2 ) ? d.target.name : countryData.get(d.target.name.toLowerCase()).name) + "\n" +`</td> <td style="text-align: right">` + format(d.value) + `</td></tr>
                    </table>
                    `;
        return content;
    });

var sankeyNodeTip = d3.tip().attr('class', 'd3-tip').html(
    function(d){
        if (d.name.length == 2){
                let content = `<span style='margin-left: 1.5px;'><b>` + countryData.get(d.name.toLowerCase()).name + `</b></span><br>`;
                if (d.index > 34){
                    const nodesWithTarget = d.targetLinks.map( e => {
                        let string = `<tr><td style="text-align: left;">`+ e.source.name + ":"+ `</td><td style="text-align: right">`+ format(e.value)+ `</td></tr>`;
                        return string
                    });
                    content += `<table style="margin-top: 2.5px;"> ` + nodesWithTarget.join('') + `</table>`;
                }
                else{
                    const nodesWithSource = d.sourceLinks.map(e => {
                        let string = `<tr><td style="text-align: left;">`+ e.target.name + ":"+ `</td><td style="text-align: right">`+ format(e.value)+ `</td></tr>`;
                        return string
                    });
                    content += `<table style="margin-top: 2.5px;"> ` + nodesWithSource.join('') + `</table>`;
                }
                return content;
            }
        else{
            let degreecontent = `
                    <table style="margin-top: 2.5px;">
                            <tr><td style="text-align: left;">`+ d.name + ":"+ `</td><td style="text-align: right">`+ format(d.value)+ `</td></tr>
                    </table>
                    `;
            return degreecontent;
        }
    })
    .direction(function (d) {
    if (d.x0 > 300){
        console.log("here is the d:  ");
        console.log(d);
        return "nw"
    }
    else return "ne";
    }

);

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
        }).then(function (){
            if (selectedCountry.toUpperCase()!="MK"){
                gen_sankeyvis();
            }
            else{
                no_data_for_MK();
            }

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

function no_data_for_MK(){
    sankey_svg.selectAll("*").remove();
    sankey_svg.append("text").attr("y", 50).attr("x", 50).attr("font-size", 15).text("No incoming students to Makedonia, select another country.");

}


function gen_sankeyvis() {
    sankey_svg.selectAll("*").remove();

    if(selectedCountry == ""){
        sankey_svg.append("text").attr("y", setsHeight + 5).attr("x", 23).attr("font-size", 11).text("Outgoing students");
        sankey_svg.append("text").attr("y", setsHeight + 5).attr("x", setsWidth-110).attr("font-size", 11).text("Incoming student")
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
        .on("mouseout", sankeyLinkTip.hide);
    link.call(sankeyLinkTip);

    node = node
        .data(degree_data.nodes)
        .enter().append("g");

    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return Math.max(1.5, d.y1 - d.y0); })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return parallelsets_color(d.name.replace(/ .*/, "")); })
        .attr("fill-opacity", 0.7)
        .attr("title", function (d) {return d.name + d.index})
        .on("mouseover", function(d){
            dispatch.call("mouseoverNode", d, d);
            if (d.name.length == 2){
                events.call("sankeyNodeOnMouseOver", d.name.toLowerCase(), d.name.toLowerCase());

            }
            sankeyNodeTip.show(d)
        })
        .on("mouseout", function(d){
            dispatch.call("mouseoutNode", d, d);
            if (d.name.length == 2) {
                events.call("sankeyNodeOnMouseOut", d.name.toLowerCase(), d.name.toLowerCase())
            }
            sankeyNodeTip.hide();
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
var dispatch = d3.dispatch("mouseoverNode", "mouseoutNode");

dispatch.on("mouseoverNode", function(node){
    console.log();
    console.log(node);

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
    selectedNode.attr("stroke-width", 0).attr("fill-opacity", 0.7);

    //change back link opacity to 0.2
    for (i = 0; i < linksToSelectedNode.length; i++) {
        let htmlLink = d3.select("#link"+ linksToSelectedNode[i].index);
        htmlLink.attr("stroke-opacity", 0.2);
    }
});




