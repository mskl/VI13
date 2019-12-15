//visualisation is based on the code on website: https://www.d3-graph-gallery.com/graph/barplot_basic.html
var bchDataset;
var bchMargin = {top: 20, right: 20, bottom: 60, left: 40};

let bchSvg = d3.select("#barchart > svg"),
    bchWidth = +bchSvg.style("width").replace("px", ""),
    bchHeight = +bchSvg.style("height").replace("px", "");

let selectedBubbleColor = d3.scaleSequential().domain([0, 0.40]).interpolator(d3.interpolatePuRd);

var bchXscale = d3.scaleBand();
var bchXaxis = d3.axisBottom();
var bchYscale = d3.scaleLinear();
var bchYaxis = d3.axisLeft();

var studentRow;
var selectedCountryName;
var bchtotalStudentCount;

var bchBarTip = d3.tip().attr('class', 'd3-tip').html(
    function(d, students ){
        var content = "";
        content += `<span style='margin-left: 1.5px;'><b>` + d.name + `</b></span><br>`;
        if(!selectedCountry || selectedCountry.toLowerCase() === d.ISO.toLowerCase()) {
            content += `
                        <table style="margin-top: 2.5px;">
                                <tr><td style="text-align: left;"> ` + "Cost of living: " + `</td><td>` + d.cost + "\n" + `</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Rental index: " + `</td><td>` + d.RentIndex + "\n" + `</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Beer price: " + `</td><td>` + Math.round(d.DomesticBeer * 10 + Number.EPSILON) / 10 + " \€\n" + `</td> </tr>
                        </table>
                        `;
        } else {
            var numberStudent;
            if (selectedCountry) {
                numberStudent = studentRow.filter(a => a[0].toLowerCase() === d.ISO.toLowerCase())[0];
                if (bchtotalStudentCount === 0) {
                    bchtotalStudentCount = 1;
                }
                if (studentDirection == "outgoing") {
                    content += `
                        <table style="margin-top: 2.5px;">
                                <tr><td style="text-align: left;"> ` + "Cost of living: " +`</td><td>`+ d.cost + "\n" +`</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Rental index: " +`</td><td>`+ d.RentIndex + "\n" +`</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Beer price: " +`</td><td>`+ Math.round( d.DomesticBeer * 100 + Number.EPSILON ) / 100 + " \€\n" +`</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Students coming from " + selectedCountryName + ":" + `</td><td>` + numberStudent[1] + `</td> </tr>
                                <tr><td style="text-align: left;"> ` + "    → Percentage:" + `</td><td>` + (numberStudent[1]/bchtotalStudentCount * 100).toFixed(1) + "\%" +`</td> </tr>
                        </table>
                        `;
                } else {
                    content += `
                        <table style="margin-top: 2.5px;">
                                <tr><td style="text-align: left;"> ` + "Cost of living: " +`</td><td>`+ d.cost + "\n" +`</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Rental index: " +`</td><td>`+ d.RentIndex + "\n" +`</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Beer price: " +`</td><td>`+ Math.round( d.DomesticBeer * 100 + Number.EPSILON ) / 100 + " \€\n" +`</td> </tr>
                                <tr><td style="text-align: left;"> ` + "Students going to " + selectedCountryName + ":" + `</td><td>` + numberStudent[1] + `</td> </tr>
                                <tr><td style="text-align: left;"> ` + "    → Percentage:" + `</td><td>` + (numberStudent[1]/bchtotalStudentCount * 100).toFixed(1) + "\%" +`</td> </tr>
                        </table>
                        `;
                }
            }
        }
        return content;
    }).direction(function (d) {
    if (d.index > 34){
        return "nw"
    }
    else return "ne"});

// Translate the SVG
bchSvg = bchSvg.append("g")
    .attr("transform", "translate(" + bchMargin.left + "," + bchMargin.top + ")");

