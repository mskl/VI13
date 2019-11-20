function resizeFunc() {
    const headerHeight = 40;
    let windowHeight = window.innerHeight;

    document.getElementById("header").style.height = headerHeight + "px";
    document.getElementById("first-row").style.height = (windowHeight*0.6 - headerHeight/2) + "px";
    document.getElementById("second-row").style.height = (windowHeight*0.4 - headerHeight/2) + "px";
}