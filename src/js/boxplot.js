var boxplotDataset;
var boxplotDatasetReceiving;
var boxplotDatasetSending;
var boxplotDatasetUsing;
var boxplotGenderDataset;
// set the dimensions and margins of the graph
var boxplotMargin = {top: 20, right: 20, bottom: 40, left: 50},
    boxplotWidth = 730 - boxplotMargin.left - boxplotMargin.right,
    boxplotHeight = 230 - boxplotMargin.top - boxplotMargin.bottom;

var boxplotXscale = d3.scaleBand();
var boxplotYscale = d3.scaleLinear();
var boxplotXaxis = d3.axisBottom();
var boxplotYaxis = d3.axisLeft();

var boxWidth =  15;
//
// var boxplotBarTip = d3.tip().attr('class', 'd3-tip').html(
//     function(d ){
//         var content = "";
//         content += `<span style='margin-left: 1.5px;'><b>` + "AHOJ" + `</b></span><br>`;
//         return content;
//     });


// append the svg object to the body of the page
var boxplotSvg = d3.select("#boxplot")
    .append("svg")
    .attr("width", boxplotWidth + boxplotMargin.left + boxplotMargin.right)
    .attr("height", boxplotHeight + boxplotMargin.top + boxplotMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + boxplotMargin.left + "," + boxplotMargin.top + ")");


// Read the data and compute summary statistics for each specie

