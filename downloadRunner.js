import puppeteer from "puppeteer";
async function downloadRunner({ title, link }, quality) {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(link);

    const downloads = "#pickDownload";
    await delay(5000);
    await page.waitForSelector(downloads);

    // returns all downloadable link
    const pickAllDownload = await page.evaluate(() => {
      const episode = Array.from(document.querySelectorAll("#pickDownload>a"));
      return episode.map((ep) => {
        const episodeDownloadQuality = ep.textContent;
        const episodeDownloadLink = ep.href;
        return {
          episodeDownloadQuality: episodeDownloadQuality,
          episodeDownloadLink: episodeDownloadLink,
        };
      });
    });
    // console.log(pickAllDownload);
    const prefferedDownloadQualityLink = pickAllDownload.filter((ep) => {
      return ep.episodeDownloadQuality.includes(`${quality}`);
    });

    // console.log(prefferedDownloadQualityLink);
    await browser.close();
    return prefferedDownloadQualityLink;
  } catch (err) {
    console.log("There was an error with downloadRunner file");
  }
}
export default downloadRunner;
