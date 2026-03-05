import Parser from "rss-parser";
import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { eq,and } from "drizzle-orm";
export async function createFeedFollow(user_id:string,feed_id:string) {
    if(!user_id||!feed_id){
        throw new Error("User ID and Feed ID are required");
    }
    const[result]=await db.insert(feed_follows).values({user_id:user_id,
        feed_id:feed_id
    }).returning();
    const[re]= await db.select({
      id: feed_follows.id,
            created_at: feed_follows.created_at,
            updated_at: feed_follows.updated_at,
            user_name: users.name,    
            feed_name: feeds.name,    
    }).from(feed_follows).innerJoin(users,eq(feed_follows.user_id,users.id)).innerJoin(feeds,eq(feed_follows.feed_id,feeds.id))
    .where(eq(feed_follows.id,result.id));
    return re;
    
    
   
}
 const parser= new Parser();
   
export async function getFeedbyurl(url:string) {
    try{
        const feed= parser.parseURL(url);
        return feed;
    }catch (error) {
    console.error("Error fetching feed:", error);
    return null;
  }
  

    
}
export async function getFeedsbyuserid(user_id:string){
const result= await db.select({
    feed_name:feeds.name,
    user_name: users.name,
    
}).from(feed_follows)
.innerJoin(feeds, eq(feed_follows.feed_id,feeds.id))
.innerJoin(users, eq(feed_follows.user_id,users.id))
.where(eq(feed_follows.user_id,user_id));
return result;
}
export async function Deletfeedfollow(user_id:string,feed_id:string) {
  
       const[result]=  await db.delete(feed_follows).where(
        and (
            eq(feed_follows.user_id,user_id),
            eq(feed_follows.feed_id,feed_id)
    
    
    
    )
    
    );

    return result;}
