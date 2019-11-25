// Global variables used in all of the scripts
var studentDirection = "incoming";
var selectedCountry = "";

var events = d3.dispatch("stateOnMouseOver", "stateOnMouseOut", "stateSelectedEvent", "studentDirectionEvent");

/**
 * Assert that the country code is valid. Empty is saved as "".
 * @param code Country code in 2 lowercased letters such as "cz".
 */
function assertStateCode(code) {
    if (!["", "at", "be", "bg", "ch", "cy", "cz", "de", "dk", "ee", "es", "fi", "fr",
        "gb", "gr", "hr", "hu", "ie", "is", "it", "li", "lt", "lu", "lv", "mt",
        "nl", "no", "pl", "pt", "ro", "se", "si", "sk", "tr"].includes(code)) {
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

    // highlightState(state);
});

/**
 * Is called when hovered off a state.
 */
events.on("stateOnMouseOut", function(state){
    console.log("StateOnMouseOut called with \"" + state + "\"");
    assertStateCode(state);

    // unHiglightState(state);
});

/**
 * Is called when a state is selected.
 */
events.on("stateSelectedEvent", function(code){
    console.log("StateSelectedEvent called with \"" + code + "\"");
    assertStateCode(code);

    // Update the global variable
    selectedCountry = code;

    // Set the dropdown
    document.getElementById("dropdown_country").value = selectedCountry;

    drawLines(selectedCountry);
    drawChloropleth();
    drawSankey(selectedCountry, studentDirection);
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
    drawSankey(selectedCountry, studentDirection)
});