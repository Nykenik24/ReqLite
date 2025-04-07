# ReqLite
A VERY lightweight and user-friendly CLI to test HTTP/HTTPS APIs in a fast manner.

Not to be confused with [`ReQl`](https://rethinkdb.com/docs/introduction-to-reql/) or [`reql`](https://www.npmjs.com/package/reql).

# Features:
1. Quick request management: CURL power with a user-friendly approach.
2. Save secrets locally: `.env`-like secret storing.
3. Import/export request collections.
4. Save and run request templates.

# Commands
```
─── reql
    ├── req
    │   ├── get
    │   ├── post
    │   ├── put
    │   ├── delete
    │   └── list
    ├── templ # TODO
    │   ├── save
    │   └── run
    ├── var # TODO 
    │   ├── get
    │   └── set
    ├── secret # TODO
    │   ├── get
    │   └── set
    ├── export
    └── import
```
- `req`: Send HTTP/HTTPS requests.
    - `get`: Send a GET request.
    - `post`: Send a POST request.
    - `put`: Send a PUT request.
    - `delete`: Send a DELETE request.
    - `list`: List all requests saved.
- `templ`: Manage request templates.
    - `save`: Save a request template.
    - `run`: Load and run a request template.
- `var`: Manage local variables.
    - `get`: Get a variable.
    - `set`: Set a variable.
- `secret`: Manage secrets:
> NOTE: Secrets are confidential information (passwords, auth tokens...) stored at `.reqlite/secret.json`, it is recommended to ignore that file in `.gitignore` and create a `.reqlite/secret-example.json` (just like `.env` and `.env-example`).
    - `get`: Get a secret.
    - `set`: Set a secret.
- `export`: Export all requests saved.
- `import`: Import requests from a JSON file.

For more information on a command, run `reql <command> --help`

# Installation
Install reqlite with `npm i -g @nykenik24/reqlite`.

# Usage
> NOTE: I don't have any affilation with `coolshirts.com`, it's an example.
## Requests
### GET
```bash
reql req get "https//coolshirts.com/shirts/1"
```
### POST
```bash
reql req post "https://coolshirts.com/shirts/1" --json '{ "name": "cool shark shirt", "desc": "has a cool shark" }'
```
And to fill with environment variables or secrets:
```bash
reql req post "https://coolshirts.com/shirts/1" --json '{ "name": "cool shark shirt", "desc": "has a cool shark", "user_token": ".{{ .secrets.user_token }}" }'
```
### PUT
```bash
reql req put "https://coolshirts.com/shirts/1" --json ' { "name": "VERY cool shark shirt" }'
```
And to fill with environment variables or secrets:
```bash
reql req put "https://coolshirts.com/shirts/1" --json ' { "name": "VERY cool .{{ .vars.favorite_animal }} shirt" }'
```
### DELETE
```bash
reql req delete "https://coolshirts.com/shirts/1"
```
### List
`req list` is an additional command that lists all (saved) requests.

**Examples**:

List all requests
```bash
reql req list
```
List only GET requests
```bash
reql req list -m GET
```
List only requests to "https://coolshirts.com/shirts/1"
```bash
reql req list -u https://coolshirts.com/shirts/1
```
List requests after 7PM of 6, April, 2025
```bash
reql req list -a "06/04/2025 19:00:00"
```
## Secrets
### Getting secrets
To get a secret:
```bash
reql secret get <name>
```
Example:
```bash
> reql secret get db_password
Secret db_password: linus1970
```
### Setting secrets
To set a secret:
```bash
reql secret set <name> <value>
```
Example:
```bash
reql secret set password "phphater69"
```
## Variables
### Getting secrets
To get a secret:
```bash
reql var get <name>
```
Example:
```bash
> reql var get best_animal
Var best_animal: cat
```
### Setting secrets
To set a secret:
```bash
reql var set <name> <value>
```
Example:
```bash
reql var set who_loves_me "my horsey"
reql var set what_i_love "my horsey"
```
## Headers
To set headers, use the `-H` (or `--header`) option. It can be used multiple times.
```
reql req get "https://coolershirts.com/shirts/coolest/1" -H "Username: Jhon" -H "Password: JhonnyDoe123"
```
