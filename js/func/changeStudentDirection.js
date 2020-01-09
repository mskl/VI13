function changeStudentDirection() {
    // Direction changed

    let selectedValue = document.getElementById("student_direction").elements["direction"].value;
    events.call('studentDirectionEvent', selectedValue, selectedValue);
}