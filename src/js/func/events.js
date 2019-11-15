// Global variables used in all of the scripts
var studentDirection = "incoming";
var selectedCountry = "";

var events = d3.dispatch("stateHoverEvent", "stateSelectedEvent", "studentDirectionEvent");

events.on("stateHoverEvent", function(state){
    console.log("StateHoverEvent called with \"" + state + "\"");
});

events.on("stateSelectedEvent", function(countryShortcut){
    console.log("StateSelectedEvent called with \"" + countryShortcut + "\"");
    selectedCountry = countryShortcut;

    // Draw the lines if the selected state is not null
    if (countryShortcut === "") {
        clearLines();
        document.getElementById("dropdown_country").value = "";
    } else {
        drawLines(selectedCountry);
        document.getElementById("dropdown_country").value = selectedCountry.toLowerCase();
    }
});

events.on("studentDirectionEvent", function(direction) {
    console.log("StudentDirectionEvent called with \"" + direction + "\"");
    studentDirection = direction;

    // Set the dropdown menu
    document.getElementById("dropdown_direction").value = direction;

    // Update or draw lines only if a country is selected
    if (selectedCountry !== "") {
        clearLines();
        drawLines(selectedCountry);
    }
});