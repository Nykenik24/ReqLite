import chalk from "chalk";
import { Command } from "commander";
import axios from "axios";
import { getParsedData, handleResponse, logError } from "./commons";

export async function putCommand(url: string, data: any, opts: any) {
  const parse_as_json = opts.json ? true : false;
  const start = Date.now();

  try {
    const parsed_data = getParsedData(data);
    const response = await axios.put(
      url,
      parse_as_json ? JSON.parse(parsed_data) : parsed_data,
    );

    handleResponse(url, response, start);
  } catch (error: any) {
    handleResponse(url, error.response, start);
    logError(error);
  }
}

export function registerPutCommand(req: Command) {
  req
    .command("put")
    .description("Send a PUT request.")
    .option("--json", "Parse data as JSON")
    .argument("<url>", "Target URL")
    .argument("<data>", "Data to send with the request")
    .action(putCommand);
}
