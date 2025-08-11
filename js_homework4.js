let count_digit = 0
let random_digit = 0

function randomDigit() {
    var random_digit = Math.random();
    random_digit = random_digit * 900;
    random_digit = random_digit + 100;
    random_digit = Math.round(random_digit);

    if (random_digit >= 100 && random_digit <= 1000) {
        console.log('Generated Success = ' + random_digit);
        count_digit++;
        }else {
        console.log('Less 100 or Higher 1000 = ' + random_digit);
        }
    }   
for (var i = 0; i < 10; i++) {
    randomDigit();
}
console.log('Generated digits: ' + count_digit);
