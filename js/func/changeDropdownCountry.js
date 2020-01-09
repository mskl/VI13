function changeDropdownCountry() {
    let dropdown = document.getElementById("dropdown_country");
    let dropdownVal = dropdown.value.toLowerCase();

    events.call('stateSelectedEvent', dropdownVal, dropdownVal);
}
