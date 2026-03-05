import { desc } from "drizzle-orm";
import { db } from "..";
import { posts } from "../schema";


export async function createPost(title:string,url:string,description:string,published_at:Date,feed_id:string) {
  const [result]= await db.insert(posts).values({title,url,description,published_at,feed_id }).onConflictDoNothing({target:posts.url})
  .returning();
  return result;
  
}
export async function getPostsForUser(limit:number=2) {
    const result= await db.select().from(posts)
    .orderBy(desc(posts.published_at))
   .limit(limit);
return result;
    
}
