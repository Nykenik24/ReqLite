import { Command } from "commander";
import { requestDB } from "../../utils";
import chalk from "chalk";

export function listCommand(opts: any) {
  const display_data = opts.data ? true : false;
  const filter_method = opts.method ? opts.method : null;
  const filter_url = opts.url ? opts.url : null;
  const filter_bdate = opts.before ? opts.before : null;
  const filter_adate = opts.after ? opts.after : null;

  function parseDate(dateString: string): Date {
    const [day, month, year, hours, minutes, seconds] = dateString
      .split(/[\/ :]/)
      .map((str) => parseInt(str, 10));

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const filter = (request: any) => {
    let matches_method;
    let matches_url;
    let matches_bdate = true;
    let matches_adate = true;

    if (filter_method) {
      matches_method = request.method === filter_method;
    } else {
      matches_method = true;
    }

    if (filter_url) {
      matches_url = request.url === filter_url;
    } else {
      matches_url = true;
    }

    if (filter_bdate) {
      const beforeDate = parseDate(filter_bdate);
      const requestDate = parseDate(request.date);
      matches_bdate = requestDate < beforeDate;
    }

    if (filter_adate) {
      const afterDate = parseDate(filter_adate);
      const requestDate = parseDate(request.date);
      matches_adate = requestDate > afterDate;
    }

    if (matches_method && matches_url && matches_bdate && matches_adate) {
      return request;
    } else {
      return null;
    }
  };

  requestDB.data.requests.forEach((element) => {
    if (filter(element)) {
      console.log(chalk.gray("Request of ") + element.date);
      console.log(`| ${chalk.blue("Method")}: `, element.method);
      console.log(`| ${chalk.blue("URL")}: `, element.url);
      console.log(`| ${chalk.blue("Response time")}: ${element.delay}ms`);
      if (display_data)
        console.log(
          `| ${chalk.blue("Data")}: `,
          JSON.stringify(element.data, null, 2),
        );
    }
  });
}

export function registerListCommand(req: Command) {
  req
    .command("list")
    .description("list all requests")
    .option("-d, --data", "Also display data")
    .option("-m, --method <method>", "Filter by method")
    .option("-u, --url <url>", "Filter by URL")
    .option("-a, --after <date>", "Filter by requests after a date")
    .option("-b, --before <date>", "Filter by requests before a date")
    .action(listCommand);
}
