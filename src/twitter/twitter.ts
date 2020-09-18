import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import Twitter from 'twitter';
import * as format from '../tools/format';

dotenv.config();

const baseUrlV1 = 'https://api.twitter.com/1.1/';
// const baseUrlV2 = 'https://api.twitter.com/2/';
const username = 'naval';

const count = 200;
const lastMax = 1283507218294292500;
// const lastMax = 1262252319594344400;
const firstRequestUrl = `statuses/user_timeline.json?screen_name=${username}&count=${count}`;
const secondRequestUrl = `statuses/user_timeline.json?screen_name=${username}&max_id=${lastMax}&count=${count}`;

const config: AxiosRequestConfig = {
  method: 'GET',
  url: baseUrlV1 + firstRequestUrl,
  headers: {
    Authorization: 'Bearer ' + process.env.TWITTER_BEARER_TOKEN
  }
};

// axios(config)
//   .then(function (response) {
//     // console.log(JSON.stringify(response.data));
//     const data = response.data;
//     filterTwitterResponse(data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

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
    format.writeToPDF(e.tweet, username, index);
  });
  // writeToPDF(newFilteredData, newFilteredData.length);
  console.log(newFilteredData.length);
};

/**
 * Grab the earliest tweet id from the last twitter response
 * @param data
 */
const getLastId = (data: Twitter.ResponseData) => {
  const lastMax = Object.values(data)[Object.values(data).length - 1].id;
  console.log(lastMax);
  return lastMax;
};

/**
 *    --> initial config, number of requests
 *    --> get last id
 *    --> update config
 *    --> run request again
 */

const requestTweets = async (config: AxiosRequestConfig, lastId?: number) => {
  const baseUrlV1 = 'https://api.twitter.com/1.1/';
  // const baseUrlV2 = 'https://api.twitter.com/2/';
  const username = 'naval';

  if (lastId) {
    config.url =
      baseUrlV1 +
      `statuses/user_timeline.json?screen_name=${username}&max_id=${lastId}&count=200`;

    const data = await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    processTweets(data);
  } else {
    const data = await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    processTweets(data);
  }
};

const processTweets = async (data: Twitter.ResponseData) => {
  const lastId = getLastId(data);
  console.log(lastId);

  if (lastId > 1200000000000000000) {
    await requestTweets(config, lastId);
  }
  return;
};

requestTweets(config);
