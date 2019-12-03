//visualisation is based on the code on website: https://www.d3-graph-gallery.com/graph/barplot_basic.html

var bchDataset;
var bchMargin = {top: 20, right: 20, bottom: 40, left: 40};
bchWidth = 780 - bchMargin.left - bchMargin.right;
bchHeight = 230 - bchMargin.top - bchMargin.bottom;

var bchXscale = d3.scaleBand();
var bchXaxis = d3.axisBottom();
var bchYscale = d3.scaleLinear();
var bchYaxis = d3.axisLeft();


var bchSvg = d3.select("#barchart")
    .append("svg")
    .attr("width", bchWidth + bchMargin.left + bchMargin.right)
    .attr("height", bchHeight + bchMargin.top + bchMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + bchMargin.left + "," + bchMargin.top + ")");


d3.csv("./data/cost-of-living.csv").then(function (data) {
bchDataset = data;
gen_vis();
});

//basic visualisation of cost of living
function gen_vis() {
// X axis
    bchXscale
        .range([0, bchWidth])
        .domain(bchDataset.map(function (d) {
            return d.ISO;
        }))
        .padding(0.2);
    bchXaxis
        .scale(bchXscale);
    bchSvg.append("g")
        .attr("transform", "translate(0," + bchHeight + ")")
        .attr("class", "bchXaxis")
        .call(bchXaxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

// Add Y axis
    bchYscale
        .domain([0, 130])
        .range([bchHeight, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.append("g")
        .attr("class", "bchYaxis")
        .call(bchYaxis);

// Bars
    bchSvg.selectAll("mybar")
        .data(bchDataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return bchXscale(d.ISO);
        })
        .attr("y", function (d) {
            return bchYscale(d.cost);
        })
        .attr("width", bchXscale.bandwidth())
        .attr("height", function (d) {
            return bchHeight - bchYscale(d.cost);
        })
        .attr("fill", "#60e679")
        .attr("opacity", "0.7")
        .attr("class", "bar");

    bchSvg.selectAll("rect").append("title") // adding a title for each bar
        .data(bchDataset)
        .text(function(d) { return d.cost;});

    bchSvg.append("text")
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("y", bchHeight+bchMargin.bottom-10)
        .attr("x", bchWidth/2)
        .text("Country");


    bchSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (bchMargin.left/2)-8)
        .attr("x",0 - bchHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("id","ylabel")
        .text("Index");


}

function generateRentalPrice() {

    //visualisation of rental index
    bchYscale
        .domain([0, 60])
        .range([bchHeight, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.select(".bchYaxis")
        .call(bchYaxis);

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("height", function (d) {
            return bchHeight - bchYscale(d.RentIndex);
        })
        .attr("y", function (d) { return bchYscale(d.RentIndex)})
        .attr("fill","#e6df60")
        .select("title")
        .text(function(d) { return d.RentIndex;});


    bchSvg.select("#ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (bchMargin.left/2)-8)
        .attr("x",0 - bchHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .text("Index");
}

function generateBeerPrice() {
    //visualisation of Beer price
    bchYscale
        .domain([0, 4])
        .range([bchHeight, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.select(".bchYaxis")
        .call(bchYaxis);

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("height", function (d) {
            return bchHeight - bchYscale(d.DomesticBeer);
        })
        .attr("y", function (d) {
            return bchYscale(d.DomesticBeer);
        })
        .attr("fill", "#cda555")
        .select("title")
        .text(function (d) {
            return d.DomesticBeer;
        });

    bchSvg.select("#ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (bchMargin.left / 2) - 8)
        .attr("x", 0 - bchHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .text("EUR");
}

function generateCostOfLiving() {
//visualisation back on cost of living
    bchYscale
        .domain([0, 130])
        .range([ bchHeight, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.select(".bchYaxis")
        .call(bchYaxis);
    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("height", function(d) { return bchHeight - bchYscale(d.cost); })
        .attr("y", function(d) { return bchYscale(d.cost); })
        .attr("fill","#60e679")
        .select("title")
        .text(function(d) { return d.cost;});



    bchSvg.select("#ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (bchMargin.left/2)-8)
        .attr("x",0 - bchHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .text("Index");
}

function changeDropdownParameter() {
    var dropdown = document.getElementById("barchart_dropdown_parameter");
    var dropdownVal = dropdown.value.toLowerCase();

    if(!dropdownVal.localeCompare("ri")) {
        generateRentalPrice();
    } else if (!dropdownVal.localeCompare("bp")) {
        generateBeerPrice();
    } else {
        generateCostOfLiving();
    }
}

function drawBarchart() {
    // console.log("Here");
    // if(selectedCountry){
    // svg.selectAll("rect")
    //     .transition() //add smooth transition
    //     .duration(1000)
    //     .attr("fill","#d47fbc");}else{
    //     svg.selectAll("rect")
    //         .transition() //add smooth transition
    //         .duration(1000)
    //         .attr("fill","#76b3d8")
    // }
}
