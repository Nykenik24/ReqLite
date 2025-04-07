import axios, { AxiosError, AxiosResponse } from "axios";
import chalk from "chalk";
import { Command } from "commander";
import { saveRequest, statusCheck } from "../../utils";
import { handleResponse, logError, logResponse } from "./commons";
import { stat } from "fs";

export async function getCommand(url: string) {
  const start_time = Date.now();
  let end_time;

  try {
    const response = await axios.get(url);

    end_time = Date.now();
    const delay = end_time - start_time;

    console.log(statusCheck(response.status));
    console.log(chalk.gray("Data: "), response.data);
    console.log(chalk.gray("Response time: ") + chalk.blue(`${delay}ms`));
    saveRequest("GET", url, response.data, response.status, delay);
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

export async function getCommand_v2(url: string) {
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
    .action(getCommand_v2);
}
