# User Guide Bridge

The User Guide Bridge is a simple microservice designed to route formatted help document requests from the `hub/ui` interface to an external 3rd party documentation API.

It can handle multiple applications if the help documentation service contains content for more than one application.

## Installation

### Prerequisites

- Node 12 or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a `default.json` file from `default.json.template` under the config directory and edit the values to ones for your environment. See configuration options below.

Run `$ npm install` to install dependencies.

Run `$ npm start` to run the development version of the server. Nodemon is used to restart the server on file changes.

### Production

Create a `production.json` from `production.json.template` and configure the values for your environment.

Run `npm run start:prod` to run the production configured server.

### Configuration Options

| Value                                                                       | Property       |
|-----------------------------------------------------------------------------|----------------|
| The host URL of the target API, e.g. `https://helpapi.com/api`              | `host`         |
| The port for Express to run on                                              | `port`         |
| The API auth token required to connect to the API                           | `token`        |
| An array of application names (generally tags)                              | `applications` |
| The [debug](https://www.npmjs.com/package/morgan) namespace for logging     | `logLevel`     |
| The format level for [Morgan](https://www.npmjs.com/package/morgan)         | `morganFormat` |
| An array of whitelisted UI urls, for CORS, e.g. `["http://localhost:8080"]` | `whitelist`    |

## Developer Guidelines

This project uses Eslint for linting, Prettier for code formatting and Jest for testing. It is recommended for continuity and to lighten the number of lines of code added to a Git commit that these plugins are enabled in your IDE of choice.