d3.csv("./data/costsofliving.csv").then(function (data) {
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
        .range([0, bchWidth - bchMargin.left - bchMargin.right])
        .domain(bchDataset.map(function (d) {
            return d.ISO;
        }))
        .padding(0.2);
    bchXaxis
        .scale(bchXscale);
    bchSvg.append("g")
        .attr("transform", "translate(0," + (bchHeight - bchMargin.top - bchMargin.bottom) + ")")
        .attr("class", "bchXaxis")
        .call(bchXaxis)
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

// Add Y axis
    bchYscale
        .domain([0, 130])
        .range([bchHeight - bchMargin.top - bchMargin.bottom, 0]);
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
            return (bchHeight - bchMargin.top - bchMargin.bottom) - bchYscale(d.cost);
        })
        .attr("fill", "#ffca6e")
        .attr("opacity", "0.7")
        .attr("stroke-opacity", "0.3")
        .attr("class", "bar")
        .on('mouseover', function(d){
            bchBarTip.show(d);
            events.call('barOnMouseOver', d.ISO.toLowerCase(), d.ISO.toLowerCase())
        })
        .on('mouseout', function(d){
            bchBarTip.hide();
            events.call('barOnMouseOut', d.ISO.toLowerCase(), d.ISO.toLowerCase())
        })
        .on('click', d => selectedCountry === d.ISO.toLowerCase()
            ? events.call('stateSelectedEvent', "", "")
            : events.call('stateSelectedEvent', d.ISO.toLowerCase(), d.ISO.toLowerCase()));

    bchSvg.call(bchBarTip);

    bchSvg.append("text")
        .attr("fill", "black")
        .attr("font-size", 11)
        .attr("y", bchHeight-bchMargin.bottom+10)
        .attr("x", bchWidth/2)
        .attr("id","xlabel")
        .text("Country");

    bchSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("stroke", "black")
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

    bchSvg.selectAll("indPoints")
        .data(bchDataset)
        .enter()
        .append("circle")
        .attr("cx", function(d){
            return (bchXscale(d.ISO)+bchWidth/68-2);})
        .attr("cy", bchHeight)
        .attr("stroke", "rgba(0,0,0,0)")
        .attr("r",bchWidth/68-1)
        .attr("fill", "rgba(0,0,0,0)")
        .attr("class","studentsBubble");
}

