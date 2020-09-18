import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { data } from 'pdfkit/js/reference';
import Twitter from 'twitter';
import * as format from '../tools/format';

dotenv.config();

const baseUrlV1 = 'https://api.twitter.com/1.1/';
// const baseUrlV2 = 'https://api.twitter.com/2/';
const username = 'naval';

const count = 200;
const lastMax = 1283507218294292500;
// const lastMax = 1262252319594344400;
const requestUrl = `statuses/user_timeline.json?screen_name=${username}&max_id=${lastMax}&count=${count}`;

const config: AxiosRequestConfig = {
  method: 'GET',
  url: baseUrlV1 + requestUrl,
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

// TODO:
/**
 *  Write general algorithm to iterate through twitter's api constraints
 */

const getTweets = (config: AxiosRequestConfig) => {
  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      // const data = response.data;
      // filterTwitterResponse(data);
      // const lastId = getLastId(data);
      // console.log(lastId);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
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

const configUpdate = (config: AxiosRequestConfig, lastId: number) => {
  const newCount = 100;
  const newBaseUrlV1 = 'https://api.twitter.com/1.1/';
  // const baseUrlV2 = 'https://api.twitter.com/2/';
  const newUsername = 'naval';
  const newRequestUrl = `statuses/user_timeline.json?screen_name=${newUsername}&max_id=${lastId}&count=${newCount}`;

  const newConfig: AxiosRequestConfig = {
    method: 'GET',
    url: newBaseUrlV1 + newRequestUrl,
    headers: {
      Authorization: 'Bearer ' + process.env.TWITTER_BEARER_TOKEN
    }
  };

  return newConfig;
};

const runRequests = async (
  config: AxiosRequestConfig,
  numberOfRequests: number
) => {
  const loopLength = new Array(numberOfRequests).fill(0);

  loopLength.forEach(async (loop) => {
    const data = await getTweets(config);
    const lastId = getLastId(data);
    const newConfig = configUpdate(config, lastId);
    console.log(newConfig);
    await getTweets(newConfig);
  });
};

// getTweets(config);

runRequests(config, 4);

/**
 *    --> initial config, number of requests
 *    --> get last id
 *    --> update config
 *    --> run request again
 */
