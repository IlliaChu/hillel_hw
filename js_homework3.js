// Варіант 1
let number = 2;
let result = number * number * number; // перемножуємо number x3 рази

console.log("Варіант 1: " + result);


// Варіант 2
let value_1 = 2;
let value_2 = 3;
let result_1 = 1;

for (let i = 0; i < value_2; i++) { // "i" прирівнюємо до 0, якщо i < 3, то додаємо інкремент +1 починаючи з 0; digit_2 = 3 значить буде йти до 3
                                    // цикл закінчиться коли "i" досягне 2 через i++, 3<3 = false
    result_1 *= value_1; // result_1 у нас 1 *= 2, отримуємо 2 і в резалт підставляється 2 * 2 = 4, потім 4 * 2 = 8
}

console.log("Варіант 2: " + result_1); 


// Варіант 3 (pow)
var value_3 = 2;
var value_4 = 3;

console.log("Варіант 3: " + Math.pow(value_3, value_4));


// Варіант 4 (який не використовувати)
var value_5 = 2;
var value_6 = 3;

console.log("Варіант 4: " + value_5 ** value_6); // ** - піднесення до степеня


/*Признаюсь чесно, моменти з Варіант 2 прийшлось розібрати покроково
Дякую!*/