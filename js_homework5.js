var services = {
    "стрижка": "60 грн",
    "гоління": "80 грн",
    "Миття голови": "100 грн" // 240
};
services['Розбити скло'] = "200 грн"; // + 200 = 440



//Загальна ціна
function price() {
    let total = 0; //для сумування всіх чисел

    for (let key in services) { //цикл, щоб пройти по об`єкту
        let value = services[key]; //перебираємо ключі об`єкта, отримуємо їх значення і кладемо у велю
        let number = parseInt(value); //парсимо значення в Інт
        total = total + number; //сумуємо для виведення 
    }

    console.log("Ціна разом:", total); //виводимо в консоль
}
price()



//Мінімальна ціна
function minPrice() {
    let min_price = 100000000 //встановлюємо поріг, якщо значення буде менше за min_price, то це мінімальна ціна

    for (let key in services) { //цикл, щоб пройти по об`єкту
        let value = services[key];
        let number = parseInt(value);

        if (number <= min_price && number >= 0) // якщо число <= мінімальної ціни, то перезаписуємо на мінімальне число
            min_price = number; //додав ще перевірку на від`ємні числа && number >= 0
    }
    console.log("Мінімальна ціна:", min_price);
}
minPrice()



//Максимальна ціна
function maxPrice() {
    let max_price = 0;

    for (let key in services) {
        let value = services[key];
        let number = parseInt(value);

        if (number > max_price) // якщо число більше 0, то перезаписуємо, і перезаписуємо якщо кожне число більше попереднього
            max_price = number;
    }
    console.log("Максимальна ціна:", max_price);
}
maxPrice()