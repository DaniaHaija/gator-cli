import { UUID } from "node:crypto";
import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import Parser from "rss-parser";

export async function createFeed(name:string,url:string,user_id:string) {
  const [result]  = await db.insert(feeds).values({name,url,user_id}).returning();
  return result;
    
}
export async function getFeeds() {
  const result= await db.select().from(feeds)
  .innerJoin(users, eq(feeds.user_id,users.id));
  return result;
  
}
export async function markFeedFetched(id:string){
  const [result] = await db.update(feeds).set({
    last_fetched_at: new Date(),
    updated_at:new Date(),
  })
  .where(eq(feeds.id,id));
}


