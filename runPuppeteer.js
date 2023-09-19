import puppeteer from "puppeteer"
import downloadRunner from "./downloadRunner.js"
async function runPuppeteer(url,start,end){
    const browser = await puppeteer.launch({ headless: "new" })
    const page = await browser.newPage()
    const delay = ms => new Promise(res => setTimeout(res, ms))
    // page.setDefaultNavigationTimeout(2 * 60 * 1000)
    try {
        await page.goto(url)
        await page.setViewport({ width: 1080, height: 1024 })
        const episodeGridPage = ".play:first-of-type"
        await page.waitForSelector(episodeGridPage)
        await page.click(episodeGridPage)
        await delay(5000)
        const episodeDropDown = "#scrollArea"
        await page.waitForSelector(episodeDropDown)

        const ep = await page.$(episodeDropDown)
        const episodes = await ep.evaluate(() => {
            const episodeArray = Array.from(document.querySelectorAll("a.dropdown-item"))
            return episodeArray.map(ep => {
                const epLink = ep.href;
                const epNumber = ep.textContent.trim();
                return {
                    title: epNumber ? epNumber.trim() : null,
                    link: epLink ? epLink : null
                }
            })
        })
        const filterWantedEpisodes = episodes.slice(start-1,end)
        // console.log(filterWantedEpisodes);
        // filterWantedEpisodes.map(async(ep)=>downloadRunner(ep))
        downloadRunner(filterWantedEpisodes[0])
        
    } catch (err) {
        console.log("There was an error.");
    }
    await browser.close()
}
export default runPuppeteer
