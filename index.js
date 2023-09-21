//OnePieceUrl: https://animepahe.ru/anime/6add5285-53f8-660a-033e-8602c734f42a
import { createInterface } from "readline";
import runPuppeteer from "./runPuppeteer.js";
import downloadRunner from "./downloadRunner.js";
import * as fs from "fs";
import { exit } from "process";

let allEpisodes = [];
let episodesToDownload = [];
let downloadQuality;
let downloadQualityOption;
let downlinks = [];

// creates function to accept incomming user input
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const readLineAsync = (msg) => {
  return new Promise((resolve) => {
    readline.question(msg, (userRes) => {
      resolve(userRes);
    });
  });
};

// checks the validity of the url being passed
const validateURL = (url) => {
  try {
    const newURL = new URL(url);
    return newURL.protocol === "https:" || newURL.protocol === "http:";
  } catch (err) {
    return false;
  }
};

// fetches all the episode links and stores in allEpisodes varible
// pushes required number of episode to be downloaded to episodesToDownload variable
const returnEpisodeRequired = (start, epCount) => {
  allEpisodes = JSON.parse(fs.readFileSync("episodeDetails.json"));
  episodesToDownload = allEpisodes.splice(start - 1, epCount);
};
const startApp = async () => {
  const userRes = await readLineAsync("Enter the Url: \n");
  console.log("Fetching Results...");
  try {
    if (validateURL(userRes)) await runPuppeteer(userRes);
    // runPuppeteer(
    //   "https://animepahe.ru/anime/6add5285-53f8-660a-033e-8602c734f42a"
    // );
    const start = await readLineAsync("Enter the starting episode: \n");
    const epCount = await readLineAsync(
      "Enter the number of episodes to download: \n"
    );
    returnEpisodeRequired(start, epCount);
    // returnEpisodeRequired(20, 5);
    do {
      console.log(
        "Choose the Quality of download: \n1. 720p\n2. 1080p\n3. exit"
      );
      downloadQualityOption = await readLineAsync("Enter:  \n");
      if (downloadQualityOption == "1" || downloadQualityOption == "2") {
        downloadQuality = downloadQualityOption == "1" ? "720p" : "1080p";
        break;
      } else console.log("Not a Valid Option");
    } while (downloadQualityOption != "3");

    for (let i = 0; i < episodesToDownload.length; i++) {
      downlinks.push(
        await downloadRunner(episodesToDownload[i], downloadQuality)
      );
    }
    console.log(downlinks);
  } catch (err) {
    console.log("Failed to crawl Episodes");
    exit;
  }
  readline.close();
};
startApp();
