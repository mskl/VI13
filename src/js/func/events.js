// Global variables used in all of the scripts
var studentDirection = "incoming";
var selectedCountry = "";

var events = d3.dispatch("stateHoverEvent", "stateSelectedEvent", "studentDirectionEvent");

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
events.on("stateHoverEvent", function(state){
    console.log("StateHoverEvent called with \"" + state + "\"");
    assertStateCode(state);
});

/**
 * Is called when a state is selected.
 */
events.on("stateSelectedEvent", function(code){
    console.log("StateSelectedEvent called with \"" + code + "\"");
    assertStateCode(code);

    // Update the global variable
    selectedCountry = code;

    // Draw the lines if the selected state is not null
    if (code === "") {
        drawLines("",);
        document.getElementById("dropdown_country").value = "";
    } else {
        drawLines(selectedCountry, false);
        document.getElementById("dropdown_country").value = selectedCountry.toLowerCase();
    }
});

/**
 * Is called when direction of the students is called.
 */
events.on("studentDirectionEvent", function(direction) {
    console.log("StudentDirectionEvent called with \"" + direction + "\"");
    assertStudentDirection(direction);

    // Update the global variable
    studentDirection = direction;

    // Set the dropdown menu
    document.getElementById("dropdown_direction").value = direction;

    // Update or draw lines only if a country is selected
    if (selectedCountry !== "") {
        drawLines(selectedCountry);
    }
});