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
console.log(Exceptor(words)); 