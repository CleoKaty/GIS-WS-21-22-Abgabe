//Zeitumrechner
function stringToYear(datestring: string): number {
    let jahr1: number = Number(datestring[0]);
    let jahr2: number = Number(datestring[1]);
    let jahr3: number = Number(datestring[2]);
    let jahr4: number = Number(datestring[3]);
    return jahr1 * 1000 + jahr2 * 100 + jahr3 * 10 + jahr4;
}
function stringToMonth(datestring: string): number {
    let monat1: number = Number(datestring[5]);
    let monat2: number = Number(datestring[6]);
    return monat1 * 10 + monat2;
}
function stringToDay(datestring: string): number {
    let tag1: number = Number(datestring[8]);
    let tag2: number = Number(datestring[9]);
    return tag1 * 10 + tag2;
}