var boxplotDataset;
var boxplotDatasetReceiving;
// set the dimensions and margins of the graph
var boxplotMargin = {top: 20, right: 20, bottom: 40, left: 40},
    boxplotWidth = 750 - boxplotMargin.left - boxplotMargin.right,
    boxplotHeight = 230 - boxplotMargin.top - boxplotMargin.bottom;

var boxplotXscale = d3.scaleBand();
var boxplotYscale = d3.scaleLinear();
var boxplotXaxis = d3.axisBottom();
var boxplotYaxis = d3.axisLeft();

var boxplotMinimum = 0;
var boxplotMaximum = 0;

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
    boxplotDatasetReceiving = data;
    genBoxplotVis();
});
function genBoxplotVis() {
    nestDataset();
    console.log(boxplotDatasetReceiving);

    // Show the X scale
    boxplotXscale
        .range([ 0, boxplotWidth ])
        .domain(boxplotDatasetReceiving.map(function (d) {
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

// Show the Y scale
    boxplotYscale
        .domain([0, 5000])
        .range([boxplotHeight, 0]);
    boxplotYaxis
        .scale(boxplotYscale);
    boxplotSvg.append("g")
        .attr("class", "boxplotYaxis")
        .call(boxplotYaxis);

// Show the main vertical lines
    boxplotSvg.selectAll("vertLines")
        .data(boxplotDatasetReceiving)
        .enter()
        .append("line")
        .attr("x1", function(d){return(boxplotXscale(d.key))})
        .attr("x2", function(d){return(boxplotXscale(d.key))})
        .attr("y1", function(d){return(boxplotYscale(d.value.min))})
        .attr("y2", function(d){return(boxplotYscale(d.value.max))})
        .attr("stroke", "black")
        .attr("stroke-width","1")
        .attr("class", "mainLine")
        .style("width",40)
        .on('mouseover', d => events.call('boxplotOnMouseOver', d.key.toLowerCase(), d.key.toLowerCase()))
        .on('mouseout', d => events.call('boxplotOnMouseOut', d.key.toLowerCase(), d.key.toLowerCase()))
        .on('click', d => selectedCountry === d.key.toLowerCase()
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.key.toLowerCase(), d.key.toLowerCase()));

    // rectangle for the main boxes
    var boxWidth =  15;
    boxplotSvg
        .selectAll("boxes")
        .data(boxplotDatasetReceiving)
        .enter()
        .append("rect")
        .attr("x", function(d){return(boxplotXscale(d.key)-boxWidth/2)})
        .attr("y", function(d){return(boxplotYscale(d.value.q3))})
        .attr("height", function(d){return(boxplotYscale(d.value.q1)-boxplotYscale(d.value.q3))})
        .attr("class","box")
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .attr("stroke-width","0.5")
        .attr("fill", "#d6fc83")
        .on('mouseover', d => events.call('boxplotOnMouseOver', d.key.toLowerCase(), d.key.toLowerCase()))
        .on('mouseout', d => events.call('boxplotOnMouseOut', d.key.toLowerCase(), d.key.toLowerCase()))
        .on('click', d => selectedCountry === d.key.toLowerCase()
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.key.toLowerCase(), d.key.toLowerCase()));

    // Show the median
    boxplotSvg
        .selectAll("medianLines")
        .data(boxplotDatasetReceiving)
        .enter()
        .append("line")
        .attr("x1", function(d){return(boxplotXscale(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(boxplotXscale(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(boxplotYscale(d.value.median))})
        .attr("y2", function(d){return(boxplotYscale(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80);

    // Add individual points with jitter
    // var jitterWidth = 15;
    //
    // boxplotSvg
    //     .selectAll("indPoints")
    //     .data(boxplotDataset)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function(d){
    //         if (d.km < boxplotDatasetReceiving.map(function (g) {return g.key===d.CountryReceiving;}).min || d.km > boxplotDatasetReceiving.map(function (g) {return g.key===d.CountryReceiving;})    .max){console.log("tady");}
    //         return(boxplotXscale(d.CountryReceiving) - jitterWidth/2 + Math.random()*jitterWidth )})
    //     .attr("cy", function(d){return(boxplotYscale(d.km))})
    //     .attr("r", 2)
    //     .style("fill", "white")
    //     .attr("stroke", "black")
}
function nestDataset() {
     boxplotDatasetReceiving = d3.nest() // nest function allows to group the calculation per level of a factor
         .key(function (d) {
             return d.CountryReceiving;
         })
         .rollup(function (d) {
             q1 = d3.quantile(d.map(function (g) {
                 // if(parseInt(g.km, 10) < boxplotMinimum){boxplotMinimum = parseInt(g.km, 10)}
             //     if(parseInt(g.km, 10) > boxplotMaximum){boxplotMaximum = parseInt(g.km, 10)}

                 return parseInt(g.km, 10);
             }).sort(d3.ascending), .25);
             median = d3.quantile(d.map(function (g) {
                 return parseInt(g.km, 10);
             }).sort(d3.ascending), .5);
             q3 = d3.quantile(d.map(function (g) {
                 return parseInt(g.km, 10);
             }).sort(d3.ascending), .75);
             interQuantileRange = q3 - q1;
             min = q1 - 1.5 * interQuantileRange;
             max = q3 + 1.5 * interQuantileRange;


             return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
         })
         .entries(boxplotDataset);
}

function highlightBoxplot(highlitedState) {
    boxplotSvg.selectAll(".box")
        .data(boxplotDatasetReceiving)
        .attr("fill", function (d) {
            if(!selectedCountry || !(d.key.toLowerCase() === selectedCountry.toLowerCase())) {
                if (d.key.toLowerCase() === highlightedState.toLowerCase()) {
                    return "#bdde76"
                } else {
                    return "#d6fc83"
                }
            } else {
                if (d.key.toLowerCase() === highlightedState.toLowerCase()) {
                    return "#7ab005"
                } else {
                    return "#abfa00"
                }
            }
        })
        .attr("stroke-width", d => (d.key.toLowerCase() === highlightedState.toLowerCase()) ? 1.5 : 0.5);

    boxplotSvg.selectAll(".mainLine")
        // .data(boxplotDatasetReceiving)
        .attr("stroke-width", d => (d.key.toLowerCase() === highlightedState.toLowerCase()) ? 2 : 1);
}

function drawBoxplot() {
    if(selectedCountry){
        console.log("selected country BP");
        boxplotSvg.selectAll(".box")
            .data(boxplotDatasetReceiving)
            .attr("fill", d => (d.key.toLowerCase() === highlightedState.toLowerCase()) ? "#abfa00" : "#d6fc83")
    } else {
        boxplotSvg.selectAll(".box")
            .attr("fill", "#d6fc83")
    }
}
