import chalk from "chalk";
import { Command } from "commander";
import { parseRequestData, saveRequest, statusCheck } from "../../utils";
import axios from "axios";
import { varDB } from "../var/var";
import { secretDB } from "../secret/secret";
import { getParsedData, handleResponse, logError } from "./commons";
import { start } from "repl";

export async function postCommand(url: string, data: any, opts: any) {
  const parse_as_json = opts.json ? true : false;
  const start_time = Date.now();
  let end_time;

  try {
    const secrets = secretDB.data.secrets;
    const variables = varDB.data.vars;
    const parsed_data = parseRequestData(data, secrets, variables);
    const response = await axios.post(
      url,
      parse_as_json ? JSON.parse(parsed_data) : parsed_data,
    );

    end_time = Date.now();
    const delay = end_time - start_time;

    console.log(statusCheck(response.status));
    console.log(chalk.gray("Data: "), response.data);
    console.log(chalk.gray("Response time: ") + `${chalk.blue(delay)}ms`);
    saveRequest("POST", url, response.data, response.status, delay);
  } catch (error: any) {
    end_time = Date.now();
    const delay = end_time - start_time;

    if (error.response) {
      console.log(statusCheck(error.response.status));
      console.log(chalk.blue("Error: "), error.response.statustext);
    } else if (error.request) {
      console.log(chalk.gray("Status: ") + chalk.blue("No response received"));
    } else {
      console.log(chalk.red("Error: ") + error.message);
    }
    console.log(chalk.gray("Response time: ") + chalk.blue(`${delay}ms`));
  }
}

export async function postCommand_v2(url: string, data: any, opts: any) {
  const parse_as_json = opts.json ? true : false;
  const start = Date.now();
  try {
    const parsed_data = getParsedData(data);
    const response = await axios.post(
      url,
      parse_as_json ? JSON.parse(parsed_data) : parsed_data,
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
    .action(postCommand_v2);
}
