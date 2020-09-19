import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { parse } from 'path';
import Twitter from 'twitter';

dotenv.config();

/**
 * New strategy based on this code:
 * https://gist.github.com/yanofsky/5436496
 */

const getTweets = async (username: string) => {
  const allTweets = [];

  var newTweets = await getNewTweets(username);

  allTweets.push(newTweets);
  console.log(allTweets);

  var oldestTweet = allTweets[-1].id - 1;

  while (newTweets.length > 0) {
    console.log(`getting tweets before ${oldestTweet}...`);

    newTweets = await getNewTweetsWithMax(username, oldestTweet);

    allTweets.push(newTweets);

    oldestTweet = allTweets[-1].id - 1;

    console.log(`${allTweets.length} tweets downloaded so far..`);
  }

  return allTweets;
};

const getNewTweets = async (username: string) => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=100`,
    // url: `https://api.twitter.com/2/tweets/search/recent`,
    headers: {
      Authorization: 'Bearer ' + process.env.TWITTER_BEARER_TOKEN
    }
  };
  const data = await axios(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  //   const filteredData = data.map((tweet: any) => {
  //     return {
  //       tweet: tweet.text,
  //       id: tweet.id_str,
  //       date: Date.parse(tweet.created_at),
  //       favorites: tweet.favorite_count
  //     };
  //   });

  //   writeTweetToJSON(data, username);

  return data;
};

const getNewTweetsWithMax = async (username: string, oldestId: number) => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=100&max_id=${oldestId}`,
    // url: `https://api.twitter.com/2/tweets/search/recent`,
    headers: {
      Authorization: 'Bearer ' + process.env.TWITTER_BEARER_TOKEN
    }
  };
  const data = await axios(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  const filteredData = data.map((tweet: any) => {
    return {
      tweet: tweet.text,
      id: tweet.id,
      date: Date.parse(tweet.created_at),
      favorites: tweet.favorite_count
    };
  });

  //   writeTweetToJSON(data, username);

  return filteredData;
};

getTweets('naval');
