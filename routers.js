const fs = require('fs');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const { encode } = require('querystring');
const { setTimeout } = require('timers');



async function parse_wb(req) {
    const json1 = require("./params.json");

    json1.brand = req.query.brand
    json1.page = req.query.page
    json1.sort = req.query.sort
    sort_asc_lod = req.query.json_sort 
    console.log(sort_asc_lod)
    // console.log(json1);
    let jsonString = Object.keys(json1).map(key => `${key}=${json1[key]}`).join('&');

    const finalString = jsonString; 
    var http = "https://search.wb.ru/exactmatch/ru/common/v5/search";
    var url = `${http}?${finalString}`; 
    console.log(url);
    var headers = require("./private/headers.json");
    var resp = await fetch(url,
        {
            "accept": "*/*",
            "accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAzMDM2MTIsInZlcnNpb24iOjIsInVzZXIiOiIxMDcxNjc5NjYiLCJzaGFyZF9rZXkiOiIxNCIsImNsaWVudF9pZCI6IndiIiwic2Vzc2lvbl9pZCI6Ijg5ODY0NWQyZDZkZjRlMWRhN2VhZDBiNmQxNzdlM2M3IiwidXNlcl9yZWdpc3RyYXRpb25fZHQiOjE2Nzg3NzM5ODAsInZhbGlkYXRpb25fa2V5IjoiMmI4YTFkMDk0MzkxYTFhYzNlZmNhZDQ4OWEyZTliNmI3YjQ3YmY5Mzc3ZDE3NjAyYzI4MGJkNTk1ZDhlNTk3ZSIsInBob25lIjoicTY3cElvbjU5NUlkNUZNNVR3SzdDUT09In0.dS61PiO7BkMwi7u4l7NPZQ3LmpT8BAccoQsQusIIBHe1YdUyaxEV9z7mQKLriplJnKUSHvX6Y9LhiBo5KSxx2eJL0ZXmKvkJtOyxfTaS4sleLZ9HJiK8Sms1_-Fz_xDR2YapvyAtnCm5P2V6KiF6KNK9wGD7LgqcuMdMbeSOiKpF84LJxOTmISVNRh7UpYyw66rDIYma56STTMSH_I680Q14_WglYt76ZQigpNF0DCzItuY8je11zQYBzDb0fqLIT5wTZhJg74AlzTxNjmTKhEuB8O_mmBMWBtkJtwClPTw2Gq162Dmn3AaKBhd2AI-09cg2cqyG_sSsDje0htJXPw",
            "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-queryid": "qid382293257170912223720240313074739",
            "x-userid": "107167966",
            "Referer": "https://www.wildberries.ru/catalog/0/search.aspx?search=смартфон",
            "Referrer-Policy": "no-referrer-when-downgrade"
        }
    );
    let json = await resp.json(); 


    const jsonArray = json["data"]["products"];
    let products = json_manip(jsonArray); 
    
    // console.log(json["data"]["products"][0]["sizes"][0]["price"]); 
    
    for (let i = 0; i < 5; i++)  {
        // console.log(products[i])
    }

    if (sort_asc_lod === 'asc') {
        products = lodash.sortBy(products, ["feedbacks"], ["asc"]); 
    }
    else if (sort_asc_lod === "desc") { 
        products = lodash.sortBy(products, ["feedbacks"], ["desc"]); 
    }
    else {} 
    products = JSON.stringify(products, null, 2); 
    fs.writeFileSync("./private/file.json", products, function(error){ if (error) {console.log("Файл успешно записан")} else {} }); 
    return products;
}

function json_manip(jsonArray) {
    const desiredKeys = ['brand', 'name', 'colors.0.name', 'feedbacks', 'reviewRating', 'sizes.0.price.total', 'sizes.0.price.basic'];
    const results = [];
    jsonArray.forEach(obj => {
        const result = {};
        desiredKeys.forEach(key => {
            const keys = key.split('.');
            let value = obj;
            keys.forEach(k => {
                if (value && value.hasOwnProperty(k)) {
                    value = value[k];
                } else {
                    value = null;
                }
            });
            result[key] = value;
        });
        results.push(result);
    });
    return results;
}


// async function parse_wb(req) {
//         const json1 = require("./params.json");