d3.csv("./data/distances.csv").then(function (data) {
    boxplotDataset = data;
    genBoxplotVis();
});
function genBoxplotVis() {
    nestDataset();
    if (studentDirection === "incoming"){
        boxplotDatasetUsing = boxplotDatasetReceiving
    } else {
        boxplotDatasetUsing = boxplotDatasetSending
    }

    console.log(boxplotDatasetUsing);

    // Show the X scale
    boxplotXscale
        .range([ 0, boxplotWidth ])
        .domain(boxplotDatasetUsing.map(function (d) {
            return d.key;
        }))
        .paddingInner(1)
        .paddingOuter(.5);
    boxplotXaxis
        .scale(boxplotXscale);
    boxplotSvg.append("g")
        .attr("transform", "translate(0," + boxplotHeight + ")")
        .attr("class", "boxplotXaxis")
        .call(boxplotXaxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    boxplotSvg.append("text")
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("y", boxplotHeight + boxplotMargin.bottom - 5)
        .attr("x", boxplotWidth / 2)
        .attr("class", "boxplotxlabel")
        .text("Country");
// Show the Y scale
    boxplotYscale
        .domain([0, 5800])
        .range([boxplotHeight, 0]);
    boxplotYaxis
        .scale(boxplotYscale);
    boxplotSvg.append("g")
        .attr("class", "boxplotYaxis")
        .call(boxplotYaxis);

    boxplotSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (boxplotMargin.left/2)-10)
        .attr("x",0 - boxplotHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("class","boxplotylabel")
        .text("Km");
    drawBoxplot();
}
function nestDataset() {
    var tmpdataset = boxplotDataset;
     boxplotDatasetReceiving = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.CountryHosting;
        })
        .rollup(function (d) {
            var tmp_min = 100000;
            q1 = d3.quantile(d.map(function (g) {
                if(parseInt(g.km,10) < tmp_min) {tmp_min = parseInt(g.km,10);}
                // if(parseInt(g.km, 10) < boxplotMinimum){boxplotMinimum = parseInt(g.km, 10)}
                // if(parseInt(g.km, 10) > boxplotMaximum){boxplotMaximum = parseInt(g.km, 10)}

                return parseInt(g.km, 10);
            }).sort(d3.ascending), .25);
            median = d3.quantile(d.map(function (g) {
                return parseInt(g.km, 10);
            }).sort(d3.ascending), .5);
            q3 = d3.quantile(d.map(function (g) {
                return parseInt(g.km, 10);
            }).sort(d3.ascending), .75);
            interQuantileRange = q3 - q1;
            min = tmp_min;
            max = q3 + 1.5 * interQuantileRange;


            return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
         .entries(tmpdataset);

    boxplotDatasetReceiving.push({key:"MK",value:{q1:0,median: 0, q3: 0, interQuantileRange: 0, min: 0, max: 0}})

    boxplotDatasetSending = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.CountrySending;
        })
        .rollup(function (d) {
            var tmp_min = 100000;
            q1 = d3.quantile(d.map(function (g) {
                if(parseInt(g.km,10) < tmp_min) {tmp_min = parseInt(g.km,10);}
                // if(parseInt(g.km, 10) < boxplotMinimum){boxplotMinimum = parseInt(g.km, 10)}
                // if(parseInt(g.km, 10) > boxplotMaximum){boxplotMaximum = parseInt(g.km, 10)}

                return parseInt(g.km, 10);
            }).sort(d3.ascending), .25);
            median = d3.quantile(d.map(function (g) {
                return parseInt(g.km, 10);
            }).sort(d3.ascending), .5);
            q3 = d3.quantile(d.map(function (g) {
                return parseInt(g.km, 10);
            }).sort(d3.ascending), .75);
            interQuantileRange = q3 - q1;
            min = tmp_min;
            max = q3 + 1.5 * interQuantileRange;


            return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(tmpdataset);
}

function highlightBoxplot(highlitedState) {
    var tmpDataset;
    if(selectedCountry) {
        tmpDataset = boxplotGenderDataset;
    } else {
        tmpDataset = boxplotDatasetUsing;
    }
    boxplotSvg.selectAll(".box")
        .data(tmpDataset)
        .attr("opacity", function (d) {
            if (d.key.toLowerCase() === highlightedState.toLowerCase() || (highlitedState != "" && (d.key.toLowerCase().includes(highlightedState.toLowerCase())
                && (d.key.includes("(F)") || d.key.includes("(M)"))))){
                return "1"
            } else {
                return "0.7"
            }
        })
        .attr("stroke-width", d => (d.key.toLowerCase() === highlightedState.toLowerCase() || (highlitedState != "" &&(d.key.toLowerCase().includes(highlightedState.toLowerCase())
            && (d.key.includes("(F)") || d.key.includes("(M)"))))) ? 1.5 : 0.5);

    boxplotSvg.selectAll(".mainLine")
        .data(tmpDataset)
        .attr("stroke-width", d => (d.key.toLowerCase() === highlightedState.toLowerCase() || highlitedState != "" &&(d.key.toLowerCase().includes(highlightedState.toLowerCase())
            && (d.key.includes("(F)") || d.key.includes("(M)")))) ? 2 : 1);
}

function drawBoxplot() {
    if (studentDirection === "incoming"){
        boxplotDatasetUsing = boxplotDatasetReceiving
    } else {
        boxplotDatasetUsing = boxplotDatasetSending
    }

    if(!selectedCountry){
        drawDiagramBoxplot(boxplotDatasetUsing);
    } else {
        filterDatasetGender();
        drawDiagramBoxplot(boxplotGenderDataset);
    }
    // drawDirectionBoxplot();
}

function drawDiagramBoxplot(dataset) {
    sortBoxplotDatasetAlphabeticaly(dataset);

    boxplotXscale.domain(dataset.map(function(d) {
        return (d.key);
    }));

    boxplotSvg .selectAll(".box").remove();
    boxplotSvg .selectAll(".mainLine").remove();
    boxplotSvg .selectAll(".minLine").remove();
    boxplotSvg .selectAll(".maxLine").remove();
    boxplotSvg .selectAll(".medianLine").remove();
    boxplotSvg .selectAll(".boxplotxlabel").remove();
    boxplotSvg .selectAll(".boxplotylabel").remove();

    // Show the main vertical lines
    boxplotSvg.selectAll("vertLines")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", function(d){return(boxplotXscale(d.key))})
        .attr("x2", function(d){return(boxplotXscale(d.key))})
        .attr("y1", function(d){return(boxplotYscale(d.value.min))})
        .attr("y2", function(d){return(boxplotYscale(d.value.max))})
        .attr("stroke", "black")
        .attr("stroke-width","1")
        .attr("class", "mainLine")
        .style("width",40);

    // rectangle for the main boxes
    boxWidth =  15;
    boxplotSvg
        .selectAll("boxes")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d){return(boxplotXscale(d.key)-boxWidth/2)})
        .attr("y", function(d){return(boxplotYscale(d.value.q3))})
        .attr("height", function(d){return(boxplotYscale(d.value.q1)-boxplotYscale(d.value.q3))})
        .attr("class","box")
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .attr("stroke-width","0.5")
        .attr("fill", function(d) {
            if (d.key.toLowerCase().includes(selectedCountry.toLowerCase()) && selectedCountry != ""){
                if(d.key.toLowerCase().includes("(f)")) {
                    return "#fc6868";
                } else {
                    return "#6892fc";
                }
            } else {
                return "#85ff4d";
            }
        })
        .attr('opacity',0.7)
        .on('mouseover', function (d){
            var key = "";
            if (d.key.toLowerCase().includes("m") || d.key.toLowerCase().includes("f")) {
                console.log("key:" + d.key[0]+d.key[1]);
                key = d.key[0]+d.key[1];
            } else {
                key = d.key;
            }
            events.call('boxplotOnMouseOver', key.toLowerCase(), key.toLowerCase())
        })
        .on('mouseout', function(d) {
            var key = "";
            if (d.key.toLowerCase().includes("m") || d.key.toLowerCase().includes("f")) {
                console.log("key:" + d.key[0]+d.key[1]);
                key = d.key[0]+d.key[1];
            } else {
                key = d.key;
            }
            events.call('boxplotOnMouseOut', key.toLowerCase(), key.toLowerCase())
        })
        .on('click', d => d.key.toLowerCase().includes(selectedCountry.toLowerCase()) && selectedCountry != ""
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.key.toLowerCase(), d.key.toLowerCase()));

    boxplotSvg.selectAll(".box")
        .append("title") // adding a title for each bar
        .data(dataset)
        .text(function (d){return d.key});

    // Change the median
    boxplotSvg
        .selectAll("medianLines")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", function(d){return(boxplotXscale(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(boxplotXscale(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(boxplotYscale(d.value.median))})
        .attr("y2", function(d){return(boxplotYscale(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80)
        .attr("class", "medianLine");

    // Change the median
    boxplotSvg
        .selectAll("minLines")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", function(d){return(boxplotXscale(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(boxplotXscale(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(boxplotYscale(d.value.min))})
        .attr("y2", function(d){return(boxplotYscale(d.value.min))})
        .attr("stroke", "black")
        .style("width", 80)
        .attr("class", "minLine");

    // Change the median
    boxplotSvg
        .selectAll("maxLines")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", function(d){return(boxplotXscale(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(boxplotXscale(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(boxplotYscale(d.value.max))})
        .attr("y2", function(d){return(boxplotYscale(d.value.max))})
        .attr("stroke", "black")
        .style("width", 80)
        .attr("class", "maxLine");

    var transition = boxplotSvg.transition().duration(750);

    transition.select(".boxplotXaxis")
        .call(boxplotXaxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    if(selectedCountry) {
        var name = boxplotDataset.filter(d => d.CountryHosting.toLowerCase() === selectedCountry.toLowerCase())[0].NameHosting;
        boxplotSvg.append("text")
            .attr("fill", "black")
            .attr("font-size", 11)
            .attr("y", boxplotHeight + boxplotMargin.bottom - 5)
            .attr("x", boxplotWidth / 2-20)
            .attr("class", "boxplotxlabel")
            .text("Country (with gender for " + name + ")");
    } else {
        boxplotSvg.append("text")
            .attr("fill", "black")
            .attr("font-size", 11)
            .attr("y", boxplotHeight + boxplotMargin.bottom - 5)
            .attr("x", boxplotWidth / 2)
            .attr("class", "boxplotxlabel")
            .text("Country");
    }

    boxplotSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (boxplotMargin.left/2)-10)
        .attr("x",0 - boxplotHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("class","boxplotylabel")
        .text("Km");
}

function filterDatasetGender() {
    var tmpDataset;
    if (studentDirection === "incoming"){
        boxplotDatasetUsing = boxplotDatasetReceiving;
        tmpDataset = boxplotDataset.filter(d => d.CountryHosting.toLowerCase() === selectedCountry.toLowerCase());
    } else {
        boxplotDatasetUsing = boxplotDatasetSending;
        tmpDataset = boxplotDataset.filter(d => d.CountrySending.toLowerCase() === selectedCountry.toLowerCase());
    }

    tmpDataset = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            // if (studentDirection === "incoming"){
            //     return (d.CountryHosting + "(" + d.ParticipantGender + ")");
            // } else {
            //     return (d.CountrySending + "(" + d.ParticipantGender + ")");
            // }
            return d.ParticipantGender;
        })
        .rollup(function (d) {
            var tmp_min = 100000;
            q1 = d3.quantile(d.map(function (g) {
                if(parseInt(g.km,10) < tmp_min) {tmp_min = parseInt(g.km,10);}
                // if(parseInt(g.km, 10) < boxplotMinimum){boxplotMinimum = parseInt(g.km, 10)}
                // if(parseInt(g.km, 10) > boxplotMaximum){boxplotMaximum = parseInt(g.km, 10)}

                return parseInt(g.km, 10);
            }).sort(d3.ascending), .25);
            median = d3.quantile(d.map(function (g) {
                return parseInt(g.km, 10);
            }).sort(d3.ascending), .5);
            q3 = d3.quantile(d.map(function (g) {
                return parseInt(g.km, 10);
            }).sort(d3.ascending), .75);
            interQuantileRange = q3 - q1;
            min = tmp_min;
            max = q3 + 1.5 * interQuantileRange;


            return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(tmpDataset)
        .map(function(group) {
            return {
                key: (selectedCountry.toUpperCase() + "(" + group.key + ")"),
                value:{q1: group.value.q1, median: group.value.median, q3: group.value.q3, interQuantileRange: group.value.interQuantileRange,
                    min: group.value.min, max: group.value.max}}
            });
    boxplotGenderDataset = boxplotDatasetUsing.filter(d => d.key.toLowerCase() != selectedCountry.toLowerCase());
    boxplotGenderDataset.push(tmpDataset[0]);
    boxplotGenderDataset.push(tmpDataset[1]);

    // boxplotDatasetUsing.delete;
    console.log(boxplotGenderDataset);
}

function drawDirectionBoxplot() {
console.log("drawing boxplot direction");
    var tmpDataset;
    if(selectedCountry){
        filterDatasetGender();
        tmpDataset = boxplotGenderDataset;
    } else {
        if (studentDirection === "incoming") {
            tmpDataset = boxplotDatasetReceiving
        } else {
            tmpDataset = boxplotDatasetSending
        }
    }
    sortBoxplotDatasetAlphabeticaly(tmpDataset);

    console.log(tmpDataset);

    // Change the main vertical lines
    boxplotSvg.selectAll(".mainLine")
        .data(tmpDataset)
        .transition()
        .duration(750)
        .attr("y1", function(d){return(boxplotYscale(d.value.min))})
        .attr("y2", function(d){return(boxplotYscale(d.value.max))});

    // change rectangle for the main boxes
    boxplotSvg.selectAll(".box")
        .data(tmpDataset)
        .transition()
        .duration(750)
        .attr("y", function(d){return(boxplotYscale(d.value.q3))})
        .attr("height", function(d){return(boxplotYscale(d.value.q1)-boxplotYscale(d.value.q3))});

    // Change the median
    boxplotSvg.selectAll(".medianLine")
        .data(tmpDataset)
        .transition()
        .duration(750)
        .attr("y1", function(d){return(boxplotYscale(d.value.median))})
        .attr("y2", function(d){return(boxplotYscale(d.value.median))});

    // Change the median
    boxplotSvg.selectAll(".minLine")
        .data(tmpDataset)
        .transition()
        .duration(750)
        .attr("y1", function(d){return(boxplotYscale(d.value.min))})
        .attr("y2", function(d){return(boxplotYscale(d.value.min))});

    // Change the median
    boxplotSvg.selectAll(".maxLine")
        .data(tmpDataset)
        .transition()
        .duration(750)
        .attr("y1", function(d){return(boxplotYscale(d.value.max))})
        .attr("y2", function(d){return(boxplotYscale(d.value.max))});
}

function sortBoxplotDatasetAlphabeticaly(dataset) {
    console.log("sorting Alphabeticaly");
    dataset.sort(function (a,b) {
        return d3.ascending(a.key, b.key);
    })
}