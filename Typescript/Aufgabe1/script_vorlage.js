"use strict";
// -- [Aufgabe 1]
/**
 * @var {number} age: Bitte anstatt der 24 dein Alter eintragen
 */
let age = 20;
/**
 * @var {string} firstName: Bitte anstatt 'Max' deinen Vornamen eintragen
 */
let firstName = `Jana`;
function func1(age) {
    return 2021 - age;
}
let output = func2(firstName);
function func3(meal) {
    console.log(`Ich esse gerne ${meal || "Linsensuppe"}.`);
    return func1(age) > 1995
        ? `Ich gehöre zur Generation Z`
        : `Ich gehöre zur Generation Y`;
}
console.log(output);
function func2(name) {
    console.log(`Ich heiße ${name}.`);
    return func3();
}
/* -- HIER BITTE IHRE LÖSUNG ZUR AUFGABE 1 EINTRAGEN
 * Ich heiße Jana.
 * Ich esse gerne Linsensuppe.
 * Ich gehöre zur Generation Z
 */
// -- [Aufgabe 2]
let events = [
    ["Mark Knopfler", 10.1],
    ["Pink Floyd", 15.9],
    ["Metallica", 20.1],
    ["Michael Bublé", 11.1],
    ["Dire Straits", 12.2],
    ["Mariah Carey", 1.1],
    ["Cat Stevens", 12.99],
    ["Mark Forster", 2.1],
    ["Helene Fischer", 3.1],
    ["Bee Gees", 25.2]
];
// -- HIER BITTE IHRE LÖSUNG ZUR AUFGABE 2 EINTRAGEN
// Lösung a) 
let laengearray = events.length;
console.log(laengearray);
// Lösung b)
for (let i = 0; i < events.length; i++) {
    console.log(events[i][0]);
    console.log(events[i][1]);
    console.log("------------");
}
// Lösung c) 
function grossenummer(liste) {
    let gross = 0;
    let stelle = 0;
    for (let i = 0; i < liste.length; i++) {
        if (liste[i][1] > gross) {
            gross = liste[i][1];
            stelle = i;
        }
    }
    console.log(`Die grösste Nummer ist ${gross} von ${liste[stelle][0]}.`);
    return gross;
}
grossenummer(events);
// Lösung d) 
function namensuche(derName, liste) {
    let vorhanden;
    let stelle = 0;
    for (let i = 0; i < liste.length; i++) {
        if (liste[i][0] == derName) {
            vorhanden = true;
            stelle = i;
            break;
        }
    }
    if (vorhanden) {
        console.log(`${derName} ist an Stelle ${stelle}.`);
    }
    else {
        console.log(`Dieser Name ist nicht vorhanden.`);
    }
    return vorhanden;
}
// Lösung e)
function factorial(n) {
    let index = 1;
    let ergebnis = 1;
    while (index <= n) {
        ergebnis *= index;
        index++;
    }
    console.log(ergebnis);
}
factorial(4.5);
factorial(10);
// Lösung f) 
for (let index = 0; index <= 100; index++) {
    let wahr = false;
    if (index % 3 == 0) {
        wahr = true;
    }
    else {
        wahr = false;
    }
    if (wahr == true) {
        console.log(index);
    }
}
// Lösung g)
class ConcertEvents {
    price;
    interpret;
    constructor(price, interpret) {
        this.interpret = interpret;
        this.price = price;
    }
    show() {
        console.log(`the price is ${this.price}.`);
        console.log(`The interpret is ${this.interpret}.`);
    }
}
// Lösung h)
let kunstliste = [];
for (let i = 0; i < events.length; i++) {
    let neu = new ConcertEvents(events[i][1], events[i][0]);
    kunstliste.push(neu);
}
for (let i = 0; i < kunstliste.length; i++) {
    kunstliste[i].show();
}
//# sourceMappingURL=script_vorlage.js.map