import Twitter from "twitter";
import { TwitterApi } from "twitter-api-v2";
import {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
} from "../../env";

const twitters = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
});

const twitterClient2 = new TwitterApi({
  appKey: consumer_key,
  appSecret: consumer_secret,
  accessToken: access_token_key,
  accessSecret: access_token_secret,
});
const getDataByUsername = async ({ username, count = 1000 }) => {
  let userTimeline = await (
    await twitterClient2.v1.userTimelineByUsername(username)
  ).fetchLast(count);
  const fetchedTweets = userTimeline.tweets;
  let mediaGroups = [];
  fetchedTweets.map((tweet) => {
    if (tweet.extended_entities) {
      tweet.extended_entities.media.map((media) => {
        if (media.type == "video") {
          const mediaUrl = media.video_info.variants
            .filter((file) => file.content_type == "video/mp4")
            .sort((a, b) => b.bitrate - a.bitrate);
          mediaGroups.push({
            type: "video",
            media: mediaUrl[0].url,
          });
        } else if (media.type == "photo") {
          mediaGroups.push({
            type: "photo",
            media: media.media_url_https,
          });
        }
      });
    }
  });
  return mediaGroups;
};

const media = (tweetId) =>
  new Promise(async (resolve) => {
    try {
      twitters.get(
        `statuses/show/${tweetId}`,
        {
          tweet_mode: "extended",
        },
        (_, tweetData) => {
          if (tweetData.extended_entities) {
            const mediaGroup = tweetData.extended_entities.media.map(
              (media) => {
                if (media.type == "video") {
                  const mediaUrl = media.video_info.variants
                    .filter((file) => file.content_type == "video/mp4")
                    .sort((a, b) => b.bitrate - a.bitrate);
                  return {
                    type: "video",
                    media: mediaUrl[0].url,
                  };
                } else if (media.type == "photo") {
                  return {
                    type: "photo",
                    media: media.media_url_https,
                  };
                }
              }
            );
            resolve(mediaGroup);
          }
        }
      );
    } catch (error) {
      console.log(error);
      console.log(JSON.stringify(error));
    }
  });

export const twitter = {
  media,
  getDataByUsername,
};
