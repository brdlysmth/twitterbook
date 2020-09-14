import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import Twitter from 'twitter';
import PDFDocument from 'pdfkit';
import { write } from 'pdfkit/js/data';

dotenv.config();

const baseUrlV1 = 'https://api.twitter.com/1.1/';
// const baseUrlV2 = 'https://api.twitter.com/2/';
const username = 'naval';

const count = 200;
const lastMax = 1283507218294292500;
const requestUrl = `statuses/user_timeline.json?screen_name=${username}&max_id=${lastMax}&count=${count}`;

const config: AxiosRequestConfig = {
  method: 'GET',
  url: baseUrlV1 + requestUrl,
  headers: {
    Authorization: 'Bearer ' + process.env.TWITTER_BEARER_TOKEN
  }
};

axios(config)
  .then(function (response) {
    // console.log(JSON.stringify(response.data));
    const data = response.data;
    filterTwitterResponse(data);
  })
  .catch(function (error) {
    console.log(error);
  });

const filterTwitterResponse = (data: Twitter.ResponseData) => {
  const filteredData = data.map((tweet: any) => {
    return {
      tweet: tweet.text,
      tweetId: tweet.id,
      date: tweet.created_at,
      favorites: tweet.favorite_count
    };
  });

  const newFilteredData = filteredData.filter((tweet: any) => {
    if (tweet.favorites > 10000) {
      return tweet;
    }
  });

  fs.writeFile('first.json', JSON.stringify(newFilteredData), (error) => {
    console.log(error);
  });

  newFilteredData.forEach((e: any, index: any) => {
    // console.log(e.tweet);
    writeToPDF(e.tweet, username, index);
  });
  // writeToPDF(newFilteredData, newFilteredData.length);
  console.log(newFilteredData.length);
};

// FIXME: do I pass raw text here or entire json?
// TODO: bundle them in single pdf
/**
 * https://pdfkit.org/
 */
const writeToPDF = (text: string, username: string, index: string) => {
  const doc = new PDFDocument({
    margins: {
      top: 250,
      bottom: 250,
      left: 75,
      right: 75
    }
  });

  doc.pipe(fs.createWriteStream(`${username}+${index}.pdf`)); // write to PDF
  // doc.pipe(res); // HTTP response

  const textWithAuthor = text + '\n' + `--@${username}`;
  const author = `--@${username}`;

  doc.text(text, {
    width: 200
  });

  doc.text(author, {
    width: 200,
    align: 'right'
  });

  // finalize the PDF and end the stream
  doc.end();
};

// TODO:
/**
 *  Write general algorithm to iterate through twitter's api constraints
 */
