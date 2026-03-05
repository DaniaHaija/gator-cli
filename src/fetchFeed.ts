import{XMLParser } from "fast-xml-parser";
import { getFeedbyurl,createFeedFollow, getFeedsbyuserid, Deletfeedfollow } from "./lib/db/queries/feedfollows";
import { readConfig } from "./config";
import {GetUser} from "./lib/db/queries/users";
import { feeds, posts, users } from "./lib/db/schema";
import { UserCommandHandler } from "./middlewareLoggedIn ";
import { db, } from "./lib/db";
import { eq,and,sql,asc } from "drizzle-orm";
import { markFeedFetched } from "./lib/db/queries/feedcommands";
import { createPost } from "./lib/db/queries/posts";



export async function fetchFeed(feedURL: string){
  const result=  await fetch(feedURL, {
  headers: {
    "User-Agent": "gator"
  }
});
if(!result.ok){
   throw new Error(`Failed to fetch feed: ${result.status}`);
}
  const data = await result.text();
  const parser=new XMLParser(({
    ignoreAttributes: false,
  }));
  const parsed =  parser.parse(data);
 const channel = parsed?.rss?.channel;
 if(!channel)  {
    throw new Error("Invalid RSS feed: missing channel");
 }
  const { title, link, description } = channel;
  if (!title || !link || !description) {
    throw new Error("Invalid RSS feed metadata");
  }
let items:any[]=[];
if(channel.item){
    items= Array.isArray(channel.item) ?
    channel.item
  :  [channel.item];
}
const feeditems= items.map((item)=>{
    const{title, link, description, pubDate } = item;
     if (!title || !link || !description || !pubDate) {
        return null;
      }
      return {
        title,
        link,
        description,
        pubDate,
      };
    })
    .filter(Boolean);
    return{
         title,
        link,
        description,
        item:feeditems

    };
}
export const  follow:UserCommandHandler=async(cmdName:string,user, ...args:string[]) =>{
  const url=args[0];
  const feed= await getFeedbyurl(url);
  if (!feed) {
    throw new Error(`Feed with URL '${url}' not found.`);
  }
  
   const result=await createFeedFollow(user.id,feed.id);

  console.log(`Feed: ${result.feed_name} followed by User: ${result.user_name}`);
}
export const  following: UserCommandHandler=async(cmdName:string,user,...args:string[]) =>{
  
  const follows= await getFeedsbyuserid(user.id);
  if (follows.length === 0) {
    console.log("You are not following any feeds yet.");
    return;
  }

  console.log(`User ${user.name} is following:`);
  follows.forEach((follow) => {
    console.log(`* ${follow.feed_name}`);
  });
  
}
export const  unfollow:UserCommandHandler=async(cmdName:string,user, ...args:string[]) =>{
  
  const url=args[0];
  const feed = await db.query.feeds.findFirst({
    where: eq(feeds.url, url),
  });

  if (!feed) {
    console.log("Feed not found");
    return;
  }
  await Deletfeedfollow(user.id,feed.id);

  
}
export async function getNextFeedToFetch() {
  const nextFeed= await db.query.feeds.findFirst({
    orderBy :[sql`${feeds.last_fetched_at}ASC NULLS FIRST`],
  });
  return nextFeed;
  
}

export async function scrapeFeeds() {
  const nextFeed= await getNextFeedToFetch();
  if(!nextFeed){
    console.log("No feeds found to scrape.");
    return;
  }
  else{
    await markFeedFetched(nextFeed.id);
  const rssData= await getFeedbyurl(nextFeed.url);
 
 if (rssData && rssData.items) {
 for (const item of rssData.items ) {
await db.insert(posts).values({
  title:item.title ?? "No Title",
  url:item.link!,
  description:item.contentSnippet??item.content??"",
  published_at:item.pubDate? new Date(item.pubDate) : new Date(),
  feed_id:nextFeed.id

}).onConflictDoNothing({ target: posts.url });
 
  }}
}}
  

