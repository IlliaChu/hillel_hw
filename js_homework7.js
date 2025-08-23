//HW 10.2. Без А

var words = ['Wonderful', 'Joyful', 'Happiness', 'Time', 'Task', 'Apple']


function Exceptor(words) { 
    let result = []; // сюди будемо записувати слова які без Аа
    let index = 0; // починаємо з 0 індексу

    for (let key of words) { //проходимось циклом по масиву
        if (/^[^Aa]{6,}$/.test(key)) { //заперечуємо через ^ літери А і а, від 6 символів
            result[index] = key; // додаємо слово у масив з індексом
            index++ //кожного разу підвищуємо індексацію, щоб не перезаписувало попередній результат
        }
    }
    return result; // повертаємо те що вийшло
}
console.log("HW 10.2. Без А: " + Exceptor(words));



//HW 10.1. Параноя

var arr = [
    {
        userName:"Test",
        lastName:"Test",
        email:"test.test@gmail.com"
    },
    {
        userName:"Dmitro",
        lastName:"Porohov",
        email:"dmitro.porohov@yahoo.com"
        },
    {
        userName:"Andrii",
        lastName:"",
        email:"andrii@mail.ru" // Нам такі не підходять
    },
];


function mail_validation() {
    let result = [];
    let index = 0;
    let regex = /^[A-Za-z0-9._-]+@[A-Za-z0-9]+\.com/; //окремо виніс для зручності корегування + домен .com
    // let regex = /^[A-Za-z0-9._-]+@[A-Za-z0-9]+\.[A-Za-z0-9]{2,3}/; //регекс на кількість символів домену, не тільки .com


    for (let key of arr) { // прохід по масиву
        let email_check = key.email // додав у змінну key.email для використання .endsWith
        let regex_block =
            email_check.endsWith('.ru') ||
            email_check.endsWith('yandex.ru') ||
            email_check.endsWith('yandex.com') // блокуємо вивід з закінченнями

        if (regex.test(email_check) && !regex_block) { // перевіряємо регекс + виключення
            result[index] = email_check;
            index++;
        }
    }
    return result;
}

console.log("HW 10.1. Параноя:\n", mail_validation());
