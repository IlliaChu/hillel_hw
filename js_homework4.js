let count_digit = 0
let random_digit = 0
let evenCount = 0
let oddCount = 0
let count = 1000

function randomDigit() {
    let random_digit = Math.random();
    random_digit = random_digit * 900;
    random_digit = random_digit + 100;
    random_digit = Math.round(random_digit);

    if (random_digit % 2 === 0) {
        console.log(random_digit +' = Even');
        count_digit++;
        evenCount++
    } else {
        count_digit++;
        oddCount++
        console.log(random_digit + ' = Odd');
        }
    }   
for (var i = 0; i < count; i++) {
    randomDigit();
}


console.log('Generated digits: ' + count_digit);
console.log('EvenCount: ' + evenCount);
console.log('OddCount: ' + oddCount);
console.log('Even: ' + evenCount.toFixed(2)/count * 100 + '%') 
console.log('Odd: ' + oddCount.toFixed(2)/count * 100 + '%')
//додав toFixed щоб показувало значення, якщо буде згенеровано більше 10000