function generateRentalPrice() {

    //visualisation of rental index
    bchYscale
        .domain([0, 60])
        .range([bchHeight - bchMargin.top - bchMargin.bottom, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.select(".bchYaxis")
        .call(bchYaxis);

    sortDatasetAlphabeticaly();

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(750)
        .attr("height", function (d) {
            return bchHeight - bchMargin.top - bchMargin.bottom - bchYscale(d.RentIndex);
        })
        .attr("y", function (d) { return bchYscale(d.RentIndex)})
        .attr("fill", "#e6df60");

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
        .text("Index");
}

function generateBeerPrice() {
    //visualisation of Beer price
    bchYscale
        .domain([0, 4])
        .range([bchHeight - bchMargin.top - bchMargin.bottom, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.select(".bchYaxis")
        .call(bchYaxis);

    sortDatasetAlphabeticaly();

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(750)
        .attr("y", function (d) {
            return bchYscale(d.DomesticBeer);
        })
        .attr("height", function (d) {
            return bchHeight - bchMargin.top - bchMargin.bottom - bchYscale(d.DomesticBeer);
        })
        .attr("fill", "#cda555");

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
        .text("EUR");
}

function generateCostOfLiving() {
//visualisation back on cost of living
    bchYscale
        .domain([0, 130])
        .range([ bchHeight - bchMargin.top - bchMargin.bottom, 0]);
    bchYaxis
        .scale(bchYscale);
    bchSvg.select(".bchYaxis")
        .call(bchYaxis);

    sortDatasetAlphabeticaly();

    bchSvg.selectAll("rect") //same code, but now we only change values
        .data(bchDataset)
        .transition() //add smooth transition
        .duration(750)
        .attr("height", function(d) { return bchHeight - bchMargin.top - bchMargin.bottom - bchYscale(d.cost); })
        .attr("y", function(d) { return bchYscale(d.cost); })
        .attr("fill", "#ffca6e");

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
        .text("Index");
}

function changeDropdownParameter() {
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
    positionBubbles();
}

function drawBarchart() {
    sortBars();
    colourSelectedCountry();
    positionBubbles();
    drawSelectedCountryLine();
    colorBubbles();
}
function sortBars() {
    sortDataset();

    bchXscale.domain(bchDataset.map(function(d) {
        if(d.ISO.toLowerCase() === selectedCountry.toLowerCase()) {
            selectedCountryName = d.name;
        }
        return (d.ISO);
    }));

    bchSvg.selectAll("rect")
        .transition()
        .duration(750)
        .attr("x", function(d, i) {
            return bchXscale(d.ISO);
        });

    if(selectedCountry) {
        if(studentDirection === "outgoing"){
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
        bchSvg.select("#xlabel")
            .attr("x", bchWidth/2)
            .text("Country (sorted by popularity)");
    } else {
        bchSvg.select("#xlabel")
            .attr("x", bchWidth/2)
            .text("Country");
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

function sortDatasetIncoming() {
    studentRow = Object.entries(bchStudentData.filter(d => d.country.toLowerCase() === selectedCountry.toLowerCase())[0]);
    studentRow.splice(0, 1);

    console.log("sorting Outgoing");

    bchDataset.sort(function(a, b) {
        var countryA = studentRow.filter(d => d[0].toLowerCase() === a.ISO.toLowerCase());
        var countryB = studentRow.filter(d => d[0].toLowerCase() === b.ISO.toLowerCase());
        if(countryA[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            return 1;
        } else if (countryB[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            return -1;
        } else
        return countryB[0][1] - countryA[0][1];
    });
}

//sorting the dataset based on the number o incoming students for selected country
function sortDatasetOutgoing() {
     studentRow = bchStudentData.map(function (d) {
        return [d["country"], d[selectedCountry]]
    });

    bchDataset.sort(function(a, b) {
        var countryA = studentRow.filter(d => d[0].toLowerCase() === a.ISO.toLowerCase());
        var countryB = studentRow.filter(d => d[0].toLowerCase() === b.ISO.toLowerCase());

        if (countryA[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
            return 1;
        } else if (countryB[0][0].toLowerCase() === selectedCountry.toLowerCase()) {
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
        .attr("stroke", function(d) {
            if (d.ISO.toLowerCase() === selectedCountry.toLowerCase()) {
                return "red";
            } else {
                return "black";
            }
        })
        .attr("stroke-opacity", function(d) {
            if (d.ISO.toLowerCase() === selectedCountry.toLowerCase()) {
                return "1";
            } else {
                return "0.3";
            }
        })
        .attr("stroke-width", function(d) {
        if (d.ISO.toLowerCase() === selectedCountry.toLowerCase()) {
            return "1.5";
        } else {
            return "1";
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

        bchSvg.selectAll("#countryLine")
            .transition()
            .duration(750)
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
            .duration(750)
            .attr("x1", 0)
            .attr("x2", bchWidth)
            .attr("y1", bchHeight - bchMargin.top - bchMargin.bottom)
            .attr("y2", bchHeight - bchMargin.top - bchMargin.bottom)
            .attr("stroke", "rgba(0,0,0,0)");
    }
}

function highlightBarchart(highlitedState) {
    bchSvg.selectAll(".bar")
        .attr("opacity", d => (d.ISO.toLowerCase() === highlightedState.toLowerCase()) ? 1 : 0.7)
}

function positionBubbles(){
    if(selectedCountry)
    {
        var dropdown = document.getElementById("barchart_dropdown_parameter");
        var dropdownVal = dropdown.value.toLowerCase();

        if (!dropdownVal.localeCompare("ri")) {
            bchSvg.selectAll(".studentsBubble")
                .transition()
                .duration(750)
                .attr("cx", function (d) {
                    return (bchXscale(d.ISO) + bchWidth / 68 - 2);
                })
                .attr("cy", function (d) {
                    return (bchYscale(d.RentIndex) - 12)
                })
        } else if (!dropdownVal.localeCompare("bp")) {
            bchSvg.selectAll(".studentsBubble")
                .transition()
                .duration(750)
                .attr("cx", function (d) {
                    return (bchXscale(d.ISO) + bchWidth / 68 - 2);
                })
                .attr("cy", function (d) {
                    return (bchYscale(d.DomesticBeer) - 12)
                })
        } else {
            bchSvg.selectAll(".studentsBubble")
                .transition()
                .duration(750)
                .attr("cx", function (d) {
                    return (bchXscale(d.ISO) + bchWidth / 68 - 2);
                })
                .attr("cy", function (d) {
                    return (bchYscale(d.cost) - 12)
                })
        }
    } else {
        bchSvg.selectAll(".studentsBubble")
            .transition()
            .duration(750)
            .attr("cx", function (d) {
                return (bchXscale(d.ISO) + bchWidth / 68 - 2);
            })
            .attr("cy", bchHeight - bchMargin.top - bchMargin.bottom)
    }
}

function colorBubbles() {
    if(selectedCountry)
    {
        studentRow;
        if(studentDirection === "outgoing") {
            studentRow = bchStudentData.map(function (d) {
                return [d["country"], d[selectedCountry]]
            });
        } else {
            studentRow = Object.entries(bchStudentData.filter(d => d.country.toLowerCase() === selectedCountry.toLowerCase())[0]);
            studentRow.splice(0, 1);
        }

        bchtotalStudentCount = studentRow.map(d => d[1]).reduce((x, y) => parseInt(x) + parseInt(y));

        bchSvg.selectAll(".studentsBubble")
            // .transition()
            // .duration(750)
            .attr("stroke", function (d) {
                var tmp = studentRow.filter(function (g) {
                    return g[0].toLowerCase() === d.ISO.toLowerCase();
                });
                if (tmp[0][0].toLowerCase() !== selectedCountry) {
                    return "black";
                } else {
                    return "rgba(0,0,0,0)"
                }
            })
            .attr("stroke-opacity", 0.3)
            .attr("fill", function (d) {
                var tmp = studentRow.filter(function (g) {
                    return g[0].toLowerCase() === d.ISO.toLowerCase();
                });
                if (tmp[0][0].toLowerCase() !== selectedCountry) {
                    return selectedBubbleColor(tmp[0][1] / bchtotalStudentCount);
                } else {
                    return "rgba(0,0,0,0)"
                }
            })

    } else {
        bchSvg.selectAll(".studentsBubble")
            // .transition()
            // .duration(750)
            .attr("stroke", "rgba(0,0,0,0)")
            .attr("r", bchWidth / 68)
            .attr("fill", "rgba(0,0,0,0)");
    }
}
//barevná škála pro znázormění počtu studentů
//z pevné šířky na procenta - zmízí osy