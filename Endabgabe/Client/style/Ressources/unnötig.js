"use strict";
//Zeitumrechner
function stringToYear(datestring) {
    let jahr1 = Number(datestring[0]);
    let jahr2 = Number(datestring[1]);
    let jahr3 = Number(datestring[2]);
    let jahr4 = Number(datestring[3]);
    return jahr1 * 1000 + jahr2 * 100 + jahr3 * 10 + jahr4;
}
function stringToMonth(datestring) {
    let monat1 = Number(datestring[5]);
    let monat2 = Number(datestring[6]);
    return monat1 * 10 + monat2;
}
function stringToDay(datestring) {
    let tag1 = Number(datestring[8]);
    let tag2 = Number(datestring[9]);
    return tag1 * 10 + tag2;
}
//# sourceMappingURL=unn%C3%B6tig.js.map