import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import Twitter from 'twitter';

dotenv.config();

const baseUrlV1 = 'https://api.twitter.com/1.1/';
// const baseUrlV2 = 'https://api.twitter.com/2/';
const username = 'naval';
const count = 100;
const requestUrl = `statuses/user_timeline.json?screen_name=${username}&count=${count}`;

const config: AxiosRequestConfig = {
  method: 'GET',
  url: baseUrlV1 + requestUrl,
  headers: {
    Authorization: 'Bearer ' + process.env.TWITTER_BEARER_TOKEN,
    Cookie:
      'personalization_id="v1_TSJfzR2GfyxXgMuHoBV+Qw=="; guest_id=v1%3A160002132457731207'
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

  console.log(filteredData);
};
