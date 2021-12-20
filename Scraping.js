let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
const puppeteer = require("puppeteer");


let page, browser;


(async function fn() {
    let browserStartPromise = await puppeteer.launch({
        headless: false, defaultViewport: null,
        args: ["--start-maximized","--disable-notifications"],
    })

    let browserObj = await browserStartPromise;

    browser = browserObj;
    let  pages = await browser.pages();
    page = pages[0];
    

    await page.goto("https://www.google.com");
    await page.type("input[title='Search']","wikipedia",{delay : 200});
    await page.keyboard.press("Enter",{delay : 100});
    await page.waitForSelector(".LC20lb.DKV0Md",{visible : true});
    await page.click(".LC20lb.DKV0Md"); 

    await page.waitForSelector("a[href='//en.wikipedia.org/']",{visible : true});
    await page.click("a[href='//en.wikipedia.org/']");
   
    await page.waitForSelector(".portal-hright.portal-vbot",{visible : true});
    await page.click(".portal-hright.portal-vbot"); 

    await page.waitForSelector("a[href='/wiki/Wikipedia:Contents/A%E2%80%93Z_index']",{visible : true});
    await page.click("a[href='/wiki/Wikipedia:Contents/A%E2%80%93Z_index']");

    await page.waitForSelector("a[href='/wiki/Special:AllPages/P']",{visible : true});
    await page.click("a[href='/wiki/Special:AllPages/P']");

    await page.waitForSelector("a[href='/wiki/P']",{visible : true});
    await page.click("a[href='/wiki/P']");

    let url = await page.url(); 
    
    

    await page.waitForSelector("a[href='#History']",{visible : true});
    await page.click("a[href='#History']");
    console.log("History clicked");

    await page.waitForSelector("a[href='#Use_in_writing_systems']",{visible : true});
    await page.click("a[href='#Use_in_writing_systems']");
    console.log("Use in writing clicked");

    await page.waitForSelector("a[href='#Related_characters']",{visible : true});
    await page.click("a[href='#Related_characters']");
    console.log("Related clicked");

    // let url = "https://en.wikipedia.org/wiki/P";


    request(url, cb);

    function cb(err,response,html){
        if(err){
            console.log(err);
        }else if(response.statusCode == 404){
            console.log("page not found");
        }else{
            // console.log(html);
           dataExtractor1(html);
        }
    }
    
    function dataExtractor1(html){
        let $ = cheerio.load(html);
        let data = "";
    
        //History
        data += "History \n";
        let history = $('h2 + p');
        let historytData = history.text();
        data += historytData + "\n";
        
        //Uses 
        data += "Uses in writing systems \n";
        let use_1 = $('h2 + div + p');
        let attrs1 = use_1.text();
        data += attrs1;

        let use_2 = $('h2 + div + p + p');
        let attrs2 = use_2.text();
        data += attrs2 ;

        let use_3 = $('h2 + div + p+ p+ p');
        let attrs3 = use_3.text();
        data += attrs3;

        let use_4 = $('h2 + div + p+ p+ p+ p');
        let attrs4 = use_4.text();
        data += attrs4;

        let use_5 = $('h2 + div + p+ p+ p+ p+ p');
        let attrs5 = use_5.text();
        data += attrs5 ;

        let use_6 = $('h2 + div + p+ p+ p+ p+ p +h3');
        let attrs6 = use_6.text();
        data += attrs6 + "\n";
        
        let use_7 = $('h2 + div + p+ p+ p+ p+ p +h3 +p');
        let attrs7 = use_7.text();
        data += attrs7 +"\n";

        //Related Characters
        data += "Related Character \n";

        let rel_1 = $('h2 + h3');
        let rel_attrs1 = rel_1.text();
        data += rel_attrs1 + "\n";

        let rel_2 = $('h2 + h3 +p');
        let rel_attrs2 = rel_2.text();
        data += rel_attrs2;

        let rel_3 = $('h2 + h3 +p +ul');
        let rel_attrs3 = rel_3.text();
        data += rel_attrs3 + "\n";

        let rel_4 = $('h2 + h3 +p +ul +h3');
        let rel_attrs4 = rel_4.text();
        data += rel_attrs4 + "\n";
        
        let rel_5 = $('h2 + h3 +p +ul +h3 +ul');
        let rel_attrs5 = rel_5.text();
        data += rel_attrs5 + "\n";
        
        let name = "HiringData";
        let filePath = path.join(__dirname,name + ".txt");
        fs.writeFileSync(filePath, data,'utf-8');
    }   

})();