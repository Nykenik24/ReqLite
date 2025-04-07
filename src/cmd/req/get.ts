import axios from "axios";
import { Command } from "commander";
import { handleResponse, logError } from "./commons";

export async function getCommand(url: string) {
  const start = Date.now();

  try {
    const response = await axios.get(url);
    handleResponse(url, response, start);
  } catch (error: any) {
    handleResponse(url, error.response, start);
    logError(error);
  }
}

export function registerGetCommand(req: Command) {
  req
    .command("get")
    .description("Send a GET request.")
    .argument("<url>", "Target URL")
    .action(getCommand);
}
