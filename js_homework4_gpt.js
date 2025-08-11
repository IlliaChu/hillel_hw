let value_total = 0;
let value_even = 0;
let value_odd = 0;

function randomDigit() {
    let random_digit = Math.random();
    random_digit = random_digit * 900; 
    random_digit = random_digit + 100;
    random_digit = Math.round(random_digit);

    if (random_digit >= 100 && random_digit <= 1000) {
        console.log('Generated Success = ' + random_digit);
        value_total++;

        if (random_digit % 2 === 0) {
            value_even++;
        } else {
            value_odd++;
        }

    } else {
        console.log('Less 100 or Higher 1000 = ' + random_digit);
    }
}

for (let i = 0; i < 900; i++) {
    randomDigit();
}

console.log('Загальна кількість успішних: ' + value_total);
console.log('Парних: ' + value_even + ' (' + ((value_even / value_total) * 100).toFixed(2) + '%)');
console.log('Непарних: ' + value_odd + ' (' + ((value_odd / value_total) * 100).toFixed(2) + '%)');