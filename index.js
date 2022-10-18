const req = require('request');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { exit } = require('process');

const API_KEY = 'ENTER YOUR API'
const loginMail = 'ENTER YOUR USER NAME'
const loginPassword = 'ENTER YOUR PASSWORD'

let url = "https://b2b.swarovskioptik.com/s/";
const batchNumber = process.argv.slice(2)[0];

if(batchNumber === undefined){
    console.log('Please specify the batch number');
    exit()
}

var categories = fs.readFileSync(`conf/batch_${batchNumber}.conf`).toString().split("\n");

let allProducts = [];
let metadata = [];

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250, // slow down by 250ms
        //defaultViewport: {width: 1920, height: 4000}
    });
    const page = await browser.newPage();
    let gotoProperties = {
        timeout: 0,
        waitUntil: ['domcontentloaded', 'networkidle0']
    }
    await page.goto(url, gotoProperties);
    await page.waitForSelector('.input', { visible: true, timeout: 0 });

    await page.evaluate(_ => {
        data.loginMail = loginMail;
        data.loginPW = loginPassword;
        login();
    });

    await page.waitForSelector('button > lightning-icon > lightning-primitive-icon > svg', { visible: true, timeout: 0 });

    let i;
    // Gather all products
    for (i = 0; i<categories.length; i++) {

        await page.goto(categories[i], gotoProperties)
        console.log("Visiting ", categories[i]);

        await paginate(page, gotoProperties);

    }

    for(i = 0; i<allProducts.length; i++) {
        
        await page.goto("https://b2b.swarovskioptik.com/s/product/" + allProducts[i], gotoProperties)
        await page.waitForSelector('.price');

        console.log("Visiting Product", "https://b2b.swarovskioptik.com/s/product/"+allProducts[i]);

        let itemData = await page.evaluateHandle(() => {
            
            let currentHTML = document.createElement('html');
            currentHTML.innerHTML = document.body.innerHTML;
            let pricesItemsArr = Array.prototype.slice.call(currentHTML.getElementsByClassName('price'));
            let priceArr = Array.prototype.slice.call(pricesItemsArr[0].getElementsByTagName('lightning-formatted-number'));
            let price = priceArr[0].textContent;

            let headerInfo = currentHTML.getElementsByTagName('b2b_buyer_product_details-heading')[0];
            let data = Array.prototype.slice.call(headerInfo.getElementsByTagName('lightning-formatted-rich-text'));

            let sku = Array.prototype.slice.call(data[0].getElementsByTagName('span'))[0].textContent
            let availabilityHTML = Array.prototype.slice.call(data[1].getElementsByTagName('span'))[0]
            
            let imgHTML = Array.prototype.slice.call(availabilityHTML.getElementsByTagName('img'))[0];
            let availabilityColor = imgHTML.getAttribute('alt');

            let colorMap = new Map();
            colorMap.set('green', 10)
            colorMap.set('yellow', 1)
            colorMap.set('red', 0)
            colorMap.set('blue', 0)

            return {
                "active": 1,
                "vendor_name" : 'Swarovski',
                "vpc": sku,
                "unit_cost": Number(price.replace(/[^0-9.-]+/g,"")),
                "quantity": colorMap.get(availabilityColor) || 0
            };

        })

        metadata.push(await itemData.jsonValue());

    }
    
    browser.close();

    fs.writeFile(`tmp/data-batch-${batchNumber}.csv`, convertToCSV(metadata), (err) => { if(err) throw err; console.log('File created') } );
    fs.writeFile(`tmp/data-batch-${batchNumber}.json`, JSON.stringify(metadata, null, "\t"), (err) => { if(err) throw err; console.log('File created') } );


    let bodyRequest = {records : metadata, with_detailed_response: 0}

    let options = {
        url: 'https://api.retailops.com/product/externalsku/update~2.json',
        headers: {
            'Content-Type' : 'application/json',
            'apikey' : API_KEY,
            'User-Agent' : 'scraper/1.0'
        },
        body: JSON.stringify(bodyRequest)
    }

    req.post(options, (res, err, body) => {

        if (!err && res.statusCode == 200) {
            const info = JSON.parse(body);
            console.log(JSON.stringify(info));
          }else{
              console.log(err.body)
          } 

    })

}

async function paginate(page, gotoProperties) {
    const aHandle = await page.evaluateHandle(() => document.body);

    var stopPaginationIteration = "false";

    do {

        await page.waitForSelector('.nav-direction:nth-last-child(1)')

        const resultHandleIds = await page.evaluateHandle(
            body => {
                var currentHTML = document.createElement('html');
                currentHTML.innerHTML = body.innerHTML;
                var items = currentHTML.getElementsByTagName('b2b_search_product_card-product-card');
                var itemsArray = Array.prototype.slice.call(items);
                var arr = [];
                itemsArray.forEach(_ => {
                    arr.push(_.getAttribute("data-id"));
                });
                return arr;
            }, aHandle);

        allProducts = allProducts.concat(await resultHandleIds.jsonValue());

        const isNextDisabled = await page.evaluate(
            body => {
                var currentHTML = document.createElement('html');
                currentHTML.innerHTML = body.innerHTML;
                var items = currentHTML.getElementsByClassName('nav-direction');
                var array = Array.prototype.slice.call(items);
                return array[1].getAttribute("aria-disabled");
            }, aHandle);

        stopPaginationIteration = await isNextDisabled;

        if(stopPaginationIteration !== "true"){

            await Promise.all([
                page.click('.nav-direction:nth-last-child(1)'),
                page.waitForNavigation(gotoProperties),
            ]);
        }

    } while (stopPaginationIteration !== "true");
}

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }


run();