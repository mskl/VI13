// Global variables used in all of the scripts
var studentDirection = "outgoing";
var selectedCountry = "";

var events = d3.dispatch("stateOnMouseOver", "stateOnMouseOut", "stateSelectedEvent", "studentDirectionEvent", "sankeyNodeOnMouseOver", "sankeyNodeOnMouseOut", "barOnMouseOver",   "barOnMouseOut", "boxplotOnMouseOver", "boxplotOnMouseOut");

/**
 * Assert that the country code is valid. Empty is saved as "".
 * @param code Country code in 2 lowercased letters such as "cz".
 */
function assertStateCode(code) {
    if (!["", "at", "be", "bg", "ch", "cy", "cz", "de", "dk", "ee", "es", "fi", "fr",
        "gb", "gr", "hr", "hu", "ie", "is", "it", "li", "lt", "lu", "lv", "mt",
        "nl", "no", "pl", "pt", "ro", "se", "si", "sk", "tr", "mk"].includes(code)) {
        throw("Invalid country code \"" + code + "\".");
    }
}

/**
 * Assert that the direction is correct string.
 * @param direction Direction of the student. Values "incoming" or "outgoing".
 */
function assertStudentDirection(direction) {
    if (!["incoming", "outgoing"].includes(direction)) {
        throw("Invalid student direction \"" + direction + "\".");
    }
}

/**
 * Is called when hovered over a state.
 */
events.on("stateOnMouseOver", function(state){
    console.log("StateOnMouseOver called with \"" + state + "\"");
    assertStateCode(state);

    // Highlight the state on the map
    highlightState(state);

    // Draw the lines
    drawLines(selectedCountry, state);

    // Highlight sankeynode
    highlightSankeyNode(state)

    //Highlight bar in barchart
    highlightBarchart(state);

    //Highlight box in boxplot
    highlightBoxplot(state);
});

/**
 * Is called when hovered off a state.
 */
events.on("stateOnMouseOut", function(state){
    console.log("StateOnMouseOut called with \"" + state + "\"");
    assertStateCode(state);

    // Cancel the highlight of the state in the map
    highlightState("");

    // Remove the lines
    drawLines(selectedCountry, "");

    // Unhighlight the SanKey nodes
    unHighlightSankeyNode();

    // Unhighlight the barchart bar
    highlightBarchart("");

    // Unhighlight the box in boxplot
    highlightBoxplot("");
});

/**
 * On mouseover over sankey diagram connection
 */
events.on("sankeyNodeOnMouseOver", function(state){
    assertStateCode(state);
    highlightState(state);
    highlightBarchart(state);
    highlightBoxplot(state);
});

/**
 * On mouseout from the sankey diagram connection
 */
events.on("sankeyNodeOnMouseOut", function(state){
    assertStateCode(state);
    highlightState("");
    highlightBarchart("");
    highlightBoxplot("");
});

/**
 * On mousever over the barchart diagram connection
 */
events.on("barOnMouseOver", function(state){
    assertStateCode(state);
    highlightState(state);
    highlightBarchart(state);
    highlightSankeyNode(state);
    highlightBoxplot(state);
});

/**
 * On mouseout from the barchart diagram connection
 */
events.on("barOnMouseOut", function(state){
    assertStateCode(state);
    highlightState("");
    highlightBarchart("");
    unHighlightSankeyNode();
    highlightBoxplot("");
});

/**
 * On mouseover over the boxplot diagram connection
 */
events.on("boxplotOnMouseOver", function(state){
    assertStateCode(state);
    highlightState(state);
    highlightBarchart(state);
    highlightSankeyNode(state);
    highlightBoxplot(state);
});

/**
 * On mouseout from the boxplot diagram connection
 */
events.on("boxplotOnMouseOut", function(state){
    assertStateCode(state);
    highlightState("");
    highlightBarchart("");
    unHighlightSankeyNode();
    highlightBoxplot("");
});

/**
 * Is called when a state is selected.
 */
events.on("stateSelectedEvent", function(code){
    console.log("StateSelectedEvent called with \"" + code + "\"");
    assertStateCode(code);

    // Update the global variable
    selectedCountry = code;

    // Hide or unhide the buttons
    let dirButtons = document.getElementById("student_direction");
    if (code === "") {
        dirButtons.classList.remove("visible");
        dirButtons.classList.add("hidden");
    } else {
        dirButtons.classList.remove("hidden");
        dirButtons.classList.add("visible");
    }

    // Set the dropdown
    document.getElementById("dropdown_country").value = selectedCountry;

    // Draw the chloropleth
    drawChloropleth();

    // Clear the drawn lines
    drawLines(selectedCountry, "");

    // Draw the sankey
    drawSankey(selectedCountry, studentDirection);

    // Draw the barchart
    drawBarchart();

    //Draw the boxplot
    drawBoxplot();
});

/**
 * Is called when direction of the students is called.
 */
events.on("studentDirectionEvent", function(direction) {
    console.log("StudentDirectionEvent called with \"" + direction + "\"");
    assertStudentDirection(direction);

    // Update the global variable
    studentDirection = direction;

    // Set the direction buttons
    document.getElementById("student_direction").elements["direction"].value = direction;

    drawLines(selectedCountry);
    drawChloropleth();
    drawSankey(selectedCountry, studentDirection);
    drawBarchart();
    drawDirectionBoxplot();
});