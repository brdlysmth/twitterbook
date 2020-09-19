import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import Twitter from 'twitter';

dotenv.config();

const writeTweetToJSON = (data: Twitter.ResponseData, author: string) => {
  const filteredData = data.map((tweet: any) => {
    return {
      tweet: tweet.text,
      tweetId: tweet.id_str,
      date: Date.parse(tweet.created_at),
      favorites: tweet.favorite_count
    };
  });

  // write all tweets to same json file
  fs.writeFile(
    `${author}-master.json`,
    JSON.stringify(filteredData),
    { flag: 'a+' },
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('json export complete...');
      }
    }
  );
};

// NOTES:
/**
 * current scheme only works if every response has tweets in it
 * need to get the first id from the previous set to do again
 * or skip the processing and skip over the next few id's until
 * some data meets our criteria
 *
 * Or, we could wait and process things until after we know there's a
 * repsonse
 *
 * If data is zero we return lastMaxId plus one and keep iterating until
 * data is returned that meets our criteria
 *
 * We get all the data regardless, maybe we don't do anything filtering at all
 * until we have json files of all tweets
 *
 * The prospect of returning json files that are empty really messes up the program
 */

// I would rather get 100 at a time

const getHundredTweets = async (
  username: string,
  startId: number,
  count: number
) => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&max_id=${startId}&count=${count}?include_rts=1?`,
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

  writeTweetToJSON(data, username);

  return data;
};

const getLastTweet = async (data: Twitter.ResponseData) => {
  // filter by created_at which is UTC string

  console.log(data.length);

  if (!data) {
    return;
  }

  if (data.length < 2) {
    const newId = parseInt(data[0].id_str) - 10;
    return newId.toString();
  }
  // if (filteredData.length < 2) {
  //   return filteredData[0].tweetId + 1;
  // }
  const filteredData = data.map((tweet: any) => {
    return {
      tweet: tweet.text,
      tweetId: tweet.id_str,
      date: Date.parse(tweet.created_at),
      favorites: tweet.favorite_count
    };
  });

  const result = filteredData.reduce((r: any, o: any) =>
    o.date < r.date ? o : r
  );

  // if (result.tweetId == 1170567931790364673) {
  //   console.log(filteredData);
  //   console.log(result);
  // }

  console.log(filteredData.length);

  return result.tweetId;
};

const checkForData = (data: Twitter.ResponseData) => {};

const startTwitterFetchLoop = async (loop: number) => {
  const username = 'naval';
  const count = 100;
  const startId = 1283507218294292500;
  // const startId = 1170567931790364700;
  const endId = 1000000000000000000;

  console.log('Starting loop... ');

  const data = await getHundredTweets(username, startId, count);
  const lastId = await getLastTweet(data);

  await runTwitterFetchLoop(username, count, lastId, loop);
};

const runTwitterFetchLoop = async (
  username: string,
  count: number,
  startId: number,
  loop: number
) => {
  console.log('Fetching data... ');
  const array = new Array(loop).fill(0);

  let data: Twitter.ResponseData;
  let lastIdArr: any = [];

  for (const index in array) {
    if (lastIdArr.length == 0) {
      data = await getHundredTweets(username, startId, count);
      const lastId = await getLastTweet(data);
      console.log(`id ${index}: `, lastId);
      lastIdArr[0] = lastId;
    }

    if (lastIdArr.length > 0) {
      data = await getHundredTweets(username, lastIdArr[0], count);

      // check if data is undefined

      const dataExists = checkForData(data);

      const lastId = await getLastTweet(data);
      console.log(`id ${index}: `, lastId);
      lastIdArr[0] = lastId;
      console.log(lastIdArr);
    }
  }

  console.log('Loop finished.');
};

startTwitterFetchLoop(25);
