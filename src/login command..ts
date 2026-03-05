import { stringify } from "node:querystring";
import { setUser,readConfig } from "./config";
import { GetUser,createUser, DeletUsers, GetUsers} from "./lib/db/queries/users";
import { config } from "node:process";
import { fetchFeed, scrapeFeeds } from "./fetchFeed";
import console from "node:console";
import { createFeed, getFeeds } from "./lib/db/queries/feedcommands";
import { feeds, users } from "./lib/db/schema";
import { createFeedFollow } from "./lib/db/queries/feedfollows";
import{UserCommandHandler} from "src/middlewareLoggedIn ";
import { getPostsForUser } from "./lib/db/queries/posts";
export type Feed = typeof feeds.$inferSelect;
export type User= typeof users.$inferSelect;




export type  CommandHandler=(cmdName:string, ...args:string[])=>Promise<void>;
  export const handlerLogin:UserCommandHandler= async(cmdName: string,user, ...args: string[])=>{
    if(args.length===0){
        throw new Error("The login command expects a username.");
        
    }
    const name= args[0];
    setUser(name);
 }
  export type CommandsRegistry= Record<string,CommandHandler>;
 
  export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
registry[cmdName]=handler;

}
  export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    
    const handler=registry[cmdName];
    if(handler){
    await handler(cmdName,...args);
     return; 
    }
    
    throw new Error("CommandName is not found");
}
export  async function  handlerRegister(cmdName:string, ...args:string[]) {

  if(args.length === 0){

    throw new Error("The register command expects a username.");

  }

  const name= args[0];

  const existingUser=await GetUser(name);

 if(existingUser){

  throw new Error("User already exists!");}

  else{

   const user=  await createUser(name);

   await setUser( user.name);

   console.log("User was created successfully!");

   console.log(user);}}
  

export async function handlerreset(cmdName:string, ...args:string[]) {
  try{
   await DeletUsers();
   console.log("Database has been reset successfully. All users deleted.");
  }
catch(err){
  throw new Error(`Failed to reset database: ${err}`);
}
  
}
export async function handlerusers(cmdName:string, ...args:string[]) {
 const users= await GetUsers();
 const currentUsername= readConfig().currentUserName;
users.forEach(user => {
 if(user.name === currentUsername){
  console.log(`* ${user.name} (current)`);
 }else{
  console.log(`* ${user.name}`);
 }
  
});

  
}
export async function handleError(error:unknown) {
  const timestamp = new Date().toLocaleTimeString();
if (error instanceof Error) {
    console.error(`[${timestamp}] ❌ Error: ${error.message}`);
  } else {
    console.error(`[${timestamp}] ❌ An unknown error occurred:`, error);
  }
  console.log("Retrying in the next cycle...");
  
}
export async function agg(cmdName:string, ...args:string[]) {

  const durationStr=args[0];
 
  const timeBetweenRequests= parseDuration(durationStr);
  scrapeFeeds().catch(handleError);
const interval = setInterval(() => {
  scrapeFeeds().catch(handleError);
}, timeBetweenRequests);
await new Promise<void>((resolve) => {
  process.on("SIGINT", () => {
    console.log("Shutting down feed aggregator...");
    clearInterval(interval);
    resolve();
  });
});
}
export const addfeed: UserCommandHandler= async(cmdName:string,user, ...args:string[]) =>{
  if (args.length < 2) {
    throw new Error("Usage: addfeed <name> <url>");
  }
  const name =args[0];
  const url = args[1];
  
   const feed=await createFeed(name,url,user.id);
 const followResult=  await createFeedFollow(user.id,feed.id);
   
  await printfeed(user,feed);
  console.log(`Feed '${followResult.feed_name}' added and followed by ${followResult.user_name}`);
}



  
  

export async function printfeed( user:User, feed:Feed) {
 console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.created_at}`);
  console.log(`* Updated:       ${feed.updated_at}`);
  console.log(`* Name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
export async function handlerfeeds(cmdName:string, ...args:string[]) {
  const allFeeds=await getFeeds();
  console.log(`Found ${allFeeds.length} feeds:`);
  allFeeds.forEach((item) => {
    console.log("---");
    console.log(`* Name:     ${ item.feeds.name}`);
    console.log(`* URL:      ${item.feeds.url}`);
    console.log(`* User:     ${ item.users.name}`);
  });
  console.log("---");
}
function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error("Invalid duration format. Use e.g., 10s, 1m, 1h");
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms": return value;
    case "s":  return value * 1000;
    case "m":  return value * 60 * 1000;
    case "h":  return value * 60 * 60 * 1000;
    default:   return 0;
  }
}
export async function browse(cmdName:string, ...args:string[]){
 const  limit = args[0] ? parseInt(args[0]) : 2;
  if (isNaN(limit)) {
    2;
}
   const posts=await getPostsForUser(limit);
  if (posts.length === 0) {
    console.log("No posts found. Try fetching some feeds first with 'agg'!");
    return;
  }

  console.log(`--- Showing latest ${posts.length} posts ---`);
  
  posts.forEach((post) => {
    console.log(`\n* ${post.title?.toUpperCase()}`); 
    console.log(`  Published: ${post.published_at.toLocaleString()}`); 
    console.log(`  Link: ${post.url}`);
    console.log(`  ${"-".repeat(20)}`); 
  });
}




  
