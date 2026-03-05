
import {setUser,readConfig} from "./config";
import { follow, following, unfollow } from "./fetchFeed";
import{middlewareLoggedIn}from "src/middlewareLoggedIn ";
import type {CommandsRegistry} from "./login command.";
import {registerCommand,handlerLogin,runCommand,handlerRegister,handlerreset, handlerusers, agg, addfeed, handlerfeeds, browse} from "./login command."
import { register } from "node:module";

 async function main() {
    const Registry  : CommandsRegistry={};
    registerCommand(Registry,"login",middlewareLoggedIn(handlerLogin));
    registerCommand(Registry, "register", handlerRegister);
    registerCommand(Registry, "reset", handlerreset);
    registerCommand(Registry,"users",handlerusers);
    registerCommand(Registry,"agg",agg);
    registerCommand(Registry,"addfeed",middlewareLoggedIn(addfeed));
    registerCommand(Registry,"feeds",handlerfeeds);
    registerCommand (Registry,"follow",middlewareLoggedIn(follow));
    registerCommand(Registry,"following",middlewareLoggedIn(following));
    registerCommand(Registry,"unfollow",middlewareLoggedIn(unfollow));
    registerCommand(Registry,"browse",browse);
    const args= process.argv.slice(2);
   if (args.length < 1) {
        console.error("Not enough arguments provided");
        process.exit(1);
    }
    const cmdName=args[0];
    const cmdArgs= args.slice(1);
    try{
     await   runCommand(Registry,cmdName, ...cmdArgs)
    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
    process.exit(0)

}


main();