//OnePieceUrl: https://animepahe.ru/anime/6add5285-53f8-660a-033e-8602c734f42a
import runPuppeteer from "./runPuppeteer.js"
import {createInterface} from "readline"


const readline = createInterface({
    input:process.stdin,
    output:process.stdout
})
const readLineAsync = msg => {
    return new Promise(resolve => {
        readline.question(msg, userRes => {
            resolve(userRes);
        });
    });
}
const validateURL=(url)=>{
    try{
        const newURL = new URL(url)
        return newURL.protocol==="https:"||newURL.protocol==="http:";
    }catch(err){
        return false;
    }
}
const startApp = async() => {
    // const userRes = await readLineAsync("Enter the Url: \n");
    // const startEp = parseInt(await readLineAsync("Enter the Start Episode: \n"));
    // const endEp = parseInt(await readLineAsync("Enter the End Episode: \n"));
    // console.log("Fetching Results...");
    // if(validateURL(userRes))runPuppeteer(userRes,startEp,endEp);
    readline.close();   
    runPuppeteer("https://animepahe.ru/anime/6add5285-53f8-660a-033e-8602c734f42a",20,30)
}
startApp()