console.log("Hello World");

let nowDate: Date = new Date();
let otherDate: Date = new

for (let i: number = 0; i < allProducts[platzierungArray].dates.length; i++) {
    if (allProducts[platzierungArray].dates[i].dueDate.getFullYear() <= nowDate.getFullYear()) {
        allProducts[platzierungArray].dates.splice(i, 1);
    } else if (allProducts[platzierungArray].dates[i].dueDate.getMonth() <= nowDate.getMonth()) {
        allProducts[platzierungArray].dates.splice(i, 1);
    } else if (allProducts[platzierungArray].dates[i].dueDate.getDay() <= nowDate.getDate()) {
        allProducts[platzierungArray].dates.splice(i, 1);
    }
}