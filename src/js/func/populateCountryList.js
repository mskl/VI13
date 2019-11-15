function populateCountryList() {
    let select = document.getElementById("dropdown_country");

    for(let i = 0; i < countryData.values().length; i++) {
        let opt = countryData.values()[i];
        let el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.country.toLocaleLowerCase();
        select.appendChild(el);
    }
}