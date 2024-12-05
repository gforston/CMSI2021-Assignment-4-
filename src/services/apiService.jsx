import { BalldontlieAPI } from "@balldontlie/sdk";
const key = import.meta.env.VITE_API_KEY;
const api = new BalldontlieAPI({
    //hide the api key and remove it from github
    //add key to .env to do stuff
    apiKey: key,
  });
export default api;