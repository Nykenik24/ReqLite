import axios from "axios";
import { Command } from "commander";
import { handleHeaders, handleResponse, logError } from "./commons";
import crypto from "crypto";

export async function deleteCommand_v2(url: string, opts: any) {
  const start = Date.now();
  const headers: { [key: string]: string } =
    opts.header.length > 0
      ? opts.header
      : { "User-Agent": `reqlite-${crypto.randomBytes(16).toString("hex")}` };

  try {
    const response = await axios.delete(url, { headers });
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
    .option(
      "-H, --header",
      "Set a header to a specific value",
      handleHeaders,
      {} as { [key: string]: string },
    )
    .action(deleteCommand_v2);
}
