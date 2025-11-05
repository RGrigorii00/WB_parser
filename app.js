const express = require('express'); // так подключаем внешнюю библиотеку
const routers = require('./routers.js'); // так подключаем методы из своей библиотеки
const bodyParser = require('body-parser');
const path = require('path');
const { setTimeout } = require('timers');

const app = express(); // объект приложения
app.set('view engine', 'hbs'); // шаблонизатор html-страницы
app.use(express.static('public')); // файлы этой папки будут видны браузеру
app.use(express.static('private'));
app.use(express.urlencoded({extended:true})); // чтобы парсить параметры http-строки запроса
app.use(express.json()); // чтобы видеть тело страницы как json-объект и брать значения объектов DOM`а
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/parse_wb', async (req, res) => {
    try {
        start = performance.now();
        console.log(req.query);
        const products = await routers.parse_wb(req);
        end = performance.now();
        time = ((end - start)/1000).toFixed(8); 
        res.render('index.hbs', { products, time });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Ошибка сервера');
    }
});
app.get('/download1', routers.download1);
app.post('/download1', routers.download1);

app.get('/', routers.index_get);

app.listen(3000, () => console.log(`http://localhost:${3000}/`));
