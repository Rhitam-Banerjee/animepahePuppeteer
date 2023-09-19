import puppeteer from "puppeteer";
async function downloadRunner({title,link}){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(link)
    const content = await page.evaluate(()=>document.documentElement.outerHTML)
    console.log(content);
}
export default downloadRunner;