import puppeteer from "puppeteer";
import * as fs from "fs";
async function runPuppeteer(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  try {
    //  creates function to introduce delay till the page completely loads
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    // grabs episode selection dropdown class
    const episodeGridPage = ".play:first-of-type";
    await page.waitForSelector(episodeGridPage);
    await page.click(episodeGridPage);
    await delay(5000);

    //  returns array of object
    // contains episode number as title and episode link as link
    const episodes = await page.evaluate(() => {
      const episodeArray = Array.from(
        document.querySelectorAll(`#scrollArea>a.dropdown-item`)
      );
      return episodeArray.map((ep) => {
        const epLink = ep.href;
        const epNumber = ep.textContent.trim();
        return {
          title: epNumber ? epNumber.trim() : null,
          link: epLink ? epLink : null,
        };
      });
    });
    //  creates episodeDetails.json file
    //  stores all the episode number and link as an array of objects
    fs.writeFile(
      "episodeDetails.json",
      JSON.stringify(episodes),
      function (err) {
        if (err) throw err;
        console.log("complete");
      }
    );
  } catch (err) {
    console.log("There was an error with runPuppeteer file.");
  }
  await browser.close();
}
export default runPuppeteer;