//         json1.brand = req.query.brand
//         json1.page = req.query.page
//         json1.sort = req.query.sort
//         console.log(json1);
//         let jsonString = Object.keys(json1).map(key => `${key}=${json1[key]}`).join('&');

//         const finalString = jsonString;

//         // console.log(finalString);
//         var http = "https://search.wb.ru/exactmatch/ru/common/v5/search";
//         var url = `${http}?${finalString}`;
//         console.log(req.query);
//         console.log(url);
//         var headers = require("./private/headers.json");
//         var resp = await fetch(url,
//             {
//                 "accept": "*/*",
//                 "accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
//                 "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTAzMDM2MTIsInZlcnNpb24iOjIsInVzZXIiOiIxMDcxNjc5NjYiLCJzaGFyZF9rZXkiOiIxNCIsImNsaWVudF9pZCI6IndiIiwic2Vzc2lvbl9pZCI6Ijg5ODY0NWQyZDZkZjRlMWRhN2VhZDBiNmQxNzdlM2M3IiwidXNlcl9yZWdpc3RyYXRpb25fZHQiOjE2Nzg3NzM5ODAsInZhbGlkYXRpb25fa2V5IjoiMmI4YTFkMDk0MzkxYTFhYzNlZmNhZDQ4OWEyZTliNmI3YjQ3YmY5Mzc3ZDE3NjAyYzI4MGJkNTk1ZDhlNTk3ZSIsInBob25lIjoicTY3cElvbjU5NUlkNUZNNVR3SzdDUT09In0.dS61PiO7BkMwi7u4l7NPZQ3LmpT8BAccoQsQusIIBHe1YdUyaxEV9z7mQKLriplJnKUSHvX6Y9LhiBo5KSxx2eJL0ZXmKvkJtOyxfTaS4sleLZ9HJiK8Sms1_-Fz_xDR2YapvyAtnCm5P2V6KiF6KNK9wGD7LgqcuMdMbeSOiKpF84LJxOTmISVNRh7UpYyw66rDIYma56STTMSH_I680Q14_WglYt76ZQigpNF0DCzItuY8je11zQYBzDb0fqLIT5wTZhJg74AlzTxNjmTKhEuB8O_mmBMWBtkJtwClPTw2Gq162Dmn3AaKBhd2AI-09cg2cqyG_sSsDje0htJXPw",
//                 "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
//                 "sec-ch-ua-mobile": "?0",
//                 "sec-ch-ua-platform": "\"Windows\"",
//                 "sec-fetch-dest": "empty",
//                 "sec-fetch-mode": "cors",
//                 "sec-fetch-site": "cross-site",
//                 "x-queryid": "qid382293257170912223720240313074739",
//                 "x-userid": "107167966",
//                 "Referer": "https://www.wildberries.ru/catalog/0/search.aspx?search=смартфон",
//                 "Referrer-Policy": "no-referrer-when-downgrade"
//             }
//         );
//     let json = await resp.json();
//     let products = JSON.stringify(json, null, 2);
//     fs.writeFileSync("./private/file.json", JSON.stringify(json, null, 2));
//     // console.log(req.query);
//     return products
// }

const download1 = (req, res) => {
    const data = req.body;
    const jsonData = JSON.stringify(data, null, 2); 
    // Generate a random file name
    let N = generateRandomFileName()
    fs.writeFile(N, jsonData, err => {
        if (err) {
            console.error('Error saving file:', err);
            res.status(500).send('Error saving file');
        return; 
        }
        // res.status(200).send('File saved successfully');
    });
    const filePath = './'; // Замените на путь к файлу на вашем сервере
    res.download(filePath, N, (err) => {
    if (err) {
        console.error('Ошибка при скачивании файла:', err);
        res.status(500).send('Произошла ошибка при скачивании файла');
    } else {
        console.log('Файл успешно скачан');
    }});
} 

function generateRandomFileName() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7); // Random string of 7 characters
    const fileName = `file_${timestamp}_${randomString}.json`; // Замените на имя файла, которое будет видно при скачивании
    return fileName;
}

const index_get = (req, res) => {
    res.render('index.hbs', {  });
}

module.exports = {
    parse_wb,
    index_get,
    download1,
}