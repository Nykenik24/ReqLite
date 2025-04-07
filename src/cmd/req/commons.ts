import { AxiosResponse } from "axios";
import { parseRequestData, saveRequest, statusCheck } from "../../utils";
import chalk from "chalk";
import { varDB } from "../var/var";
import { secretDB } from "../secret/secret";

export function logResponse(response: AxiosResponse, delay: number) {
  console.log(statusCheck(response.status));
  console.log(chalk.gray("Data: "), response.data);
  console.log(chalk.gray("Response time: ") + chalk.blue(`${delay}ms`));
}

export function logError(error: any) {
  if (error.response) {
    console.log(statusCheck(error.response.status));
    console.log(chalk.blue("Error: "), error.response.statustext);
  } else if (error.request) {
    console.log(chalk.gray("Status: ") + chalk.blue("No response received"));
  } else {
    console.log(chalk.red("Error: ") + error.message);
  }
}

export function handleResponse(
  url: string,
  response: AxiosResponse,
  start: number,
) {
  const delay = Date.now() - start;

  if (response) {
    logResponse(response, delay);
    saveRequest("GET", url, response.data, response.status, delay);
  }
}

export function getParsedData(data: any) {
  const secrets = secretDB.data.secrets;
  const variables = varDB.data.vars;
  return parseRequestData(data, secrets, variables);
}
