function changeDropdownDirection() {
    // Direction changed
    let dropdown = document.getElementById("dropdown_direction");
    events.call('studentDirectionEvent', dropdown.value, dropdown.value);
}