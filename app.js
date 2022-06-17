const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    try {
        const baseUrl = 'https://fantasy.espn.com'
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(baseUrl + '/football/mockdraftlobby');
        await page.setViewport({width: 1440, height: 744});
        
        //get page content as html
        const content = await page.content();
        
        //load cherrio
        const $ = cheerio.load(content);
        
        //create array to push link
        const links = [];
        
        //set links
        $('.Table__TBODY tr td a:contains("10-Team H2H Points")').each((idx, elem) => {
            const $element = $(elem);
            const $text = $element.text();
            const $link = $element.attr('href');
            const $time = $element.closest('tr').find('td:nth-child(4)').text();
            const $members = $element.closest('tr').find('td:nth-child(5)').text();
            const totalMembers = ['2/10', '3/10', '4/10', '5/10', '6/10', '7/10', '8/10'];
            
            //ignore ppr and salary cap
            if (!$text.includes('PPR') && !$text.includes('Salary Cap') && totalMembers.includes($members)) {
                links.push($text + ' - ' + $time + ' - ' + $members);
                links.push(baseUrl + $link);
                links.push('------');
            }
        });
        
        console.log(links);
        
        await browser.close();
        
    } catch (e) {
        
        console.log(`Error while fetching links ${e.message}`);
        
    }
})();