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

d3.csv("./data/map/corstudentcount.csv").then(function (data) {
    bchStudentData = data;
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
        .attr("fill", "#ffca6e")
        .attr("opacity", "0.7")
        .attr("stroke-width", "0")
        .attr("class", "bar")
        .on('mouseover', d => events.call('barOnMouseOver', d.ISO.toLowerCase(), d.ISO.toLowerCase()))
        .on('mouseout', d => events.call('barOnMouseOut', d.ISO.toLowerCase(), d.ISO.toLowerCase()))
        .on('click', d => selectedCountry === d.ISO.toLowerCase()
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.ISO.toLowerCase(), d.ISO.toLowerCase()));

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


    //selectedCountry line - not visible
    bchSvg
        .append('line')
        .attr("x1", 0)
        .attr("x2", bchWidth)
        .attr("y1", bchHeight)
        .attr("y2", bchHeight)
        .attr("stroke", "rgba(0,0,0,0)")
        .attr("id","countryLine");
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

    sortDatasetAlphabeticaly();

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("height", function (d) {
            return bchHeight - bchYscale(d.RentIndex);
        })
        .attr("y", function (d) { return bchYscale(d.RentIndex)})
        .attr("fill", function(d) {
            if(d.ISO.toLowerCase() === selectedCountry.toLowerCase()){
                return "red";
            } else {
                return "#e6df60";
            }
        });

    if(!selectedCountry) {
        bchSvg.selectAll("rect")
            .data(bchDataset)
            .select("title")
            .text(function (d) {
                return d.RentIndex;
            });
    }

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

    sortDatasetAlphabeticaly();

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("y", function (d) {
            return bchYscale(d.DomesticBeer);
        })
        .attr("height", function (d) {
            return bchHeight - bchYscale(d.DomesticBeer);
        })
        .attr("fill", function(d) {
            if(d.ISO.toLowerCase() === selectedCountry.toLowerCase()){
                return "red";
            } else {
                return "#cda555";
            }
        });

    // if(selectedCountry) {
        bchSvg.selectAll("rect")
            .data(bchDataset)
            .select("title")
            .text(function (d) {
                return d.DomesticBeer;
            });
    // }

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

    sortDatasetAlphabeticaly();

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(1000)
        .attr("height", function(d) { return bchHeight - bchYscale(d.cost); })
        .attr("y", function(d) { return bchYscale(d.cost); })
        .attr("fill", function(d) {
            if(d.ISO.toLowerCase() === selectedCountry.toLowerCase()){
                return "red";
            } else {
                return "#ffca6e";
            }
        });

    if(!selectedCountry) {
        bchSvg.selectAll("rect")
            .data(bchDataset)
            .select("title")
            .text(function (d) {
                return d.cost;
            });
    }

    bchSvg.select("#ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (bchMargin.left/2)-8)
        .attr("x",0 - bchHeight / 2)
        .attr("fill", "black")
        .attr("font-size", 11)
        .text("Index");
}

function changePriceParameter() {
    var dropdown = document.getElementById("barchart_dropdown_parameter");
    var dropdownVal = dropdown.value.toLowerCase();

    if(dropdownVal === "ri") {
        generateRentalPrice();
    } else if (dropdownVal === "bp") {
        generateBeerPrice();
    } else {
        generateCostOfLiving();
    }
    drawSelectedCountryLine();
}

function drawBarchart() {

    sortBars();
    colourSelectedCountry();
    drawSelectedCountryLine();
}

function sortBars() {
    sortDataset();

    bchXscale.domain(bchDataset.map(function(d) {
        return (d.ISO);
    }));

    bchSvg.selectAll("rect")
        .transition()
        .duration(750)
        .attr("x", function(d, i) {
            return bchXscale(d.ISO);
        });

    var studentRow;
    if(selectedCountry) {
        if(studentDirection === "incoming"){
            studentRow = bchStudentData.map(function (d) {
                return [d["country"], d[selectedCountry]]
            });

            bchSvg.selectAll("rect")
                .select("title")
                .text(function (d) {
                    var countryA = studentRow.filter(a => a[0].toLowerCase() === d.ISO.toLowerCase())[0];
                    return ("incoming students: " + countryA[1]);
                });
        } else {
            studentRow = Object.entries(bchStudentData.filter(d => d.country.toLowerCase() === selectedCountry.toLowerCase())[0]);
            studentRow.splice(0, 1);
            bchSvg.selectAll("rect")
                .select("title")
                .text(function (d) {
                    var countryA = studentRow.filter(a => a[0].toLowerCase() === d.ISO.toLowerCase())[0];
                    return ("outgoing students: " + countryA[1]);
                });
        }
    }

    var transition = bchSvg.transition().duration(750);

    transition.select(".bchXaxis")
        .call(bchXaxis);
}


function sortDataset() {
    if(selectedCountry) {
        if (studentDirection === "incoming") {
            sortDatasetIncoming();
        } else {
            sortDatasetOutgoing();
        }
    } else {
        sortDatasetAlphabeticaly();
    }
}

function sortDatasetOutgoing() {
    var studentRow = Object.entries(bchStudentData.filter(d => d.country.toLowerCase() === selectedCountry.toLowerCase())[0]);
    studentRow.splice(0, 1);

    console.log("sorting Outgoing");

    bchDataset.sort(function(a, b) {
        var countryA = studentRow.filter(d => d[0].toLowerCase() === a.ISO.toLowerCase());
        var countryB = studentRow.filter(d => d[0].toLowerCase() === b.ISO.toLowerCase());
        if(countryA[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            console.log("Country A: " + countryA);
            return 1;
        } else if (countryB[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            console.log("Country B: " + countryB);
            return -1;
        } else
        return countryB[0][1] - countryA[0][1];
    });
}

//sorting the dataset based on the number o incoming students for selected country
function sortDatasetIncoming() {
    console.log("sorting Incoming");

     var studentRow = bchStudentData.map(function (d) {
        return [d["country"], d[selectedCountry]]
    });

    console.log(studentRow);

    bchDataset.sort(function(a, b) {
        var countryA = studentRow.filter(d => d[0].toLowerCase() === a.ISO.toLowerCase());
        var countryB = studentRow.filter(d => d[0].toLowerCase() === b.ISO.toLowerCase());

        if (countryA[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            console.log("Country A: " + countryA);
            return 1;
        } else if (countryB[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            console.log("Country B: " + countryB);
            return -1;
        } else {
            return countryB[0][1] - countryA[0][1];
        }
    });
}

function sortDatasetAlphabeticaly() {
    console.log("sorting Alphabeticaly");
    bchDataset.sort(function (a,b) {
        return d3.ascending(a.ISO, b.ISO);
    })
}

function colourSelectedCountry() {
    var dropdown = document.getElementById("barchart_dropdown_parameter");
    var dropdownVal = dropdown.value.toLowerCase();

    bchSvg.selectAll("rect")
        .attr("fill", function(d) {
            if(d.ISO.toLowerCase() === selectedCountry.toLowerCase()){
                return "red";
            } else {
                if (dropdownVal === "ri") {
                    return "#e6df60";
                } else if (dropdownVal === "bp") {
                    return "#cda555";
                } else {
                    return "#ff8000";
                }
            }
        })
}

//drawing line for the selected country (and make it invisible again if the country is unselected)
function drawSelectedCountryLine() {
    var dropdown = document.getElementById("barchart_dropdown_parameter");
    var dropdownVal = dropdown.value.toLowerCase();

    var oneRow = bchDataset.filter(d => d.ISO.toLowerCase() === selectedCountry);
    var lineValue;

    if(selectedCountry) {
        if (!dropdownVal.localeCompare("ri")) {
            lineValue = oneRow[0].RentIndex;
        } else if (!dropdownVal.localeCompare("bp")) {
            lineValue = oneRow[0].DomesticBeer;
        } else {

            lineValue = oneRow[0].cost;
        }
        console.log("bch:" + selectedCountry + ":" + lineValue);
        console.log("bchHeight:" + bchHeight);

        bchSvg.selectAll("#countryLine")
            .transition()
            .duration(1000)
            .attr("x1", 0)
            .attr("x2", bchWidth)
            .attr("y1", function (d) {
                return bchYscale(lineValue);
            })
            .attr("y2", function (d) {
                return bchYscale(lineValue)
            })
            .attr("stroke", "red")
    } else {
        bchSvg.selectAll("#countryLine")
            .transition()
            .duration(1000)
            .attr("x1", 0)
            .attr("x2", bchWidth)
            .attr("y1", bchHeight)
            .attr("y2", bchHeight)
            .attr("stroke", "rgba(0,0,0,0)");
    }
}

function highlightBarchart(highlitedState) {
    bchSvg.selectAll(".bar")
        .attr("opacity", d => (d.ISO.toLowerCase() === highlightedState.toLowerCase()) ? 1 : 0.7)
        .attr("stroke-width", d => (d.ISO.toLowerCase() === highlightedState.toLowerCase()) ? 1 : 0);
}

//nefunguje zvýraznění v sankey při mouse hover na barchartu
//barevná škála pro znázormění počtu studentů
//z pevné šířky na procenta - zmízí osy