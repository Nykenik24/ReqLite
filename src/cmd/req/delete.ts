import axios from "axios";
import { Command } from "commander";
import { handleResponse, logError } from "./commons";

export async function deleteCommand_v2(url: string) {
  const start = Date.now();

  try {
    const response = await axios.delete(url);
    handleResponse(url, response, start);
  } catch (error: any) {
    handleResponse(url, error.response, start);
    logError(error);
  }
}

export function registerDeleteCommand(req: Command) {
  req
    .command("delete")
    .description("Send a DELETE request.")
    .argument("<url>", "Target URL")
    .action(deleteCommand_v2);
}
