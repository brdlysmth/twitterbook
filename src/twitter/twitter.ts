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
      console.log(error);
    }
  );
};

// requestTweets(config);

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
    url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&max_id=${startId}&count=${count}`,
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

  const lastId = await getLastTweet(data);

  console.log(lastId);

  writeTweetToJSON(data, username);
};

const getLastTweet = async (data: Twitter.ResponseData) => {
  // filter by created_at which is UTC string
  const orderedTweets = data.reduce((a: any, b: any) => {
    return Date.parse(a.created_at) > Date.parse(b.created_at);
  });

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

  console.log(result);

  return orderedTweets;
};

const username = 'naval';
const count = 100;
const startId = 1283507218294292500;

getHundredTweets(username, startId, count);
