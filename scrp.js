//utilisation de la librairie puppeteer (peut néecessiter une installation via 'npm install puppeteer')

const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');

const app = express();
const data_refresh_interval = 60;

//fonction sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var data = {
    altidude: "",
    speed: "",
    coordinates: ""

}

//on va enregistrer nos donnees dans un json pour pouvoir y avoir accès depuis notre html
const SaveData = (data) => {
    //on gère les erreurs pour éviter d'enregistrer les donnees sous un mauvais format dans le json
    const finished = (error) => {
        if(error) {
            console.error(error);
            return;
        }
    }
    const jsonData = JSON.stringify(data, null, 2);
    console.log("data => ",data);
    fs.writeFile('data.json', jsonData, finished);

}

function get_data()
{
    (async () => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto('https://www.astroviewer.net/iss/en/');

    
        //on laisse le temps à la page de se charger correctement
        await sleep(5000);
    
        var alt = await page.evaluate(()=> {
    
            let altitude = document.querySelector("#cockpit > div:nth-child(3) > p ").textContent; 
            return altitude;       
        });
    
        var speed = await page.evaluate(()=> {
            let sp = document.querySelector("#speed").textContent;
            return sp;
        });
    
        var coordinates = await page.evaluate(()=> {
            let coo = document.querySelector("#gpt").textContent;
            return coo;
        });
        data = {
            dateSource:
            [{
              altidude: alt,
              speed: speed,
              coordinates: coordinates
            }]
        }
        
        /*
        console.log(alt);
        console.log(speed);
        console.log(coordinates);*/
        await browser.close(); 

       
        SaveData(data);
    
    })();
}

get_data();
setInterval(get_data, data_refresh_interval*1000);


app.use(express.static('public'));

app.get('/data', async function(req, res) {
    res.send(data);
});

app.get("/", function(req, res){
	fs.readFile("index.html", "utf8", function (err, data) {res.send(data);});
});

app.disable('x-powered-by');
app.listen(8081, () => {
    console.log('Bonjour sur ton nouveaux cite web')
});








