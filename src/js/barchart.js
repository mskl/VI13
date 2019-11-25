//visualisation is based on the code on website: https://www.d3-graph-gallery.com/graph/barplot_basic.html

var dataset;
var margin = {top: 30, right: 30, bottom: 70, left: 60};
width = 600 - margin.left - margin.right;
height = 280 - margin.top - margin.bottom;

var svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


d3.csv("./data/cost-of-living.csv").then(function (data) {
dataset = data;
gen_vis();
});

function gen_vis() {

    // append the svg object to the body of the page

    //basic visualisation of cost of living
// X axis
    var xscale = d3.scaleBand()
        .range([0, width])
        .domain(dataset.map(function (d) {
            return d.ISO;
        }))
        .padding(0.2);
    var xaxis = d3.axisBottom()
        .scale(xscale);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "xaxis")
        .call(xaxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

// Add Y axis
    var yscale = d3.scaleLinear()
        .domain([0, 130])
        .range([height, 0]);
    var yaxis = d3.axisLeft()
        .scale(yscale);
    svg.append("g")
        .attr("class", "yaxis")
        .call(yaxis);

// Bars
    svg.selectAll("mybar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return xscale(d.ISO);
        })
        .attr("y", function (d) {
            return yscale(d.cost);
        })
        .attr("width", xscale.bandwidth())
        .attr("height", function (d) {
            return height - yscale(d.cost);
        })
        .attr("fill", "#69b3a2");

    svg.selectAll("rect").append("title") // adding a title for each bar
        .data(dataset)
        .text(function(d) { return d.cost;});
}

function generateRentalPrice() {

    //visualisation of rental index
    yscale = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);
    yaxis = d3.axisLeft()
        .scale(yscale);
    svg.select(".yaxis")
        .call(yaxis);

    svg.selectAll("rect") //same code, but now we only change values
        .data(dataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("height", function (d) {
            return height - yscale(d.RentIndex);
        })
        .attr("fill", "#69b3a2")
        .attr("y", function (d) {
            return yscale(d.RentIndex)
        }).select("title")
        .text(function(d) { return d.RentIndex;});
}

        function generateBeerPrice() {
            //visualisation of Beer price
            yscale = d3.scaleLinear()
                .domain([0, 4])
                .range([ height, 0]);
            yaxis = d3.axisLeft()
                .scale(yscale);
            svg.select(".yaxis")
                .call(yaxis);

            svg.selectAll("rect") //same code, but now we only change values
                .data(dataset)
                .transition() //add smooth transition
                .duration(1000)
                .attr("height", function(d) { return height - yscale(d.DomesticBeer); })
                .attr("fill","#69b3a2")
                .attr("y", function(d) { return yscale(d.DomesticBeer); })
                .select("title")
                .text(function(d) { return d.DomesticBeer;});;
        }

        function generateCostOfLiving() {
    //visualisation back on cost of living
            yscale = d3.scaleLinear()
                .domain([0, 130])
                .range([ height, 0]);
            yaxis = d3.axisLeft()
                .scale(yscale);
            svg.select(".yaxis")
                .call(yaxis);
            svg.selectAll("rect") //same code, but now we only change values
                .data(dataset)
                .transition() //add smooth transition
                .duration(1000)
                .attr("height", function(d) { return height - yscale(d.cost); })
                .attr("fill","#69b3a2")
                .attr("y", function(d) { return yscale(d.cost); })
                .select("title")
                .text(function(d) { return d.cost;});;
        }

function changeDropdownParameter() {
    var dropdown = document.getElementById("dropdown_parameter");
    var dropdownVal = dropdown.value.toLowerCase();

    if(!dropdownVal.localeCompare("ri")) {
        generateRentalPrice();
    } else if (!dropdownVal.localeCompare("bp")) {
        generateBeerPrice();
    } else {
        generateCostOfLiving();
    }
}