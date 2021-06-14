//utilisation de la librairie puppeteer (peut néecessiter une installation via 'npm install puppeteer')

//const puppeteer = require('puppeteer');

import puppeteer from 'puppeteer';
import fs from 'fs';
import { finished } from 'stream';
import { strict } from 'assert';

//fonction sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var data = {
    altidude: 'none',
    speed: 'none',
    coordinates: 'none'
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
    fs.writeFile('data.json', jsonData, finished);
}

SaveData(data);

for (let i=0;i<10;i++) {
    
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

        console.log(alt);
        console.log(speed);
        console.log(coordinates);
        await browser.close(); 
        data = {
            altidude: alt,
            speed: speed,
            coordinates: coordinates
        }
        SaveData(data);
    
    })();



}


