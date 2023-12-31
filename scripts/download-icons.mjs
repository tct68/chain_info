import got from "got";
import fs from "fs";
import { cc_coins } from "./COINS.mjs";
const rootUrl = "https://cryptologos.cc/";

(async () => {
  //ensure /svg folder exists
  if (!fs.existsSync("svg")) {
    fs.mkdirSync("svg");
  }

  cc_coins;

  const svgObjects = Object.keys(cc_coins).map((coinId) => {
    const path = `logos/${coinId}-${cc_coins[coinId].symbol.toLowerCase()}-logo.svg`
    return {
      name: coinId + ".svg",
      url: rootUrl + path,
      coinId
    };
  });

  //download each svg and save it in the /svg folder
  Promise.all(
    svgObjects.map((svg) => {
      return new Promise((resolve, reject) => {
        const readStream = got.stream(svg.url);
        const writeStream = fs.createWriteStream(`svg/${svg.name}`);

        readStream.on("error", (err) => {
          reject(err.message);
        });

        writeStream.on("error", (err) => {
          reject(err.message);
        });

        writeStream.on("finish", () => {
          resolve();
        });

        readStream.pipe(writeStream);
      }).catch((err) => {
        //log out the error for the given file
        console.log(`Error downloading ${svg.name}: ${err}`);
      });
    })
  )
    .then(() => {
      console.log("done");
      process.exit(0);
    })
    .catch((err) => {
      console.error("failed", err);
      process.exit(1);
    });
})();
