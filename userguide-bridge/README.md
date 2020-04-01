# User Guide Bridge

The User Guide Bridge is a simple microservice designed to route formatted help document requests from the `hub/ui` interface to an external 3rd party documentation API.

## Installation

### Prerequisites

- Node 12 or newer
- Docker 18.09.1 or newer

### Bare Metal Install

Create a `default.json` file from `default.json.template` under the config directory and edit the values to ones for your environment. See configuration options below.

Run `$ npm start` to run the development version of the server. Nodemon is used to restart the server on file changes.

### Production

Create a `production.json` from `production.json.template` and configure the values for your environment.

Run `npm run start:prod` to run the production configured server.

### Configuration Options

| Property | Value |  
|-----------|-----------------------------------------|  
| `host` | The host URL of the target API, e.g. `https://helpapi.com/api` |  
| `port` | The port for Express to run on |  
| `token` | The API auth token required to connect to the API |  
| `logLevel` | The [debug](https://www.npmjs.com/package/morgan) namespace for logging |  
| `morganFormat` | The format level for [Morgan](https://www.npmjs.com/package/morgan) |  
| `whitelist` | An array of whitelisted UI urls, for CORS, e.g. `["http://localhost:8080"]` |

## Developer Guidelines

This project uses Eslint for linting, Prettier for code formatting and Jest for testing. It is recommended for continuity and to lighten the number of lines of code added to a Git commit that these plugins are enabled in your IDE of choice.