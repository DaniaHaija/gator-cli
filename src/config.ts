import fs from "fs";
import os from "os";
import path from "path";
  export type Config = {
  dbUrl: string;
  currentUserName?: string;
};
const configFilePath = path.join(os.homedir(), ".gatorconfig.json"); 


export function setUser(userName:string){
const rawData = fs.readFileSync(configFilePath, { encoding: "utf-8" });
const rawConfig = JSON.parse(rawData);
rawConfig.current_user_name = userName;


fs.writeFileSync(configFilePath,JSON.stringify(rawConfig, null, 2), {
    encoding: "utf-8",
  });
}



export function readConfig():Config{
const rawData = fs.readFileSync(configFilePath, { encoding: "utf-8" });
const  rawConfig = JSON.parse(rawData);
  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name
  };

  return config;
}




