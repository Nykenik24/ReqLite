import { Command } from "commander";
import axios from "axios";
import {
  getParsedData,
  handleHeaders,
  handleResponse,
  logError,
} from "./commons";
import crypto from "crypto";

export async function postCommand(url: string, data: any, opts: any) {
  const parse_as_json = opts.json ? true : false;
  const start = Date.now();
  const headers: { [key: string]: string } =
    opts.header.length > 0
      ? opts.header
      : { "User-Agent": `reqlite-${crypto.randomBytes(16).toString("hex")}` };

  try {
    const parsed_data = getParsedData(data);
    const response = await axios.post(
      url,
      parse_as_json ? JSON.parse(parsed_data) : parsed_data,
      { headers },
    );

    handleResponse(url, response, start);
  } catch (error: any) {
    handleResponse(url, error.response, start);
    logError(error);
  }
}

export function registerPostCommand(req: Command) {
  req
    .command("post")
    .description("Send a POST request.")
    .option("--json", "Parse data as JSON")
    .argument("<url>", "Target URL")
    .argument("<data>", "Data to send with the request")
    .option(
      "-H, --header",
      "Set a header to a specific value",
      handleHeaders,
      {} as { [key: string]: string },
    )
    .action(postCommand);
}
