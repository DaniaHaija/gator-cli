import { readConfig } from "src/config";
import{users} from "./lib/db/schema";
import{CommandHandler} from "src/login command."
import { GetUser } from "./lib/db/queries/users";
export type User= typeof users.$inferSelect;


 export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;


 export const middlewareLoggedIn = (handler: UserCommandHandler):CommandHandler =>{
    return async (cmdName: string, ...args: string[]) =>{
        const username= readConfig().currentUserName;
        if (!username) {
      throw new Error(`User ${username} not found`);

    }
    const user = await GetUser(username);
     return await handler(cmdName, user, ...args);
    };
};
