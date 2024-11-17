import axios from "axios";
import config from "../config";
import { LANGUAGE_VERSIONS } from "../utils/constants";

// Create an instance of Axios for API requests
const API = axios.create({
  baseURL: config.BACKEND_API,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function executeCode(language, sourceCode, input) {
  const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
    stdin: input,
  });
  console.log("input", input);
  return response.data;
}

export default API;
